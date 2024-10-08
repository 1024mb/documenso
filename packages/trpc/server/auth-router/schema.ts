import { i18n } from '@lingui/core';
import { msg } from '@lingui/macro';
import { z } from 'zod';

import { ZBaseTableSearchParamsSchema } from '@documenso/lib/types/search-params';
import { ZRegistrationResponseJSONSchema } from '@documenso/lib/types/webauthn';

export const ZCurrentPasswordSchema = (locale: string = 'en') => {
  import(`../../../lib/translations/${locale}/web.js`)
    .then(({ messages }) => {
      i18n.loadAndActivate({ locale, messages });
    })
    .catch((error) => {
      if (error instanceof Error && error.message.includes('404') && locale !== 'en') {
        console.error(`Failed to load translations for locale ${locale}:`, error);
        locale = 'en';

        import(`../../../lib/translations/${locale}/web.js`)
          .then(({ messages }) => {
            i18n.loadAndActivate({ locale, messages });
          })
          .catch((fallbackError) => {
            console.error(`Failed to load English translations:`, fallbackError);
          });
      } else {
        console.error(error);
      }
    });

  return z
    .string()
    .min(6, { message: i18n._(msg`Must be at least 6 characters in length`) })
    .max(72);
};

export const ZPasswordSchema = (locale: string = 'en') => {
  import(`../../../lib/translations/${locale}/web.js`)
    .then(({ messages }) => {
      i18n.loadAndActivate({ locale, messages });
    })
    .catch((error) => {
      if (error instanceof Error && error.message.includes('404') && locale !== 'en') {
        console.error(`Failed to load translations for locale ${locale}:`, error);
        locale = 'en';

        import(`../../../lib/translations/${locale}/web.js`)
          .then(({ messages }) => {
            i18n.loadAndActivate({ locale, messages });
          })
          .catch((fallbackError) => {
            console.error(`Failed to load English translations:`, fallbackError);
          });
      } else {
        console.error(error);
      }
    });

  return z
    .string()
    .regex(new RegExp('.*[A-Z].*'), { message: i18n._(msg`One uppercase character`) })
    .regex(new RegExp('.*[a-z].*'), { message: i18n._(msg`One lowercase character`) })
    .regex(new RegExp('.*\\d.*'), { message: i18n._(msg`One number`) })
    .regex(new RegExp('.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*'), {
      message: i18n._(msg`One special character is required`),
    })
    .min(8, { message: i18n._(msg`Must be at least 8 characters in length`) })
    .max(72, { message: i18n._(msg`Cannot be more than 72 characters in length`) });
};

export const ZSignUpMutationSchema = (locale: string = 'en') => {
  return z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: ZPasswordSchema(locale),
    signature: z.string().nullish(),
    url: z
      .string()
      .trim()
      .toLowerCase()
      .min(1)
      .regex(/^[a-z0-9-]+$/, {
        message: i18n._(msg`Username can only container alphanumeric characters and dashes.`),
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

export const ZVerifyPasswordMutationSchema = (locale: string = 'en') => {
  return ZSignUpMutationSchema(locale).pick({ password: true });
};
