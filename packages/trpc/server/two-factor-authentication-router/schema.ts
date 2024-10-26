import { i18n } from '@lingui/core';
import { msg } from '@lingui/macro';
import { z } from 'zod';

import { loadAndActivateLocale } from '@documenso/lib/utils/i18n.import';

export const ZEnableTwoFactorAuthenticationMutationSchema = (locale: string) => {
  loadAndActivateLocale(locale)
    .then(() => {})
    .catch((err) => {
      console.error(err);
    });

  return z.object({
    code: z.string().length(6, {
      message: i18n._(msg`The code must be exactly 6 characters long.`),
    }),
  });
};

export type TEnableTwoFactorAuthenticationMutationSchema = z.infer<
  ReturnType<typeof ZEnableTwoFactorAuthenticationMutationSchema>
>;

export const ZDisableTwoFactorAuthenticationMutationSchema = z.object({
  totpCode: z.string().trim().optional(),
  backupCode: z.string().trim().optional(),
});

export type TDisableTwoFactorAuthenticationMutationSchema = z.infer<
  typeof ZDisableTwoFactorAuthenticationMutationSchema
>;

export const ZViewRecoveryCodesMutationSchema = (locale: string) => {
  loadAndActivateLocale(locale)
    .then(() => {})
    .catch((err) => {
      console.error(err);
    });

  return z.object({
    token: z
      .string()
      .trim()
      .min(1, {
        message: i18n._(msg`Token must be at least 1 character long.`),
      }),
  });
};

export type TViewRecoveryCodesMutationSchema = z.infer<
  ReturnType<typeof ZViewRecoveryCodesMutationSchema>
>;
