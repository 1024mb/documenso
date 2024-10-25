import { createElement } from 'react';

import { msg } from '@lingui/macro';

import { mailer } from '@documenso/email/mailer';
import { render } from '@documenso/email/render';
import { templateDocumentDeleteData } from '@documenso/email/template-components/template-document-super-delete';
import { loadFooterTemplateData } from '@documenso/email/template-components/template-footer';
import {
  DocumentSuperDeleteEmailTemplate,
  documentSuperDeleteEmailTemplateData,
} from '@documenso/email/templates/document-super-delete';
import { prisma } from '@documenso/prisma';

import { NEXT_PUBLIC_WEBAPP_URL } from '../../constants/app';
import type { TranslationsProps } from '../../utils/i18n.import';
import { getTranslation } from '../../utils/i18n.import';

export interface SendDeleteEmailOptions {
  documentId: number;
  reason: string;
}

export const sendDeleteEmail = async ({
  documentId,
  reason,
  headers,
  cookies,
}: SendDeleteEmailOptions & TranslationsProps) => {
  const document = await prisma.document.findFirst({
    where: {
      id: documentId,
    },
    include: {
      User: true,
    },
  });

  if (!document) {
    throw new Error('Document not found');
  }

  const { email, name } = document.User;

  const assetBaseUrl = NEXT_PUBLIC_WEBAPP_URL() || 'http://localhost:3000';

  const template = createElement(DocumentSuperDeleteEmailTemplate, {
    documentName: document.title,
    reason: reason,
    assetBaseUrl: assetBaseUrl,
    documentSuperDeleteEmailTemplateData: await documentSuperDeleteEmailTemplateData({
      headers: headers,
      cookies: cookies,
      documentName: document.title,
    }),
    templateDocumentDeleteData: await templateDocumentDeleteData({
      headers: headers,
      cookies: cookies,
      documentName: document.title,
    }),
    footerData: await loadFooterTemplateData({ headers, cookies }),
  });

  const mailSubject = await getTranslation({
    headers: headers,
    cookies: cookies,
    message: [msg`Document Deleted!`],
  });

  await mailer.sendMail({
    to: {
      address: email,
      name: name || '',
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
