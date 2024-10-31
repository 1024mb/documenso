import type { HTMLAttributes } from 'react';

import type { MessageDescriptor } from '@lingui/core';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { CheckCircle2, Clock, File } from 'lucide-react';
import type { LucideIcon } from 'lucide-react/dist/lucide-react';

import type { ExtendedDocumentStatus } from '@documenso/prisma/types/extended-document-status';
import { SignatureIcon } from '@documenso/ui/icons/signature';
import { cn } from '@documenso/ui/lib/utils';

type FriendlyStatus = {
  label: MessageDescriptor;
  labelUpper: MessageDescriptor;
  labelExtended: MessageDescriptor;
  icon?: LucideIcon;
  color: string;
};

export const FRIENDLY_STATUS_MAP: Record<ExtendedDocumentStatus, FriendlyStatus> = {
  PENDING: {
    label: msg`Pending`,
    labelUpper: msg`PENDING`,
    labelExtended: msg`Document pending`,
    icon: Clock,
    color: 'text-blue-600 dark:text-blue-300',
  },
  COMPLETED: {
    label: msg`Completed`,
    labelUpper: msg`COMPLETED`,
    labelExtended: msg`Document completed`,
    icon: CheckCircle2,
    color: 'text-green-500 dark:text-green-300',
  },
  DRAFT: {
    label: msg`Draft`,
    labelUpper: msg`DRAFT`,
    labelExtended: msg`Document draft`,
    icon: File,
    color: 'text-yellow-500 dark:text-yellow-200',
  },
  INBOX: {
    label: msg`Inbox`,
    labelUpper: msg`INBOX`,
    labelExtended: msg`Document inbox`,
    icon: SignatureIcon,
    color: 'text-muted-foreground',
  },
  ALL: {
    label: msg`All`,
    labelUpper: msg`ALL`,
    labelExtended: msg`Document All`,
    color: 'text-muted-foreground',
  },
};

export type DocumentStatusProps = HTMLAttributes<HTMLSpanElement> & {
  status: ExtendedDocumentStatus;
  inheritColor?: boolean;
};

export const DocumentStatus = ({
  className,
  status,
  inheritColor,
  ...props
}: DocumentStatusProps) => {
  const { _ } = useLingui();

  const { label, icon: Icon, color } = FRIENDLY_STATUS_MAP[status];

  return (
    <span className={cn('flex items-center', className)} {...props}>
      {Icon && (
        <Icon
          className={cn('mr-2 inline-block h-4 w-4', {
            [color]: !inheritColor,
          })}
        />
      )}
      {_(label)}
    </span>
  );
};
