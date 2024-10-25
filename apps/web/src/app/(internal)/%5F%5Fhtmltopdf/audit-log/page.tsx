import React from 'react';

import { redirect } from 'next/navigation';

import { msg } from '@lingui/macro';
import { Trans } from '@lingui/react';
import { DateTime } from 'luxon';

import { APP_I18N_OPTIONS } from '@documenso/lib/constants/i18n';
import { RECIPIENT_ROLES_DESCRIPTION } from '@documenso/lib/constants/recipient-roles';
import { getEntireDocument } from '@documenso/lib/server-only/admin/get-entire-document';
import { decryptSecondaryData } from '@documenso/lib/server-only/crypto/decrypt';
import { findDocumentAuditLogs } from '@documenso/lib/server-only/document/find-document-audit-logs';
import { Card, CardContent } from '@documenso/ui/primitives/card';

import { Logo } from '~/components/branding/logo';

import { AuditLogDataTable } from './data-table';

type AuditLogProps = {
  searchParams: {
    d: string;
  };
};

export default async function AuditLog({ searchParams }: AuditLogProps) {
  const { d } = searchParams;

  if (typeof d !== 'string' || !d) {
    return redirect('/');
  }

  const rawDocumentId = decryptSecondaryData(d);

  if (!rawDocumentId || isNaN(Number(rawDocumentId))) {
    return redirect('/');
  }

  const documentId = Number(rawDocumentId);

  const document = await getEntireDocument({
    id: documentId,
  }).catch(() => null);

  if (!document) {
    return redirect('/');
  }

  const { data: auditLogs } = await findDocumentAuditLogs({
    documentId: documentId,
    userId: document.userId,
    perPage: 100_000,
  });

  return (
    <div className="print-provider pointer-events-none mx-auto max-w-screen-md">
      <div className="flex items-center">
        <h1 className="my-8 text-2xl font-bold">
          <Trans id={msg`Version History`.id} />
        </h1>
      </div>

      <Card>
        <CardContent className="grid grid-cols-2 gap-4 p-6 text-sm print:text-xs">
          <p>
            <span className="font-medium">
              <Trans id={msg`Document ID`.id} />
            </span>

            <span className="mt-1 block break-words">{document.id}</span>
          </p>

          <p>
            <span className="font-medium">
              <Trans id={msg`Enclosed Document`.id} />
            </span>

            <span className="mt-1 block break-words">{document.title}</span>
          </p>

          <p>
            <span className="font-medium">
              <Trans id={msg`Status`.id} />
            </span>

            <span className="mt-1 block">
              {document.deletedAt ? <Trans id={msg`DELETED`.id} /> : document.status}
            </span>
          </p>

          <p>
            <span className="font-medium">
              <Trans id={msg`Owner`.id} />
            </span>

            <span className="mt-1 block break-words">
              {document.User.name} ({document.User.email})
            </span>
          </p>

          <p>
            <span className="font-medium">
              <Trans id={msg`Created At`.id} />
            </span>

            <span className="mt-1 block">
              {DateTime.fromJSDate(document.createdAt)
                .setLocale(APP_I18N_OPTIONS.defaultLocale)
                .toFormat('yyyy-mm-dd hh:mm:ss a (ZZZZ)')}
            </span>
          </p>

          <p>
            <span className="font-medium">
              <Trans id={msg`Last Updated`.id} />
            </span>

            <span className="mt-1 block">
              {DateTime.fromJSDate(document.updatedAt)
                .setLocale(APP_I18N_OPTIONS.defaultLocale)
                .toFormat('yyyy-mm-dd hh:mm:ss a (ZZZZ)')}
            </span>
          </p>

          <p>
            <span className="font-medium">
              <Trans id={msg`Time Zone`.id} />
            </span>

            <span className="mt-1 block break-words">
              {document.documentMeta?.timezone ?? 'N/A'}
            </span>
          </p>

          <div>
            <p className="font-medium">
              <Trans id={msg`Recipients`.id} />
            </p>

            <ul className="mt-1 list-inside list-disc">
              {document.Recipient.map((recipient) => (
                <li key={recipient.id}>
                  <span className="text-muted-foreground">
                    [<Trans id={RECIPIENT_ROLES_DESCRIPTION[recipient.role].roleName.id} />]
                  </span>{' '}
                  {recipient.name} ({recipient.email})
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardContent className="p-0">
          <AuditLogDataTable logs={auditLogs} />
        </CardContent>
      </Card>

      <div className="my-8 flex-row-reverse">
        <div className="flex items-end justify-end gap-x-4">
          <Logo className="max-h-6 print:max-h-4" />
        </div>
      </div>
    </div>
  );
}
