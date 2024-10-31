import { i18n } from '@lingui/core';
import { msg } from '@lingui/macro';
import { z } from 'zod';

import { loadAndActivateLocale } from '@documenso/lib/utils/i18n.import';

export const ZGetApiTokenByIdQuerySchema = z.object({
  id: z.number().min(1),
});

export type TGetApiTokenByIdQuerySchema = z.infer<typeof ZGetApiTokenByIdQuerySchema>;

export const ZCreateTokenMutationSchema = (locale: string = '') => {
  loadAndActivateLocale(locale)
    .then(() => {})
    .catch((err) => {
      console.error(err);
    });

  return z.object({
    teamId: z.number().optional(),
    tokenName: z.string().min(3, {
      message: i18n._(msg`The token name should be 3 characters or longer`),
    }),
    expirationDate: z.string().nullable(),
  });
};

export type TCreateTokenMutationSchema = z.infer<ReturnType<typeof ZCreateTokenMutationSchema>>;

export const ZDeleteTokenByIdMutationSchema = z.object({
  id: z.number().min(1),
  teamId: z.number().optional(),
});

export type TDeleteTokenByIdMutationSchema = z.infer<typeof ZDeleteTokenByIdMutationSchema>;
