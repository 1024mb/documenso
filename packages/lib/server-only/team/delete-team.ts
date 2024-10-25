import { createElement } from 'react';

import { msg } from '@lingui/macro';

import { mailer } from '@documenso/email/mailer';
import { render } from '@documenso/email/render';
import { loadFooterTemplateData } from '@documenso/email/template-components/template-footer';
import type { TeamDeleteEmailProps } from '@documenso/email/templates/team-delete';
import {
  TeamDeleteEmailTemplate,
  teamDeleteEmailTemplateData,
} from '@documenso/email/templates/team-delete';
import { WEBAPP_BASE_URL } from '@documenso/lib/constants/app';
import { FROM_ADDRESS, FROM_NAME } from '@documenso/lib/constants/email';
import { AppError } from '@documenso/lib/errors/app-error';
import { stripe } from '@documenso/lib/server-only/stripe';
import { prisma } from '@documenso/prisma';

import { jobs } from '../../jobs/client';
import type { TranslationsProps } from '../../utils/i18n.import';
import { getTranslation } from '../../utils/i18n.import';

export type DeleteTeamOptions = {
  userId: number;
  teamId: number;
};

export const deleteTeam = async ({
  userId,
  teamId,
  headers,
  cookies,
}: DeleteTeamOptions & TranslationsProps) => {
  await prisma.$transaction(
    async (tx) => {
      const team = await tx.team.findFirstOrThrow({
        where: {
          id: teamId,
          ownerUserId: userId,
        },
        include: {
          subscription: true,
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (team.subscription) {
        await stripe.subscriptions
          .cancel(team.subscription.planId, {
            prorate: false,
            invoice_now: true,
          })
          .catch((err) => {
            console.error(err);
            throw AppError.parseError(err);
          });
      }

      await jobs.triggerJob({
        name: 'send.team-deleted.email',
        payload: {
          team: {
            name: team.name,
            url: team.url,
            ownerUserId: team.ownerUserId,
          },
          members: team.members.map((member) => ({
            id: member.user.id,
            name: member.user.name || '',
            email: member.user.email,
          })),
          headers: headers,
          cookies: cookies,
        },
      });

      await tx.team.delete({
        where: {
          id: teamId,
          ownerUserId: userId,
        },
      });
    },
    { timeout: 30_000 },
  );
};

type SendTeamDeleteEmailOptions = Omit<
  TeamDeleteEmailProps,
  'baseUrl' | 'assetBaseUrl' | 'teamDeleteEmailTemplateData' | 'footerData'
> & {
  email: string;
  teamName: string;
};

export const sendTeamDeleteEmail = async ({
  email,
  headers,
  cookies,
  ...emailTemplateOptions
}: SendTeamDeleteEmailOptions & TranslationsProps) => {
  const template = createElement(TeamDeleteEmailTemplate, {
    assetBaseUrl: WEBAPP_BASE_URL,
    baseUrl: WEBAPP_BASE_URL,
    ...emailTemplateOptions,
    teamDeleteEmailTemplateData: await teamDeleteEmailTemplateData({
      headers: headers,
      cookies: cookies,
    }),
    footerData: await loadFooterTemplateData({
      headers: headers,
      cookies: cookies,
    }),
  });

  const mailSubject = await getTranslation({
    headers: headers,
    cookies: cookies,
    message: [msg`Team "${emailTemplateOptions.teamName}" has been deleted on Documenso`],
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
