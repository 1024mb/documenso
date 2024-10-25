import { createElement } from 'react';

import { msg } from '@lingui/macro';

import { mailer } from '@documenso/email/mailer';
import { render } from '@documenso/email/render';
import { templateConfirmationEmailData } from '@documenso/email/template-components/template-confirmation-email';
import { loadFooterTemplateData } from '@documenso/email/template-components/template-footer';
import {
  ConfirmEmailTemplate,
  confirmEmailTemplateData,
} from '@documenso/email/templates/confirm-email';
import { prisma } from '@documenso/prisma';

import { NEXT_PUBLIC_WEBAPP_URL } from '../../constants/app';
import type { TranslationsProps } from '../../utils/i18n.import';
import { getTranslation } from '../../utils/i18n.import';

export interface SendConfirmationEmailProps {
  userId: number;
}

export const sendConfirmationEmail = async ({
  userId,
  headers,
  cookies,
  locale,
}: SendConfirmationEmailProps & TranslationsProps) => {
  const NEXT_PRIVATE_SMTP_FROM_NAME = process.env.NEXT_PRIVATE_SMTP_FROM_NAME;
  const NEXT_PRIVATE_SMTP_FROM_ADDRESS = process.env.NEXT_PRIVATE_SMTP_FROM_ADDRESS;

  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: userId,
    },
    include: {
      VerificationToken: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    },
  });

  const [verificationToken] = user.VerificationToken;

  if (!verificationToken?.token) {
    throw new Error('Verification token not found for the user');
  }

  const assetBaseUrl = NEXT_PUBLIC_WEBAPP_URL() || 'http://localhost:3000';
  const confirmationLink = `${assetBaseUrl}/verify-email/${verificationToken.token}`;
  const senderName = NEXT_PRIVATE_SMTP_FROM_NAME || 'Documenso';
  const senderAddress = NEXT_PRIVATE_SMTP_FROM_ADDRESS || 'noreply@documenso.com';

  const confirmationTemplate = createElement(ConfirmEmailTemplate, {
    assetBaseUrl,
    confirmationLink,
    confirmEmailTemplateData: await confirmEmailTemplateData({
      headers: headers,
      cookies: cookies,
      locale: locale,
    }),
    templateConfirmationEmailData: await templateConfirmationEmailData({
      headers: headers,
      cookies: cookies,
      locale: locale,
    }),
    footerData: await loadFooterTemplateData({
      headers: headers,
      cookies: cookies,
      locale: locale,
    }),
  });

  const mailSubject = await getTranslation({
    headers: headers,
    cookies: cookies,
    locale: locale,
    message: [msg`Please confirm your email`],
  });

  return mailer.sendMail({
    to: {
      address: user.email,
      name: user.name || '',
    },
    from: {
      name: senderName,
      address: senderAddress,
    },
    subject: mailSubject[0],
    html: render(confirmationTemplate),
    text: render(confirmationTemplate, { plainText: true }),
  });
};
