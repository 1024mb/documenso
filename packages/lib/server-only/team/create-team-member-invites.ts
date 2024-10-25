import { createElement } from 'react';

import { msg } from '@lingui/macro';
import { nanoid } from 'nanoid';

import { mailer } from '@documenso/email/mailer';
import { render } from '@documenso/email/render';
import { loadFooterTemplateData } from '@documenso/email/template-components/template-footer';
import type { TeamInviteEmailProps } from '@documenso/email/templates/team-invite';
import {
  TeamInviteEmailTemplate,
  teamInviteEmailTemplateData,
} from '@documenso/email/templates/team-invite';
import { WEBAPP_BASE_URL } from '@documenso/lib/constants/app';
import { FROM_ADDRESS, FROM_NAME } from '@documenso/lib/constants/email';
import { TEAM_MEMBER_ROLE_PERMISSIONS_MAP } from '@documenso/lib/constants/teams';
import { AppError, AppErrorCode } from '@documenso/lib/errors/app-error';
import { isTeamRoleWithinUserHierarchy } from '@documenso/lib/utils/teams';
import { prisma } from '@documenso/prisma';
import { TeamMemberInviteStatus } from '@documenso/prisma/client';
import type { TCreateTeamMemberInvitesMutationSchema } from '@documenso/trpc/server/team-router/schema';

import type { TranslationsProps } from '../../utils/i18n.import';
import { getTranslation } from '../../utils/i18n.import';

export type CreateTeamMemberInvitesOptions = {
  userId: number;
  userName: string;
  teamId: number;
  invitations: TCreateTeamMemberInvitesMutationSchema['invitations'];
};

/**
 * Invite team members via email to join a team.
 */
export const createTeamMemberInvites = async ({
  userId,
  userName,
  teamId,
  invitations,
  headers,
  cookies,
}: CreateTeamMemberInvitesOptions & TranslationsProps) => {
  const team = await prisma.team.findFirstOrThrow({
    where: {
      id: teamId,
      members: {
        some: {
          userId,
          role: {
            in: TEAM_MEMBER_ROLE_PERMISSIONS_MAP['MANAGE_TEAM'],
          },
        },
      },
    },
    include: {
      members: {
        select: {
          role: true,
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      },
      invites: true,
    },
  });

  const teamMemberEmails = team.members.map((member) => member.user.email);
  const teamMemberInviteEmails = team.invites.map((invite) => invite.email);
  const currentTeamMember = team.members.find((member) => member.user.id === userId);

  if (!currentTeamMember) {
    throw new AppError(AppErrorCode.UNAUTHORIZED, 'User not part of team.');
  }

  const usersToInvite = invitations.filter((invitation) => {
    // Filter out users that are already members of the team.
    if (teamMemberEmails.includes(invitation.email)) {
      return false;
    }

    // Filter out users that have already been invited to the team.
    if (teamMemberInviteEmails.includes(invitation.email)) {
      return false;
    }

    return true;
  });

  const unauthorizedRoleAccess = usersToInvite.some(
    ({ role }) => !isTeamRoleWithinUserHierarchy(currentTeamMember.role, role),
  );

  if (unauthorizedRoleAccess) {
    throw new AppError(
      AppErrorCode.UNAUTHORIZED,
      'User does not have permission to set high level roles',
    );
  }

  const teamMemberInvites = usersToInvite.map(({ email, role }) => ({
    email,
    teamId,
    role,
    status: TeamMemberInviteStatus.PENDING,
    token: nanoid(32),
  }));

  await prisma.teamMemberInvite.createMany({
    data: teamMemberInvites,
  });

  const sendEmailResult = await Promise.allSettled(
    teamMemberInvites.map(async ({ email, token }) =>
      sendTeamMemberInviteEmail({
        email: email,
        token: token,
        teamName: team.name,
        teamUrl: team.url,
        senderName: userName,
        headers: headers,
        cookies: cookies,
      }),
    ),
  );

  const sendEmailResultErrorList = sendEmailResult.filter(
    (result): result is PromiseRejectedResult => result.status === 'rejected',
  );

  if (sendEmailResultErrorList.length > 0) {
    console.error(JSON.stringify(sendEmailResultErrorList));

    throw new AppError(
      'EmailDeliveryFailed',
      'Failed to send invite emails to one or more users.',
      `Failed to send invites to ${sendEmailResultErrorList.length}/${teamMemberInvites.length} users.`,
    );
  }
};

type SendTeamMemberInviteEmailOptions = Omit<
  TeamInviteEmailProps,
  'baseUrl' | 'assetBaseUrl' | 'teamInviteEmailTemplateData' | 'footerData'
> & {
  email: string;
};

/**
 * Send an email to a user inviting them to join a team.
 */
export const sendTeamMemberInviteEmail = async ({
  email,
  headers,
  cookies,
  ...emailTemplateOptions
}: SendTeamMemberInviteEmailOptions & TranslationsProps) => {
  const template = createElement(TeamInviteEmailTemplate, {
    assetBaseUrl: WEBAPP_BASE_URL,
    baseUrl: WEBAPP_BASE_URL,
    ...emailTemplateOptions,
    teamInviteEmailTemplateData: await teamInviteEmailTemplateData({
      headers: headers,
      cookies: cookies,
      teamName: emailTemplateOptions.teamName,
    }),
    footerData: await loadFooterTemplateData({
      headers: headers,
      cookies: cookies,
    }),
  });

  const mailSubject = await getTranslation({
    headers: headers,
    cookies: cookies,
    message: [msg`You have been invited to join ${emailTemplateOptions.teamName} on Documenso`],
  });

  await mailer.sendMail({
    to: email,
    from: {
      name: FROM_NAME,
      address: FROM_ADDRESS,
    },
    subject: mailSubject[0],
    html: render(template),
    text: render(template, { plainText: true }),
  });
};
