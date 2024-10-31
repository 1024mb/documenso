import { i18n } from '@lingui/core';
import { msg } from '@lingui/macro';
import { z } from 'zod';

import { DEFAULT_DOCUMENT_DATE_FORMAT } from '@documenso/lib/constants/date-formats';
import { DEFAULT_DOCUMENT_TIME_ZONE } from '@documenso/lib/constants/time-zones';
import {
  ZDocumentAccessAuthTypesSchema,
  ZDocumentActionAuthTypesSchema,
} from '@documenso/lib/types/document-auth';
import { loadAndActivateLocale } from '@documenso/lib/utils/i18n.import';
import { isValidRedirectUrl } from '@documenso/lib/utils/is-valid-redirect-url';

import { ZMapNegativeOneToUndefinedSchema } from '../document-flow/add-settings.types';

export const ZAddTemplateSettingsFormSchema = (locale: string) => {
  loadAndActivateLocale(locale)
    .then(() => {})
    .catch((err) => {
      console.error(err);
    });

  return z.object({
    title: z
      .string()
      .trim()
      .min(1, {
        message: i18n._(msg`Title can't be empty`),
      }),
    externalId: z.string().optional(),
    globalAccessAuth: ZMapNegativeOneToUndefinedSchema.pipe(
      ZDocumentAccessAuthTypesSchema.optional(),
    ),
    globalActionAuth: ZMapNegativeOneToUndefinedSchema.pipe(
      ZDocumentActionAuthTypesSchema.optional(),
    ),
    meta: z.object({
      subject: z.string(),
      message: z.string(),
      timezone: z.string().optional().default(DEFAULT_DOCUMENT_TIME_ZONE),
      dateFormat: z.string().optional().default(DEFAULT_DOCUMENT_DATE_FORMAT),
      redirectUrl: z
        .string()
        .optional()
        .refine((value) => value === undefined || value === '' || isValidRedirectUrl(value), {
          message: i18n._(
            msg`Please enter a valid URL, make sure you include http:// or https:// part of the url.`,
          ),
        }),
    }),
  });
};

export type TAddTemplateSettingsFormSchema = z.infer<
  ReturnType<typeof ZAddTemplateSettingsFormSchema>
>;
