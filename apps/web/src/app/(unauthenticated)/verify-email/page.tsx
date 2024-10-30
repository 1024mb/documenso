import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';

import { i18n } from '@lingui/core';
import { Trans, msg } from '@lingui/macro';
import { XCircle } from 'lucide-react';

import { setupI18nSSR } from '@documenso/lib/client-only/providers/i18n.server';
import { extractLocaleDataFromHeadersAlt } from '@documenso/lib/utils/i18n';
import { loadAndActivateLocale } from '@documenso/lib/utils/i18n.import';
import { Button } from '@documenso/ui/primitives/button';

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = extractLocaleDataFromHeadersAlt(headers());
  await loadAndActivateLocale(locale);

  const title = i18n._(msg`Verify Email`);

  return {
    title,
  };
};

export default function EmailVerificationWithoutTokenPage() {
  setupI18nSSR();

  return (
    <div className="w-screen max-w-lg px-4">
      <div className="flex w-full items-start">
        <div className="mr-4 mt-1 hidden md:block">
          <XCircle className="text-destructive h-10 w-10" strokeWidth={2} />
        </div>

        <div>
          <h2 className="text-2xl font-bold md:text-4xl">
            <Trans>Uh oh! Looks like you're missing a token</Trans>
          </h2>

          <p className="text-muted-foreground mt-4">
            <Trans>
              It seems that there is no token provided, if you are trying to verify your email
              please follow the link in your email.
            </Trans>
          </p>

          <Button className="mt-4" asChild>
            <Link href="/">
              <Trans>Go back home</Trans>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
