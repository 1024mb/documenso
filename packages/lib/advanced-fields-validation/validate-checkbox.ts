import type { MessageDescriptor } from '@lingui/core';
import { msg } from '@lingui/macro';

import { checkboxValidationSigns } from '@documenso/ui/primitives/document-flow/field-items-advanced-settings/constants';

import type { TCheckboxFieldMeta } from '../types/field-meta';

export const validateCheckboxField = (
  values: string[],
  fieldMeta: TCheckboxFieldMeta,
  isSigningPage: boolean = false,
): MessageDescriptor[] => {
  const errors = [];

  const { readOnly, required, validationRule, validationLength } = fieldMeta;

  if (readOnly && required) {
    errors.push(msg`A field cannot be both read-only and required`);
  }

  if (values.length === 0) {
    errors.push(msg`At least one option must be added`);
  }

  if (readOnly && values.length === 0) {
    errors.push(msg`A read-only field must have at least one value`);
  }

  if (isSigningPage && required && values.length === 0) {
    errors.push(msg`Selecting an option is required`);
  }

  if (validationRule && !validationLength) {
    errors.push(msg`You need to specify the number of options for validation`);
  }

  if (validationLength && !validationRule) {
    errors.push(msg`You need to specify the validation rule`);
  }

  if (validationRule && validationLength) {
    const validation = checkboxValidationSigns.find((sign) => sign.label === validationRule);

    if (validation) {
      let lengthCondition = false;

      switch (validation.value) {
        case '=':
          lengthCondition = isSigningPage
            ? values.length !== validationLength
            : values.length < validationLength;
          break;
        case '>=':
          lengthCondition = values.length < validationLength;
          break;
        case '<=':
          lengthCondition = isSigningPage
            ? values.length > validationLength
            : values.length < validationLength;
          break;
      }

      if (lengthCondition) {
        let errorMessage;
        if (isSigningPage) {
          errorMessage = msg`You need to ${validationRule.toLowerCase()} ${validationLength} options`;
        } else {
          errorMessage =
            validation.value === '<='
              ? msg`You need to select at least ${validationLength} options`
              : msg`You need to add at least ${validationLength} options`;
        }

        errors.push(errorMessage);
      }
    }
  }

  return errors;
};
