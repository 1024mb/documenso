'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { i18n } from '@lingui/core';
import { Trans, msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { loadAndActivateLocale } from '@documenso/lib/utils/i18n.import';
import { trpc } from '@documenso/trpc/react';
import { cn } from '@documenso/ui/lib/utils';
import { Button } from '@documenso/ui/primitives/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@documenso/ui/primitives/form/form';
import { Input } from '@documenso/ui/primitives/input';
import { useToast } from '@documenso/ui/primitives/use-toast';

export const ZSendConfirmationEmailFormSchema = (locale: string) => {
  loadAndActivateLocale(locale)
    .then(() => {})
    .catch((err) => {
      console.error(err);
    });

  return z.object({
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
  });
};

export type TSendConfirmationEmailFormSchema = z.infer<
  ReturnType<typeof ZSendConfirmationEmailFormSchema>
>;

export type SendConfirmationEmailFormProps = {
  className?: string;
};

export const SendConfirmationEmailForm = ({ className }: SendConfirmationEmailFormProps) => {
  const { _ } = useLingui();
  const locale = useLingui().i18n.locale;

  const { toast } = useToast();

  const form = useForm<TSendConfirmationEmailFormSchema>({
    values: {
      email: '',
    },
    resolver: zodResolver(ZSendConfirmationEmailFormSchema(locale)),
  });

  const isSubmitting = form.formState.isSubmitting;

  const { mutateAsync: sendConfirmationEmail } = trpc.profile.sendConfirmationEmail.useMutation();

  const onFormSubmit = async ({ email }: TSendConfirmationEmailFormSchema) => {
    try {
      await sendConfirmationEmail({ email });

      toast({
        title: _(msg`Confirmation email sent`),
        description: _(
          msg`A confirmation email has been sent, and it should arrive in your inbox shortly.`,
        ),
        duration: 5000,
      });

      form.reset();
    } catch (err) {
      toast({
        title: _(msg`An error occurred while sending your confirmation email`),
        description: _(msg`Please try again and make sure you enter the correct email address.`),
      });
    }
  };

  return (
    <Form {...form}>
      <form
        className={cn('mt-6 flex w-full flex-col gap-y-4', className)}
        onSubmit={form.handleSubmit(onFormSubmit)}
      >
        <fieldset className="flex w-full flex-col gap-y-4" disabled={isSubmitting}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Trans>Email address</Trans>
                </FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button size="lg" type="submit" disabled={isSubmitting} loading={isSubmitting}>
            <Trans>Send confirmation email</Trans>
          </Button>
        </fieldset>
      </form>
    </Form>
  );
};
