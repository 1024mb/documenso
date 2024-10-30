import type { Metadata } from 'next';
import { headers } from 'next/headers';

import { i18n } from '@lingui/core';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { setupI18nSSR } from '@documenso/lib/client-only/providers/i18n.server';
import { extractLocaleDataFromHeadersAlt } from '@documenso/lib/utils/i18n';
import { loadAndActivateLocale } from '@documenso/lib/utils/i18n.import';

import { SettingsHeader } from '~/components/(dashboard)/settings/layout/header';

import ActivityPageBackButton from '../../../../../components/(dashboard)/settings/layout/activity-back';
import { UserSecurityActivityDataTable } from './user-security-activity-data-table';

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = extractLocaleDataFromHeadersAlt(headers());
  await loadAndActivateLocale(locale);

  const title = i18n._(msg`Security activity`);

  return {
    title,
  };
};

export default function SettingsSecurityActivityPage() {
  setupI18nSSR();

  const { _ } = useLingui();

  return (
    <div>
      <SettingsHeader
        title={_(msg`Security activity`)}
        subtitle={_(msg`View all security activity related to your account.`)}
        hideDivider={true}
      >
        <ActivityPageBackButton />
      </SettingsHeader>

      <div className="mt-4">
        <UserSecurityActivityDataTable />
      </div>
    </div>
  );
}
