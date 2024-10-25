import { createElement } from 'react';

import { msg } from '@lingui/macro';
import { z } from 'zod';

import { mailer } from '@documenso/email/mailer';
import { render } from '@documenso/email/render';
import { loadFooterTemplateData } from '@documenso/email/template-components/template-footer';
import {
  ConfirmTeamEmailTemplate,
  confirmTeamEmailData,
} from '@documenso/email/templates/confirm-team-email';
import { WEBAPP_BASE_URL } from '@documenso/lib/constants/app';
import { FROM_ADDRESS, FROM_NAME } from '@documenso/lib/constants/email';
import { TEAM_MEMBER_ROLE_PERMISSIONS_MAP } from '@documenso/lib/constants/teams';
import { AppError, AppErrorCode } from '@documenso/lib/errors/app-error';
import { createTokenVerification } from '@documenso/lib/utils/token-verification';
import { prisma } from '@documenso/prisma';
import { Prisma } from '@documenso/prisma/client';

import type { TranslationsProps } from '../../utils/i18n.import';
import { getTranslation } from '../../utils/i18n.import';

export type CreateTeamEmailVerificationOptions = {
  userId: number;
  teamId: number;
  data: {
    email: string;
    name: string;
  };
};

export type SendTeamEmailVerificationEmail = {
  email: string;
  token: string;
  teamName: string;
  teamUrl: string;
};

export const createTeamEmailVerification = async ({
  userId,
  teamId,
  data,
  headers,
  cookies,
}: CreateTeamEmailVerificationOptions & TranslationsProps) => {
  try {
    await prisma.$transaction(
      async (tx) => {
        const team = await tx.team.findFirstOrThrow({
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
            teamEmail: true,
            emailVerification: true,
          },
        });

        if (team.teamEmail || team.emailVerification) {
          throw new AppError(
            AppErrorCode.INVALID_REQUEST,
            'Team already has an email or existing email verification.',
          );
        }

        const existingTeamEmail = await tx.teamEmail.findFirst({
          where: {
            email: data.email,
          },
        });

        if (existingTeamEmail) {
          throw new AppError(AppErrorCode.ALREADY_EXISTS, 'Email already taken by another team.');
        }

        const { token, expiresAt } = createTokenVerification({ hours: 1 });

        await tx.teamEmailVerification.create({
          data: {
            token,
            expiresAt,
            email: data.email,
            name: data.name,
            teamId,
          },
        });

        await sendTeamEmailVerificationEmail({
          email: data.email,
          token: token,
          teamName: team.name,
          teamUrl: team.url,
          headers: headers,
          cookies: cookies,
        });
      },
      { timeout: 30_000 },
    );
  } catch (err) {
    console.error(err);

    if (!(err instanceof Prisma.PrismaClientKnownRequestError)) {
      throw err;
    }

    const target = z.array(z.string()).safeParse(err.meta?.target);

    if (err.code === 'P2002' && target.success && target.data.includes('email')) {
      throw new AppError(AppErrorCode.ALREADY_EXISTS, 'Email already taken by another team.');
    }

    throw err;
  }
};

/**
 * Send an email to a user asking them to accept a team email request.
 *
 * @param email The email address to use for the team.
 * @param token The token used to authenticate that the user has granted access.
 * @param teamName The name of the team the user is being invited to.
 * @param teamUrl The url of the team the user is being invited to.
 * @param headers Headers of the request
 * @param cookies Cookies of the request
 */
export const sendTeamEmailVerificationEmail = async ({
  email,
  token,
  teamName,
  teamUrl,
  headers,
  cookies,
}: SendTeamEmailVerificationEmail & TranslationsProps) => {
  const assetBaseUrl = process.env.NEXT_PUBLIC_WEBAPP_URL || 'http://localhost:3000';

  const template = createElement(ConfirmTeamEmailTemplate, {
    assetBaseUrl,
    baseUrl: WEBAPP_BASE_URL,
    teamName,
    teamUrl,
    token,
    confirmTeamEmailData: await confirmTeamEmailData({
      headers: headers,
      cookies: cookies,
      teamName: teamName,
    }),
    footerData: await loadFooterTemplateData({
      headers: headers,
      cookies: cookies,
    }),
  });

  const mailSubject = await getTranslation({
    headers: headers,
    cookies: cookies,
    message: [msg`A request to use your email has been initiated by ${teamName} on Documenso`],
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
