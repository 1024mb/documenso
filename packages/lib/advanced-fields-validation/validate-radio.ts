import type { MessageDescriptor } from '@lingui/core';
import { msg } from '@lingui/macro';

import type { TRadioFieldMeta as RadioFieldMeta } from '../types/field-meta';

export const validateRadioField = (
  value: string | undefined,
  fieldMeta: RadioFieldMeta,
  isSigningPage: boolean = false,
): MessageDescriptor[] => {
  const errors = [];

  const { readOnly, required, values } = fieldMeta;

  if (readOnly && required) {
    errors.push(msg`A field cannot be both read-only and required`);
  }

  if (readOnly && (!values || values.length === 0)) {
    errors.push(msg`A read-only field must have at least one value`);
  }

  if (isSigningPage && required && !value) {
    errors.push(msg`Choosing an option is required`);
  }

  if (values) {
    const checkedRadioFieldValues = values.filter((option) => option.checked);

    if (values.length === 0) {
      errors.push(msg`Radio field must have at least one option`);
    }

    if (checkedRadioFieldValues.length > 1) {
      errors.push(msg`There cannot be more than one checked option`);
    }
  }

  return errors;
};
