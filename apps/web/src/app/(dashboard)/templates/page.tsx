import React from 'react';

import type { Metadata } from 'next';
import { headers } from 'next/headers';

import { i18n } from '@lingui/core';
import { msg } from '@lingui/macro';

import { setupI18nSSR } from '@documenso/lib/client-only/providers/i18n.server';
import { extractLocaleDataFromHeadersAlt } from '@documenso/lib/utils/i18n';
import { loadAndActivateLocale } from '@documenso/lib/utils/i18n.import';

import { TemplatesPageView } from './templates-page-view';
import type { TemplatesPageViewProps } from './templates-page-view';

type TemplatesPageProps = {
  searchParams?: TemplatesPageViewProps['searchParams'];
};

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = extractLocaleDataFromHeadersAlt(headers());
  await loadAndActivateLocale(locale);

  const title = i18n._(msg`Templates`);

  return {
    title,
  };
};

export default function TemplatesPage({ searchParams = {} }: TemplatesPageProps) {
  setupI18nSSR();

  return <TemplatesPageView searchParams={searchParams} />;
}
