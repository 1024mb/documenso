'use client';

import { useEffect, useState } from 'react';

import { wait } from 'next/dist/lib/wait';

import { zodResolver } from '@hookform/resolvers/zod';
import { Trans, msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { User } from '@documenso/prisma/client';
import { TRPCClientError } from '@documenso/trpc/client';
import { trpc } from '@documenso/trpc/react';
import { ZCurrentPasswordSchema, ZPasswordSchema } from '@documenso/trpc/server/auth-router/schema';
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
import { PasswordInput } from '@documenso/ui/primitives/password-input';
import { useToast } from '@documenso/ui/primitives/use-toast';

export type PasswordFormProps = {
  className?: string;
  user: User;
};

export const PasswordForm = ({ className }: PasswordFormProps) => {
  const { _, i18n } = useLingui();
  const { toast } = useToast();

  const locale = i18n.locale;

  const [isTriggered, setIsTriggered] = useState(false);

  const handleClickTrigger = () => {
    setIsTriggered(true);
  };

  const ZPasswordFormSchema = z
    .object({
      currentPassword: ZCurrentPasswordSchema(locale),
      password: ZPasswordSchema(locale),
      repeatedPassword: ZPasswordSchema(locale),
    })
    .refine((data) => data.password === data.repeatedPassword, {
      message: _(msg`Passwords do not match`),
      path: ['repeatedPassword'],
    });

  type TPasswordFormSchema = z.infer<typeof ZPasswordFormSchema>;

  const form = useForm<TPasswordFormSchema>({
    values: {
      currentPassword: '',
      password: '',
      repeatedPassword: '',
    },
    resolver: zodResolver(ZPasswordFormSchema),
  });

  const [isErrorsCleared, setIsErrorsCleared] = useState(false);

  useEffect(() => {
    if (!isTriggered) {
      return;
    }
    wait(70)
      .then(() => {
        form.clearErrors();
        setIsErrorsCleared(true);
      })
      .catch((error) => {
        console.error('Error during wait:', error);
      });
  }, [i18n.locale]);

  useEffect(() => {
    if (isErrorsCleared) {
      form
        .trigger()
        .then(() => {
          setIsErrorsCleared(false);
        })
        .catch((error) => {
          console.error('Error during form re-validation:', error);
          setIsErrorsCleared(false);
        });
    }
  }, [isErrorsCleared]);

  const isSubmitting = form.formState.isSubmitting;

  const { mutateAsync: updatePassword } = trpc.profile.updatePassword.useMutation();

  const onFormSubmit = async ({ currentPassword, password }: TPasswordFormSchema) => {
    try {
      await updatePassword({
        currentPassword,
        password,
      });

      form.reset();
      setIsErrorsCleared(false);
      setIsTriggered(false);

      toast({
        title: _(msg`Password updated`),
        description: _(msg`Your password has been updated successfully.`),
        duration: 5000,
      });
    } catch (err) {
      if (err instanceof TRPCClientError && err.data?.code === 'BAD_REQUEST') {
        toast({
          title: _(msg`An error occurred`),
          description: err.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: _(msg`An unknown error occurred`),
          description: _(
            msg`We encountered an unknown error while attempting to update your password. Please try again later.`,
          ),
          variant: 'destructive',
        });
      }
    }
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
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Trans>Current Password</Trans>
                </FormLabel>
                <FormControl>
                  <PasswordInput autoComplete="current-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Trans>Password</Trans>
                </FormLabel>
                <FormControl>
                  <PasswordInput autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="repeatedPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Trans>Repeat Password</Trans>
                </FormLabel>
                <FormControl>
                  <PasswordInput autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        <div className="ml-auto mt-4">
          <Button type="submit" loading={isSubmitting} onClick={handleClickTrigger}>
            {isSubmitting ? <Trans>Updating password...</Trans> : <Trans>Update password</Trans>}
          </Button>
        </div>
      </form>
    </Form>
  );
};
