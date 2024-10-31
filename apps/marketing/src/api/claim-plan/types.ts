import { i18n } from '@lingui/core';
import { msg } from '@lingui/macro';
import { z } from 'zod';

import { getLocale } from '@documenso/lib/utils/i18n';
import type { TranslationsProps } from '@documenso/lib/utils/i18n.import';
import { loadAndActivateLocale } from '@documenso/lib/utils/i18n.import';

export const ZClaimPlanRequestSchema = ({ headers, cookies }: TranslationsProps) => {
  const locale = getLocale({ headers, cookies });
  loadAndActivateLocale(locale)
    .then(() => {})
    .catch((err) => {
      console.error(err);
    });

  return z
    .object({
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
        })
        .transform((value) => value.toLowerCase()),
      name: z.string(),
      planId: z.string(),
    })
    .and(
      z.union([
        z.object({
          signatureDataUrl: z.string().min(1),
          signatureText: z.null(),
        }),
        z.object({
          signatureDataUrl: z.null(),
          signatureText: z.string().min(1),
        }),
      ]),
    );
};

export type TClaimPlanRequestSchema = z.infer<ReturnType<typeof ZClaimPlanRequestSchema>>;

export const ZClaimPlanResponseSchema = z
  .object({
    redirectUrl: z.string(),
  })
  .or(
    z.object({
      error: z.string(),
    }),
  );

export type TClaimPlanResponseSchema = z.infer<typeof ZClaimPlanResponseSchema>;
