import { Trans, msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  CalendarDays,
  CheckSquare,
  ChevronDown,
  Contact,
  Disc,
  Hash,
  Mail,
  Type,
  User,
} from 'lucide-react';

import type { TFieldMetaSchema as FieldMetaType } from '@documenso/lib/types/field-meta';
import { FieldType } from '@documenso/prisma/client';

import { cn } from '../../lib/utils';

type FieldIconProps = {
  fieldMeta: FieldMetaType;
  type: FieldType;
  signerEmail?: string;
  fontCaveatClassName?: string;
};

const fieldIcons = {
  [FieldType.INITIALS]: { icon: Contact, label: msg`Initials` },
  [FieldType.EMAIL]: { icon: Mail, label: msg`Email` },
  [FieldType.NAME]: { icon: User, label: msg`Name` },
  [FieldType.DATE]: { icon: CalendarDays, label: msg`Date` },
  [FieldType.TEXT]: { icon: Type, label: msg`Text` },
  [FieldType.NUMBER]: { icon: Hash, label: msg`Number` },
  [FieldType.RADIO]: { icon: Disc, label: msg`Radio` },
  [FieldType.CHECKBOX]: { icon: CheckSquare, label: msg`Checkbox` },
  [FieldType.DROPDOWN]: { icon: ChevronDown, label: msg`Select` },
};

export const FieldIcon = ({
  fieldMeta,
  type,
  signerEmail,
  fontCaveatClassName,
}: FieldIconProps) => {
  const { _ } = useLingui();

  if (type === 'SIGNATURE' || type === 'FREE_SIGNATURE') {
    return (
      <div
        className={cn(
          'text-field-card-foreground flex items-center justify-center gap-x-1 text-[clamp(0.875rem,1.8cqw,1.2rem)]',
          fontCaveatClassName,
        )}
      >
        <Trans>Signature</Trans>
      </div>
    );
  } else {
    const Icon = fieldIcons[type]?.icon;
    let label;

    if (fieldMeta && (type === 'TEXT' || type === 'NUMBER')) {
      if (type === 'TEXT' && 'text' in fieldMeta && fieldMeta.text && !fieldMeta.label) {
        label =
          fieldMeta.text.length > 10 ? fieldMeta.text.substring(0, 10) + '...' : fieldMeta.text;
      } else if (fieldMeta.label) {
        label =
          fieldMeta.label.length > 10 ? fieldMeta.label.substring(0, 10) + '...' : fieldMeta.label;
      } else {
        label = _(fieldIcons[type]?.label);
      }
    } else {
      label = _(fieldIcons[type]?.label);
    }

    return (
      <div className="text-field-card-foreground flex items-center justify-center gap-x-1.5 text-[clamp(0.625rem,1cqw,0.825rem)]">
        <Icon className="h-4 w-4" /> {_(label)}
      </div>
    );
  }
};
