import type { MessageDescriptor } from '@lingui/core';
import { msg } from '@lingui/macro';

import type { TTextFieldMeta as TextFieldMeta } from '../types/field-meta';

export const validateTextField = (
  value: string,
  fieldMeta: TextFieldMeta,
  isSigningPage: boolean = false,
): MessageDescriptor[] => {
  const errors = [];

  const { characterLimit, readOnly, required, fontSize } = fieldMeta;

  if (required && !value && isSigningPage) {
    errors.push(msg`Value is required`);
  }

  if (characterLimit !== undefined && characterLimit > 0 && value.length > characterLimit) {
    errors.push(
      msg`Value length (${value.length}) exceeds the character limit (${characterLimit})`,
    );
  }

  if (readOnly && value.length < 1) {
    errors.push(msg`A read-only field must have text`);
  }

  if (readOnly && required) {
    errors.push(msg`A field cannot be both read-only and required`);
  }

  if (fontSize && (fontSize < 8 || fontSize > 96)) {
    errors.push(msg`Font size must be between 8 and 96.`);
  }

  return errors;
};
