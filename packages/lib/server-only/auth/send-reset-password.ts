import { createElement } from 'react';

import { msg } from '@lingui/macro';

import { mailer } from '@documenso/email/mailer';
import { render } from '@documenso/email/render';
import { loadFooterTemplateData } from '@documenso/email/template-components/template-footer';
import { templateResetPasswordData } from '@documenso/email/template-components/template-reset-password';
import {
  ResetPasswordTemplate,
  resetPasswordTemplateData,
} from '@documenso/email/templates/reset-password';
import { prisma } from '@documenso/prisma';

import { NEXT_PUBLIC_WEBAPP_URL } from '../../constants/app';
import type { TranslationsProps } from '../../utils/i18n.import';
import { getTranslation } from '../../utils/i18n.import';

export interface SendResetPasswordOptions {
  userId: number;
}

export const sendResetPassword = async ({
  userId,
  headers,
  cookies,
}: SendResetPasswordOptions & TranslationsProps) => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: userId,
    },
  });

  const assetBaseUrl = NEXT_PUBLIC_WEBAPP_URL() || 'http://localhost:3000';

  const template = createElement(ResetPasswordTemplate, {
    assetBaseUrl,
    userEmail: user.email,
    userName: user.name || '',
    resetPasswordTemplateData: await resetPasswordTemplateData({
      headers: headers,
      cookies: cookies,
      userName: user.name || '',
    }),
    templateResetPasswordData: await templateResetPasswordData({
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
    message: [msg`Password Reset Success!`],
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
