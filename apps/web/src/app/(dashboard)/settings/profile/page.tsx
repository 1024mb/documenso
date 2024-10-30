import type { Metadata } from 'next';
import { headers } from 'next/headers';

import { i18n } from '@lingui/core';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { setupI18nSSR } from '@documenso/lib/client-only/providers/i18n.server';
import { getRequiredServerComponentSession } from '@documenso/lib/next-auth/get-server-component-session';
import { extractLocaleDataFromHeadersAlt } from '@documenso/lib/utils/i18n';
import { loadAndActivateLocale } from '@documenso/lib/utils/i18n.import';

import { SettingsHeader } from '~/components/(dashboard)/settings/layout/header';
import { AvatarImageForm } from '~/components/forms/avatar-image';
import { ProfileForm } from '~/components/forms/profile';

import { DeleteAccountDialog } from './delete-account-dialog';

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = extractLocaleDataFromHeadersAlt(headers());
  await loadAndActivateLocale(locale);

  const title = i18n._(msg`Profile`);

  return {
    title,
  };
};

export default async function ProfileSettingsPage() {
  setupI18nSSR();

  const { _ } = useLingui();
  const { user } = await getRequiredServerComponentSession();

  return (
    <div>
      <SettingsHeader
        title={_(msg`Profile`)}
        subtitle={_(msg`Here you can edit your personal details.`)}
      />

      <AvatarImageForm className="mb-8 max-w-xl" user={user} />
      <ProfileForm className="mb-8 max-w-xl" user={user} />

      <hr className="my-4 max-w-xl" />

      <DeleteAccountDialog className="max-w-xl" user={user} />
    </div>
  );
}
