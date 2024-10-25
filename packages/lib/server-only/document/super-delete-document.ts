'use server';

import { createElement } from 'react';

import { msg } from '@lingui/macro';

import { mailer } from '@documenso/email/mailer';
import { render } from '@documenso/email/render';
import { templateDocumentCancelData } from '@documenso/email/template-components/template-document-cancel';
import { loadFooterTemplateData } from '@documenso/email/template-components/template-footer';
import {
  DocumentCancelTemplate,
  documentCancelTemplateData,
} from '@documenso/email/templates/document-cancel';
import { prisma } from '@documenso/prisma';
import { DocumentStatus, SendStatus } from '@documenso/prisma/client';

import { NEXT_PUBLIC_WEBAPP_URL } from '../../constants/app';
import { FROM_ADDRESS, FROM_NAME } from '../../constants/email';
import { DOCUMENT_AUDIT_LOG_TYPE } from '../../types/document-audit-logs';
import type { RequestMetadata } from '../../universal/extract-request-metadata';
import { createDocumentAuditLogData } from '../../utils/document-audit-logs';
import type { TranslationsProps } from '../../utils/i18n.import';
import { getTranslation } from '../../utils/i18n.import';

export type SuperDeleteDocumentOptions = {
  id: number;
  requestMetadata?: RequestMetadata;
};

export const superDeleteDocument = async ({
  id,
  requestMetadata,
  headers,
  cookies,
}: SuperDeleteDocumentOptions & TranslationsProps) => {
  const document = await prisma.document.findUnique({
    where: {
      id,
    },
    include: {
      Recipient: true,
      documentMeta: true,
      User: true,
    },
  });

  if (!document) {
    throw new Error('Document not found');
  }

  const { status, User: user } = document;

  // if the document is pending, send cancellation emails to all recipients
  if (status === DocumentStatus.PENDING && document.Recipient.length > 0) {
    await Promise.all(
      document.Recipient.map(async (recipient) => {
        if (recipient.sendStatus !== SendStatus.SENT) {
          return;
        }

        const assetBaseUrl = NEXT_PUBLIC_WEBAPP_URL() || 'http://localhost:3000';

        const template = createElement(DocumentCancelTemplate, {
          documentName: document.title,
          inviterName: user.name || undefined,
          inviterEmail: user.email,
          assetBaseUrl: assetBaseUrl,
          documentCancelTemplateData: await documentCancelTemplateData({
            headers: headers,
            cookies: cookies,
            inviterName: user.name ?? '',
            documentName: document.title,
          }),
          templateDocumentCancelData: await templateDocumentCancelData({
            headers: headers,
            cookies: cookies,
            inviterName: user.name ?? '',
            documentName: document.title,
          }),
          footerData: await loadFooterTemplateData({
            headers: headers,
            cookies: cookies,
          }),
        });

        const mailSubject = await getTranslation({
          headers: headers,
          cookies: cookies,
          message: [msg`Document Cancelled`],
        });

        await mailer.sendMail({
          to: {
            address: recipient.email,
            name: recipient.name,
          },
          from: {
            name: FROM_NAME,
            address: FROM_ADDRESS,
          },
          subject: mailSubject[0],
          html: render(template),
          text: render(template, { plainText: true }),
        });
      }),
    );
  }

  // always hard delete if deleted from admin
  return await prisma.$transaction(async (tx) => {
    await tx.documentAuditLog.create({
      data: createDocumentAuditLogData({
        documentId: id,
        type: DOCUMENT_AUDIT_LOG_TYPE.DOCUMENT_DELETED,
        user,
        requestMetadata,
        data: {
          type: 'HARD',
        },
      }),
    });

    return await tx.document.delete({ where: { id } });
  });
};
