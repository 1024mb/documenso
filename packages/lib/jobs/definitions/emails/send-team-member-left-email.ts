import { msg } from '@lingui/macro';
import { z } from 'zod';

import { mailer } from '@documenso/email/mailer';
import { render } from '@documenso/email/render';
import { loadFooterTemplateData } from '@documenso/email/template-components/template-footer';
import {
  TeamLeaveEmailTemplate,
  teamLeaveEmailTemplateData,
} from '@documenso/email/templates/team-leave';
import { prisma } from '@documenso/prisma';
import { TeamMemberRole } from '@documenso/prisma/client';

import { WEBAPP_BASE_URL } from '../../../constants/app';
import { FROM_ADDRESS, FROM_NAME } from '../../../constants/email';
import { getTranslation } from '../../../utils/i18n.import';
import type { JobDefinition } from '../../client/_internal/job';

const SEND_TEAM_MEMBER_LEFT_EMAIL_JOB_DEFINITION_ID = 'send.team-member-left.email';

const SEND_TEAM_MEMBER_LEFT_EMAIL_JOB_DEFINITION_SCHEMA = z.object({
  teamId: z.number(),
  memberUserId: z.number(),
  headers: z.any().optional(),
  cookies: z.any().optional(),
});

export const SEND_TEAM_MEMBER_LEFT_EMAIL_JOB_DEFINITION = {
  id: SEND_TEAM_MEMBER_LEFT_EMAIL_JOB_DEFINITION_ID,
  name: 'Send Team Member Left Email',
  version: '1.0.0',
  trigger: {
    name: SEND_TEAM_MEMBER_LEFT_EMAIL_JOB_DEFINITION_ID,
    schema: SEND_TEAM_MEMBER_LEFT_EMAIL_JOB_DEFINITION_SCHEMA,
  },
  handler: async ({ payload, io }) => {
    const team = await prisma.team.findFirstOrThrow({
      where: {
        id: payload.teamId,
      },
      include: {
        members: {
          where: {
            role: {
              in: [TeamMemberRole.ADMIN, TeamMemberRole.MANAGER],
            },
          },
          include: {
            user: true,
          },
        },
      },
    });

    const oldMember = await prisma.user.findFirstOrThrow({
      where: {
        id: payload.memberUserId,
      },
    });

    for (const member of team.members) {
      await io.runTask(`send-team-member-left-email--${oldMember.id}_${member.id}`, async () => {
        const emailContent = TeamLeaveEmailTemplate({
          assetBaseUrl: WEBAPP_BASE_URL,
          baseUrl: WEBAPP_BASE_URL,
          memberName: oldMember.name || '',
          memberEmail: oldMember.email,
          teamName: team.name,
          teamUrl: team.url,
          teamLeaveEmailTemplateData: await teamLeaveEmailTemplateData({
            headers: payload.headers,
            cookies: payload.cookies,
            memberName: oldMember.name ?? '',
            memberEmail: oldMember.email,
            teamName: team.name,
          }),
          footerData: await loadFooterTemplateData({
            headers: payload.headers,
            cookies: payload.cookies,
          }),
        });

        const mailSubject = await getTranslation({
          headers: payload.headers,
          cookies: payload.cookies,
          message: [msg`A team member has left ${team.name}`],
        });

        await mailer.sendMail({
          to: member.user.email,
          from: {
            name: FROM_NAME,
            address: FROM_ADDRESS,
          },
          subject: mailSubject[0],
          html: render(emailContent),
          text: render(emailContent, { plainText: true }),
        });
      });
    }
  },
} as const satisfies JobDefinition<
  typeof SEND_TEAM_MEMBER_LEFT_EMAIL_JOB_DEFINITION_ID,
  z.infer<typeof SEND_TEAM_MEMBER_LEFT_EMAIL_JOB_DEFINITION_SCHEMA>
>;
