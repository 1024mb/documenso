import { createElement } from 'react';

import { i18n } from '@lingui/core';
import { msg } from '@lingui/macro';
import { z } from 'zod';

import { mailer } from '@documenso/email/mailer';
import { render } from '@documenso/email/render';
import { templateDocumentInviteData } from '@documenso/email/template-components/template-document-invite';
import { loadFooterTemplateData } from '@documenso/email/template-components/template-footer';
import {
  DocumentInviteEmailTemplate,
  documentInviteEmailTemplateData,
} from '@documenso/email/templates/document-invite';
import { prisma } from '@documenso/prisma';
import {
  DocumentSource,
  DocumentStatus,
  RecipientRole,
  SendStatus,
} from '@documenso/prisma/client';

import { NEXT_PUBLIC_WEBAPP_URL } from '../../../constants/app';
import { FROM_ADDRESS, FROM_NAME } from '../../../constants/email';
import {
  RECIPIENT_ROLES_DESCRIPTION,
  RECIPIENT_ROLE_TO_EMAIL_TYPE,
} from '../../../constants/recipient-roles';
import { DOCUMENT_AUDIT_LOG_TYPE } from '../../../types/document-audit-logs';
import { ZRequestMetadataSchema } from '../../../universal/extract-request-metadata';
import { createDocumentAuditLogData } from '../../../utils/document-audit-logs';
import { getLocale } from '../../../utils/i18n';
import { loadAndActivateLocale } from '../../../utils/i18n.import';
import { renderCustomEmailTemplate } from '../../../utils/render-custom-email-template';
import { type JobDefinition } from '../../client/_internal/job';

const SEND_SIGNING_EMAIL_JOB_DEFINITION_ID = 'send.signing.requested.email';

const SEND_SIGNING_EMAIL_JOB_DEFINITION_SCHEMA = z.object({
  userId: z.number(),
  documentId: z.number(),
  recipientId: z.number(),
  requestMetadata: ZRequestMetadataSchema.optional(),
  headers: z.any().optional(),
  cookies: z.any().optional(),
  locale: z.string().optional(),
});

