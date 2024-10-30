import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { i18n } from '@lingui/core';
import { msg } from '@lingui/macro';

import { NEXT_PUBLIC_MARKETING_URL } from '@documenso/lib/constants/app';
import { extractLocaleDataFromHeadersAlt } from '@documenso/lib/utils/i18n';
import { loadAndActivateLocale } from '@documenso/lib/utils/i18n.import';

type SharePageProps = {
  params: { slug: string };
};

export function generateMetadata({ params: { slug } }: SharePageProps) {
  const locale = extractLocaleDataFromHeadersAlt(headers());
  loadAndActivateLocale(locale)
    .then(() => {})
    .catch((err) => {
      console.error(err);
    });

  return {
    title: i18n._(msg`Documenso - Share`),
    description: i18n._(msg`I just signed a document in style with Documenso!`),
    openGraph: {
      title: i18n._(msg`Documenso - Join the open source signing revolution`),
      description: i18n._(msg`I just signed with Documenso!`),
      type: 'website',
      images: [`/share/${slug}/opengraph`],
    },
    twitter: {
      site: '@documenso',
      card: 'summary_large_image',
      images: [`/share/${slug}/opengraph`],
      description: i18n._(msg`I just signed with Documenso!`),
    },
  } satisfies Metadata;
}

export default function SharePage() {
  const userAgent = headers().get('User-Agent') ?? '';

  // https://stackoverflow.com/questions/47026171/how-to-detect-bots-for-open-graph-with-user-agent
  if (/bot|facebookexternalhit|WhatsApp|google|bing|duckduckbot|MetaInspector/i.test(userAgent)) {
    return null;
  }

  redirect(NEXT_PUBLIC_MARKETING_URL() ?? 'http://localhost:3001');
}
