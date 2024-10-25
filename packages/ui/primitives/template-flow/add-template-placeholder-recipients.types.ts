import { i18n } from '@lingui/core';
import { msg } from '@lingui/macro';
import { z } from 'zod';

import { ZRecipientActionAuthTypesSchema } from '@documenso/lib/types/document-auth';
import { loadAndActivateLocale } from '@documenso/lib/utils/i18n.import';
import { DocumentSigningOrder, RecipientRole } from '@documenso/prisma/client';

import { ZMapNegativeOneToUndefinedSchema } from '../document-flow/add-settings.types';

export const ZAddTemplatePlacholderRecipientsFormSchema = (locale: string) => {
  loadAndActivateLocale(locale)
    .then(() => {})
    .catch((err) => {
      console.error(err);
    });

  return z
    .object({
      signers: z.array(
        z.object({
          formId: z.string().min(1),
          nativeId: z.number().optional(),
          email: z
            .string()
            .min(1, { message: i18n._(msg`Email is required`) })
            .min(7, { message: i18n._(msg`Please enter a valid email address.`) }) // validation doesn't allow for one
            // character on local part of email.
            .regex(/^(?![-_.])[a-zA-Z0-9._%+-]{2,}(?<![-_.])@[a-zA-Z0-9-]{2,}\.[a-zA-Z]{2,63}$/, {
              message: i18n._(msg`Please enter a valid email address.`),
            })
            .email({ message: i18n._(msg`Invalid email address`) }),
          name: z.string(),
          role: z.nativeEnum(RecipientRole),
          signingOrder: z.number().optional(),
          actionAuth: ZMapNegativeOneToUndefinedSchema.pipe(
            ZRecipientActionAuthTypesSchema.optional(),
          ),
        }),
      ),
      signingOrder: z.nativeEnum(DocumentSigningOrder),
    })
    .refine(
      (schema) => {
        const emails = schema.signers.map((signer) => signer.email.toLowerCase());

        return new Set(emails).size === emails.length;
      },
      // Dirty hack to handle errors when .root is populated for an array type
      {
        message: i18n._(msg`Signers must have unique emails`),
        path: ['signers__root'],
      },
    );
};

export type TAddTemplatePlacholderRecipientsFormSchema = z.infer<
  ReturnType<typeof ZAddTemplatePlacholderRecipientsFormSchema>
>;
