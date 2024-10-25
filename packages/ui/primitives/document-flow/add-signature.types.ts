import { i18n } from '@lingui/core';
import { msg } from '@lingui/macro';
import { z } from 'zod';

export const ZAddSignatureFormSchema = z.object({
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
  customText: z.string(),
  number: z.number().optional(),
  radio: z.string().optional(),
  checkbox: z.boolean().optional(),
  dropdown: z.string().optional(),
  signature: z.string(),
});

export type TAddSignatureFormSchema = z.infer<typeof ZAddSignatureFormSchema>;
