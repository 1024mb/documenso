import { i18n } from '@lingui/core';
import { msg } from '@lingui/macro';
import { z } from 'zod';

import { ZBaseTableSearchParamsSchema } from '@documenso/lib/types/search-params';
import { ZRegistrationResponseJSONSchema } from '@documenso/lib/types/webauthn';
import { loadAndActivateLocale } from '@documenso/lib/utils/i18n.import';

export const ZCurrentPasswordSchema = (locale: string = '') => {
  loadAndActivateLocale(locale)
    .then(() => {})
    .catch((err) => {
      console.error(err);
    });

  return z
    .string()
    .min(6, {
      message: i18n._(msg`Must be at least 6 characters in length`),
    })
    .max(72, {
      message: i18n._(msg`Cannot be more than 72 characters in length`),
    });
};

export const ZPasswordSchema = (locale: string = '') => {
  loadAndActivateLocale(locale)
    .then(() => {})
    .catch((err) => {
      console.error(err);
    });

  return z
    .string()
    .regex(new RegExp('.*[A-Z].*'), {
      message: i18n._(msg`One uppercase character`),
    })
    .regex(new RegExp('.*[a-z].*'), {
      message: i18n._(msg`One lowercase character`),
    })
    .regex(new RegExp('.*\\d.*'), {
      message: i18n._(msg`One number`),
    })
    .regex(new RegExp('.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*'), {
      message: i18n._(msg`One special character is required`),
    })
    .min(8, {
      message: i18n._(msg`Must be at least 8 characters in length`),
    })
    .max(72, {
      message: i18n._(msg`Cannot be more than 72 characters in length`),
    });
};

export const ZSignUpMutationSchema = (locale: string = '') => {
  loadAndActivateLocale(locale)
    .then(() => {})
    .catch((err) => {
      console.error(err);
    });

  return z.object({
    name: z.string().min(1),
    email: z
      .string()
      .min(1, {
        message: i18n._(msg`Email is required`),
      })
      .min(7, {
        message: i18n._(msg`Please enter a valid email address.`),
      }) // validation doesn't allow for one character on local part of email.
      .regex(/^(?![-_.])[a-zA-Z0-9._%+-]{2,}(?<![-_.])@[a-zA-Z0-9-]{2,}\.[a-zA-Z]{2,63}$/, {
        message: i18n._(msg`Please enter a valid email address.`),
      })
      .email({
        message: i18n._(msg`Invalid email address`),
      }),
    password: ZPasswordSchema(locale),
    signature: z.string().nullish(),
    url: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, {
        message: i18n._(msg`Username must be at least 1 character long.`),
      })
      .regex(/^[a-z0-9-]+$/, {
        message: i18n._(msg`Username can only contain alphanumeric characters and dashes.`),
      })
      .optional(),
  });
};

export const ZCreatePasskeyMutationSchema = z.object({
  passkeyName: z.string().trim().min(1),
  verificationResponse: ZRegistrationResponseJSONSchema,
});

export const ZCreatePasskeyAuthenticationOptionsMutationSchema = z
  .object({
    preferredPasskeyId: z.string().optional(),
  })
  .optional();

export const ZDeletePasskeyMutationSchema = z.object({
  passkeyId: z.string().trim().min(1),
});

export const ZUpdatePasskeyMutationSchema = z.object({
  passkeyId: z.string().trim().min(1),
  name: z.string().trim().min(1),
});

export const ZFindPasskeysQuerySchema = ZBaseTableSearchParamsSchema.extend({
  orderBy: z
    .object({
      column: z.enum(['createdAt', 'updatedAt', 'name']),
      direction: z.enum(['asc', 'desc']),
    })
    .optional(),
});

export type TSignUpMutationSchema = z.infer<ReturnType<typeof ZSignUpMutationSchema>>;

export const ZVerifyPasswordMutationSchema = (locale: string = '') => {
  return ZSignUpMutationSchema(locale).pick({ password: true });
};
