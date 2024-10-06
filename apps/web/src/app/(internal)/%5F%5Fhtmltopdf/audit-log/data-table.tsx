'use client';

import { Trans } from '@lingui/macro';
import { DateTime } from 'luxon';
import type { DateTimeFormatOptions } from 'luxon';
import { UAParser } from 'ua-parser-js';

import { APP_I18N_OPTIONS } from '@documenso/lib/constants/i18n';
import type { TDocumentAuditLog } from '@documenso/lib/types/document-audit-logs';
import { formatDocumentAuditLogAction } from '@documenso/lib/utils/document-audit-logs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@documenso/ui/primitives/table';

export type AuditLogDataTableProps = {
  logs: TDocumentAuditLog[];
};

const dateFormat: DateTimeFormatOptions = {
  ...DateTime.DATETIME_SHORT,
  hourCycle: 'h12',
};

export const AuditLogDataTable = ({ logs }: AuditLogDataTableProps) => {
  const parser = new UAParser();

  const uppercaseFistLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <Table overflowHidden>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Trans>Time</Trans>
          </TableHead>
          <TableHead>
            <Trans>User</Trans>
          </TableHead>
          <TableHead>
            <Trans>Action</Trans>
          </TableHead>
          <TableHead>
            <Trans>IP Address</Trans>
          </TableHead>
          <TableHead>
            <Trans>Browser</Trans>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody className="print:text-xs">
        {logs.map((log, i) => (
          <TableRow className="break-inside-avoid" key={i}>
            <TableCell>
              {DateTime.fromJSDate(log.createdAt)
                .setLocale(APP_I18N_OPTIONS.defaultLocale)
                .toLocaleString(dateFormat)}
            </TableCell>

            <TableCell>
              {log.name || log.email ? (
                <div>
                  {log.name && (
                    <p className="break-all" title={log.name}>
                      {log.name}
                    </p>
                  )}

                  {log.email && (
                    <p className="text-muted-foreground break-all" title={log.email}>
                      {log.email}
                    </p>
                  )}
                </div>
              ) : (
                <p>
                  <Trans>N/A</Trans>
                </p>
              )}
            </TableCell>

            <TableCell>
              {uppercaseFistLetter(formatDocumentAuditLogAction(log).description)}
            </TableCell>

            <TableCell>{log.ipAddress}</TableCell>

            <TableCell>
              {log.userAgent ? parser.setUA(log.userAgent).getBrowser().name : <Trans>N/A</Trans>}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
