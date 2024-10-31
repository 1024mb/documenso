'use client';

import { useRouter } from 'next/navigation';

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

export const ZForgotPasswordFormSchema = (locale: string) => {
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

export type TForgotPasswordFormSchema = z.infer<ReturnType<typeof ZForgotPasswordFormSchema>>;

export type ForgotPasswordFormProps = {
  className?: string;
};

export const ForgotPasswordForm = ({ className }: ForgotPasswordFormProps) => {
  const { _ } = useLingui();
  const locale = useLingui().i18n.locale;

  const { toast } = useToast();

  const router = useRouter();

  const form = useForm<TForgotPasswordFormSchema>({
    values: {
      email: '',
    },
    resolver: zodResolver(ZForgotPasswordFormSchema(locale)),
  });

  const isSubmitting = form.formState.isSubmitting;

  const { mutateAsync: forgotPassword } = trpc.profile.forgotPassword.useMutation();

  const onFormSubmit = async ({ email }: TForgotPasswordFormSchema) => {
    await forgotPassword({ email }).catch(() => null);

    toast({
      title: _(msg`Reset email sent`),
      description: _(
        msg`A password reset email has been sent, if you have an account you should see it in your inbox shortly.`,
      ),
      duration: 5000,
    });

    form.reset();

    router.push('/check-email');
  };

  return (
    <Form {...form}>
      <form
        className={cn('flex w-full flex-col gap-y-4', className)}
        onSubmit={form.handleSubmit(onFormSubmit)}
      >
        <fieldset className="flex w-full flex-col gap-y-4" disabled={isSubmitting}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Trans>Email</Trans>
                </FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        <Button size="lg" loading={isSubmitting}>
          {isSubmitting ? <Trans>Sending Reset Email...</Trans> : <Trans>Reset Password</Trans>}
        </Button>
      </form>
    </Form>
  );
};
