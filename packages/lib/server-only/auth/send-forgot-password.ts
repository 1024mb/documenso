import { createElement } from 'react';

import { msg } from '@lingui/macro';

import { mailer } from '@documenso/email/mailer';
import { render } from '@documenso/email/render';
import { loadFooterTemplateData } from '@documenso/email/template-components/template-footer';
import { templateForgotPasswordData } from '@documenso/email/template-components/template-forgot-password';
import {
  ForgotPasswordTemplate,
  forgotPasswordTemplateData,
} from '@documenso/email/templates/forgot-password';
import { prisma } from '@documenso/prisma';

import { NEXT_PUBLIC_WEBAPP_URL } from '../../constants/app';
import type { TranslationsProps } from '../../utils/i18n.import';
import { getTranslation } from '../../utils/i18n.import';

export interface SendForgotPasswordOptions {
  userId: number;
}

export const sendForgotPassword = async ({
  userId,
  headers,
  cookies,
}: SendForgotPasswordOptions & TranslationsProps) => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: userId,
    },
    include: {
      PasswordResetToken: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const token = user.PasswordResetToken[0].token;
  const assetBaseUrl = NEXT_PUBLIC_WEBAPP_URL() || 'http://localhost:3000';
  const resetPasswordLink = `${NEXT_PUBLIC_WEBAPP_URL()}/reset-password/${token}`;

  const template = createElement(ForgotPasswordTemplate, {
    assetBaseUrl: assetBaseUrl,
    resetPasswordLink: resetPasswordLink,
    forgotPasswordTemplateData: await forgotPasswordTemplateData({
      headers: headers,
      cookies: cookies,
    }),
    templateForgotPasswordData: await templateForgotPasswordData({
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
    message: [msg`Forgot Password?`],
  });

  return await mailer.sendMail({
    to: {
      address: user.email,
      name: user.name || '',
    },
    from: {
      name: process.env.NEXT_PRIVATE_SMTP_FROM_NAME || 'Documenso',
      address: process.env.NEXT_PRIVATE_SMTP_FROM_ADDRESS || 'noreply@documenso.com',
    },
    subject: mailSubject[0],
    html: render(template),
    text: render(template, { plainText: true }),
  });
};