export const SEND_SIGNING_EMAIL_JOB_DEFINITION = {
  id: SEND_SIGNING_EMAIL_JOB_DEFINITION_ID,
  name: 'Send Signing Email',
  version: '1.0.0',
  trigger: {
    name: SEND_SIGNING_EMAIL_JOB_DEFINITION_ID,
    schema: SEND_SIGNING_EMAIL_JOB_DEFINITION_SCHEMA,
  },
  handler: async ({ payload, io }) => {
    const { userId, documentId, recipientId, requestMetadata, headers, cookies } = payload;

    const locale = getLocale({ headers: headers, cookies: cookies });
    await loadAndActivateLocale(locale);

    const [user, document, recipient] = await Promise.all([
      prisma.user.findFirstOrThrow({
        where: {
          id: userId,
        },
      }),
      prisma.document.findFirstOrThrow({
        where: {
          id: documentId,
          status: DocumentStatus.PENDING,
        },
        include: {
          documentMeta: true,
          team: {
            select: {
              teamEmail: true,
              name: true,
            },
          },
        },
      }),
      prisma.recipient.findFirstOrThrow({
        where: {
          id: recipientId,
        },
      }),
    ]);

    const { documentMeta, team } = document;

    if (recipient.role === RecipientRole.CC) {
      return;
    }

    const customEmail = document?.documentMeta;
    const isDirectTemplate = document.source === DocumentSource.TEMPLATE_DIRECT_LINK;
    const isTeamDocument = document.teamId !== null;

    const recipientEmailType = RECIPIENT_ROLE_TO_EMAIL_TYPE[recipient.role];

    const { email, name } = recipient;
    const selfSigner = email === user.email;
    const recipientActionVerb = i18n
      ._(RECIPIENT_ROLES_DESCRIPTION[recipient.role].actionVerb)
      .toLowerCase();
    const recipientProgressiveVerb = i18n
      ._(RECIPIENT_ROLES_DESCRIPTION[recipient.role].progressiveVerb)
      .toLowerCase();

    let emailMessage = customEmail?.message || '';
    let emailSubject = i18n._(msg`Please ${recipientActionVerb} this document`);

    if (selfSigner) {
      emailMessage = i18n._(
        msg`You have initiated the document "${document.title}" that requires you to ${recipientActionVerb} it.`,
      );
      emailSubject = i18n._(msg`Please ${recipientActionVerb} your document`);
    }

    if (isDirectTemplate) {
      emailMessage = i18n._(
        msg`A document was created by your direct template that requires you to ${recipientActionVerb} it.`,
      );
      emailSubject = i18n._(
        msg`Please ${recipientActionVerb} this document created by your direct template`,
      );
    }

    if (isTeamDocument && team) {
      emailSubject = i18n._(msg`${team.name} invited you to ${recipientActionVerb} a document`);
      emailMessage = i18n._(
        msg`${user.name} on behalf of ${team.name} has invited you to ${recipientActionVerb} the document "${document.title}".`,
      );
    }

    const customEmailTemplate = {
      'signer.name': name,
      'signer.email': email,
      'document.name': document.title,
    };

    const assetBaseUrl = NEXT_PUBLIC_WEBAPP_URL() || 'http://localhost:3000';
    const signDocumentLink = `${NEXT_PUBLIC_WEBAPP_URL()}/sign/${recipient.token}`;

    const template = createElement(DocumentInviteEmailTemplate, {
      documentName: document.title,
      inviterName: user.name || undefined,
      inviterEmail: isTeamDocument ? team?.teamEmail?.email || user.email : user.email,
      assetBaseUrl,
      signDocumentLink,
      customBody: renderCustomEmailTemplate(emailMessage, customEmailTemplate),
      role: recipient.role,
      selfSigner,
      isTeamInvite: isTeamDocument,
      teamName: team?.name,
      teamEmail: team?.teamEmail?.email,
      documentInviteEmailTemplateData: await documentInviteEmailTemplateData({
        headers: headers,
        cookies: cookies,
        recipientActionVerb: recipientActionVerb,
        documentName: document.title,
        inviterName: user.name || undefined,
        teamName: team?.name,
      }),
      templateDocumentInviteData: await templateDocumentInviteData({
        headers: headers,
        cookies: cookies,
        recipientActionVerb: recipientActionVerb,
        progressiveVerb: recipientProgressiveVerb,
        documentName: document.title,
        inviterName: user.name || undefined,
        teamName: team?.name,
      }),
      footerData: await loadFooterTemplateData({
        headers: payload.headers,
        cookies: payload.cookies,
      }),
    });

    await io.runTask('send-signing-email', async () => {
      await mailer.sendMail({
        to: {
          name: recipient.name,
          address: recipient.email,
        },
        from: {
          name: FROM_NAME,
          address: FROM_ADDRESS,
        },
        subject: renderCustomEmailTemplate(
          documentMeta?.subject || emailSubject,
          customEmailTemplate,
        ),
        html: render(template),
        text: render(template, { plainText: true }),
      });
    });

    await io.runTask('update-recipient', async () => {
      await prisma.recipient.update({
        where: {
          id: recipient.id,
        },
        data: {
          sendStatus: SendStatus.SENT,
        },
      });
    });

    await io.runTask('store-audit-log', async () => {
      await prisma.documentAuditLog.create({
        data: createDocumentAuditLogData({
          type: DOCUMENT_AUDIT_LOG_TYPE.EMAIL_SENT,
          documentId: document.id,
          user,
          requestMetadata,
          data: {
            emailType: recipientEmailType,
            recipientId: recipient.id,
            recipientName: recipient.name,
            recipientEmail: recipient.email,
            recipientRole: recipient.role,
            isResending: false,
          },
        }),
      });
    });
  },
} as const satisfies JobDefinition<
  typeof SEND_SIGNING_EMAIL_JOB_DEFINITION_ID,
  z.infer<typeof SEND_SIGNING_EMAIL_JOB_DEFINITION_SCHEMA>
>;
