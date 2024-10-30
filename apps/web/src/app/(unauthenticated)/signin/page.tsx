import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';

import { i18n } from '@lingui/core';
import { Trans, msg } from '@lingui/macro';
import { env } from 'next-runtime-env';

import { setupI18nSSR } from '@documenso/lib/client-only/providers/i18n.server';
import {
  IS_GOOGLE_SSO_ENABLED,
  IS_OIDC_SSO_ENABLED,
  OIDC_PROVIDER_LABEL,
} from '@documenso/lib/constants/auth';
import { extractLocaleDataFromHeadersAlt } from '@documenso/lib/utils/i18n';
import { loadAndActivateLocale } from '@documenso/lib/utils/i18n.import';

import { SignInForm } from '~/components/forms/signin';

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = extractLocaleDataFromHeadersAlt(headers());
  await loadAndActivateLocale(locale);

  const title = i18n._(msg`Sign In`);

  return {
    title,
  };
};

export default function SignInPage() {
  setupI18nSSR();

  const NEXT_PUBLIC_DISABLE_SIGNUP = env('NEXT_PUBLIC_DISABLE_SIGNUP');

  return (
    <div className="w-screen max-w-lg px-4">
      <div className="border-border dark:bg-background z-10 rounded-xl border bg-neutral-100 p-6">
        <h1 className="text-2xl font-semibold">
          <Trans>Sign in to your account</Trans>
        </h1>

        <p className="text-muted-foreground mt-2 text-sm">
          <Trans>Welcome back, we are lucky to have you.</Trans>
        </p>
        <hr className="-mx-6 my-4" />

        <SignInForm
          isGoogleSSOEnabled={IS_GOOGLE_SSO_ENABLED}
          isOIDCSSOEnabled={IS_OIDC_SSO_ENABLED}
          oidcProviderLabel={OIDC_PROVIDER_LABEL}
        />

        {NEXT_PUBLIC_DISABLE_SIGNUP !== 'true' && (
          <p className="text-muted-foreground mt-6 text-center text-sm">
            <Trans>
              Don't have an account?{' '}
              <Link href="/signup" className="text-documenso-700 duration-200 hover:opacity-70">
                Sign up
              </Link>
            </Trans>
          </p>
        )}
      </div>
    </div>
  );
}
