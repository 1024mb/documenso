import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { i18n } from '@lingui/core';
import { msg } from '@lingui/macro';
import { env } from 'next-runtime-env';

import { setupI18nSSR } from '@documenso/lib/client-only/providers/i18n.server';
import { IS_GOOGLE_SSO_ENABLED, IS_OIDC_SSO_ENABLED } from '@documenso/lib/constants/auth';
import { extractLocaleDataFromHeadersAlt } from '@documenso/lib/utils/i18n';
import { loadAndActivateLocale } from '@documenso/lib/utils/i18n.import';

import { SignUpFormV2 } from '~/components/forms/v2/signup';

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = extractLocaleDataFromHeadersAlt(headers());
  await loadAndActivateLocale(locale);

  const title = i18n._(msg`Sign Up`);

  return {
    title,
  };
};

export default function SignUpPage() {
  setupI18nSSR();

  const NEXT_PUBLIC_DISABLE_SIGNUP = env('NEXT_PUBLIC_DISABLE_SIGNUP');

  if (NEXT_PUBLIC_DISABLE_SIGNUP === 'true') {
    redirect('/signin');
  }

  return (
    <SignUpFormV2
      className="w-screen max-w-screen-2xl px-4 md:px-16 lg:-my-16"
      isGoogleSSOEnabled={IS_GOOGLE_SSO_ENABLED}
      isOIDCSSOEnabled={IS_OIDC_SSO_ENABLED}
    />
  );
}
