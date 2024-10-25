import { createElement } from 'react';

import { msg } from '@lingui/macro';

import { mailer } from '@documenso/email/mailer';
import { render } from '@documenso/email/render';
import { templateDocumentPendingData } from '@documenso/email/template-components/template-document-pending';
import { loadFooterTemplateData } from '@documenso/email/template-components/template-footer';
import {
  DocumentPendingEmailTemplate,
  documentPendingEmailTemplateData,
} from '@documenso/email/templates/document-pending';
import { prisma } from '@documenso/prisma';

import { NEXT_PUBLIC_WEBAPP_URL } from '../../constants/app';
import type { TranslationsProps } from '../../utils/i18n.import';
import { getTranslation } from '../../utils/i18n.import';

export interface SendPendingEmailOptions {
  documentId: number;
  recipientId: number;
}

export const sendPendingEmail = async ({
  documentId,
  recipientId,
  headers,
  cookies,
}: SendPendingEmailOptions & TranslationsProps) => {
  const document = await prisma.document.findFirst({
    where: {
      id: documentId,
      Recipient: {
        some: {
          id: recipientId,
        },
      },
    },
    include: {
      Recipient: {
        where: {
          id: recipientId,
        },
      },
    },
  });

  if (!document) {
    throw new Error('Document not found');
  }

  if (document.Recipient.length === 0) {
    throw new Error('Document has no recipients');
  }

  const [recipient] = document.Recipient;

  const { email, name } = recipient;

  const assetBaseUrl = NEXT_PUBLIC_WEBAPP_URL() || 'http://localhost:3000';

  const template = createElement(DocumentPendingEmailTemplate, {
    documentName: document.title,
    assetBaseUrl: assetBaseUrl,
    documentPendingEmailTemplateData: await documentPendingEmailTemplateData({
      headers: headers,
      cookies: cookies,
    }),
    templateDocumentPendingData: await templateDocumentPendingData({
      documentName: document.title,
      headers: headers,
      cookies: cookies,
    }),
    footerData: await loadFooterTemplateData({ headers, cookies }),
  });

  const mailSubject = await getTranslation({
    headers: headers,
    cookies: cookies,
    message: [msg`Waiting for others to complete signing.`],
  });

  await mailer.sendMail({
    to: {
      address: email,
      name,
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
