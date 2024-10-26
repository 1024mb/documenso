import { i18n } from '@lingui/core';
import { msg } from '@lingui/macro';
import { z } from 'zod';

import { loadAndActivateLocale } from '@documenso/lib/utils/i18n.import';
import { WebhookTriggerEvents } from '@documenso/prisma/client';

export const ZGetTeamWebhooksQuerySchema = z.object({
  teamId: z.number(),
});

export type TGetTeamWebhooksQuerySchema = z.infer<typeof ZGetTeamWebhooksQuerySchema>;

export const ZCreateWebhookMutationSchema = (locale: string) => {
  loadAndActivateLocale(locale)
    .then(() => {})
    .catch((err) => {
      console.error(err);
    });

  return z.object({
    webhookUrl: z.string().url({ message: i18n._(msg`Invalid URL`) }),
    eventTriggers: z
      .array(z.nativeEnum(WebhookTriggerEvents))
      .min(1, { message: i18n._(msg`At least one event trigger is required`) }),
    secret: z.string().nullable(),
    enabled: z.boolean(),
    teamId: z.number().optional(),
  });
};

export type TCreateWebhookFormSchema = z.infer<ReturnType<typeof ZCreateWebhookMutationSchema>>;

export const ZGetWebhookByIdQuerySchema = z.object({
  id: z.string(),
  teamId: z.number().optional(),
});

export type TGetWebhookByIdQuerySchema = z.infer<typeof ZGetWebhookByIdQuerySchema>;

export const ZEditWebhookMutationSchema = (locale: string) => {
  return ZCreateWebhookMutationSchema(locale).extend({
    id: z.string(),
  });
};

export type TEditWebhookMutationSchema = z.infer<ReturnType<typeof ZEditWebhookMutationSchema>>;

export const ZDeleteWebhookMutationSchema = z.object({
  id: z.string(),
  teamId: z.number().optional(),
});

export type TDeleteWebhookMutationSchema = z.infer<typeof ZDeleteWebhookMutationSchema>;
