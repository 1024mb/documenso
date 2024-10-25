import type { MessageDescriptor } from '@lingui/core';
import { msg } from '@lingui/macro';

import type {
  TDateFieldMeta as DateFieldMeta,
  TEmailFieldMeta as EmailFieldMeta,
  TInitialsFieldMeta as InitialsFieldMeta,
  TNameFieldMeta as NameFieldMeta,
} from '../types/field-meta';

export const validateFields = (
  fieldMeta: DateFieldMeta | EmailFieldMeta | InitialsFieldMeta | NameFieldMeta,
): MessageDescriptor[] => {
  const errors = [];
  const { fontSize } = fieldMeta;

  if (fontSize && (fontSize < 8 || fontSize > 96)) {
    errors.push(msg`Font size must be between 8 and 96.`);
  }

  return errors;
};
