import type { MessageDescriptor } from '@lingui/core';
import { i18n } from '@lingui/core';
import type { IncomingHttpHeaders } from 'http';

import { getLocale } from './i18n';

export type TranslationsProps = {
  headers?: IncomingHttpHeaders;
  cookies?: Partial<{ [key: string]: string }>;
  locale?: string;
};

type GetTranslationProps = {
  message: MessageDescriptor[];
} & TranslationsProps;

/**
 * Load and activate locale manually. Fallbacks to english if locale is not found.
 * @param locale - Locale to load (e.g., 'en', 'fr', 'es').
 */
export async function loadAndActivateLocale(locale: string) {
  try {
    const { messages } = await import(`@documenso/lib/translations/${locale}/web.js`);
    i18n.loadAndActivate({ locale, messages });
  } catch (error) {
    console.error(`Failed to load translation for locale: ${locale}`, error);

    if (locale !== 'en') {
      try {
        // @ts-expect-error: No type definition has been generated for the lingui file.
        const { messages: fallbackMessages } = await import(
          `@documenso/lib/translations/en/web.js`
        );
        i18n.loadAndActivate({ locale: 'en', messages: fallbackMessages });
      } catch (fallbackError) {
        console.error(`Failed to load fallback English translation:`, fallbackError);
      }
    }
  }
}

export async function getTranslation({
  headers,
  cookies,
  message,
  locale,
}: GetTranslationProps): Promise<string[]> {
  if (locale === '' || !locale) {
    locale = getLocale({ headers: headers, cookies: cookies });
  }

  await loadAndActivateLocale(locale);

  return message.map((msg) => i18n._(msg));
}
