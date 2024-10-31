import { i18n } from '@lingui/core';
import { msg } from '@lingui/macro';
import { z } from 'zod';

import { loadAndActivateLocale } from '@documenso/lib/utils/i18n.import';

import { ZBaseEmbedDataSchema } from '../../base-schema';

export const ZSignDocumentEmbedDataSchema = (locale: string) => {
  loadAndActivateLocale(locale)
    .then(() => {})
    .catch((err) => {
      console.error(err);
    });

  return ZBaseEmbedDataSchema.extend({
    email: z
      .union([
        z.literal(''),
        z
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
      ])
      .optional()
      .transform((value) => value || undefined),
    lockEmail: z.boolean().optional().default(false),
    name: z
      .string()
      .optional()
      .transform((value) => value || undefined),
    lockName: z.boolean().optional().default(false),
  });
};
