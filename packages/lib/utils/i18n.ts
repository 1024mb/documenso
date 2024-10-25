import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

import type { I18n } from '@lingui/core';

import { IS_APP_WEB, IS_APP_WEB_I18N_ENABLED } from '../constants/app';
import type { I18nLocaleData, SupportedLanguageCodes } from '../constants/i18n';
import { APP_I18N_OPTIONS } from '../constants/i18n';
import type { TranslationsProps } from './i18n.import';

export async function dynamicActivate(i18nInstance: I18n, locale: string) {
  const extension = process.env.NODE_ENV === 'development' ? 'po' : 'js';
  const context = IS_APP_WEB ? 'web' : 'marketing';

  const { messages } = await import(`../translations/${locale}/${context}.${extension}`);

  i18nInstance.loadAndActivate({ locale, messages });
}

const parseLanguageFromLocale = (locale: string): SupportedLanguageCodes | null => {
  const [language, _country] = locale.split('-');

  const foundSupportedLanguage = APP_I18N_OPTIONS.supportedLangs.find(
    (lang): lang is SupportedLanguageCodes => lang === language,
  );

  if (!foundSupportedLanguage) {
    return null;
  }

  return foundSupportedLanguage;
};

/**
 * Extract the language if supported from the cookies header.
 *
 * Returns `null` if not supported or not found.
 */
export const extractLocaleDataFromCookies = (
  cookies: ReadonlyRequestCookies,
): SupportedLanguageCodes | null => {
  const preferredLocale = cookies.get('language')?.value || '';

  const language = parseLanguageFromLocale(preferredLocale || '');

  if (!language) {
    return null;
  }

  return language;
};

export const extractLocaleDataFromHeaders = (
  headers: Headers,
): { lang: SupportedLanguageCodes | null; locales: string[] } => {
  const headerLocales = (headers.get('accept-language') ?? '').split(',');

  const language = parseLanguageFromLocale(headerLocales[0]);

  return {
    lang: language,
    locales: [headerLocales[0]],
  };
};

type ExtractLocaleDataOptions = {
  headers: Headers;
  cookies: ReadonlyRequestCookies;
};

/**
 * Extract the supported language from the cookies, then header if not found.
 *
 * Will return the default fallback language if not found.
 */
export const extractLocaleData = ({
  headers,
  cookies,
}: ExtractLocaleDataOptions): I18nLocaleData => {
  let lang: SupportedLanguageCodes | null = extractLocaleDataFromCookies(cookies);

  const langHeader = extractLocaleDataFromHeaders(headers);

  if (!lang && langHeader?.lang) {
    lang = langHeader.lang;
  }

  // Override web app to be English.
  if (!IS_APP_WEB_I18N_ENABLED && IS_APP_WEB) {
    lang = 'en';
  }

  // Filter out locales that are not valid.
  const locales = (langHeader?.locales ?? []).filter((locale) => {
    try {
      new Intl.Locale(locale);
      return true;
    } catch {
      return false;
    }
  });

  return {
    lang: lang || APP_I18N_OPTIONS.sourceLang,
    locales,
  };
};

export const getLocale = ({ headers, cookies }: Omit<TranslationsProps, 'locale'>): string => {
  return extractLocaleDataLegacy({
    headers: headers,
    cookies: cookies,
  });
};

export const extractLocaleDataLegacy = ({
  headers,
  cookies,
}: Omit<TranslationsProps, 'locale'>): string => {
  let cookieLanguage: SupportedLanguageCodes | null = extractLocaleDataFromCookiesLegacy({
    cookies: cookies,
  });
  const headerLanguage = extractLocaleDataFromHeadersLegacy({ headers: headers });

  if (!cookieLanguage && headerLanguage) {
    cookieLanguage = headerLanguage;
  }

  // Override web app to be English.
  if (!IS_APP_WEB_I18N_ENABLED && IS_APP_WEB) {
    cookieLanguage = 'en';
  }

  return cookieLanguage ?? APP_I18N_OPTIONS.sourceLang;
};

export const extractLocaleDataFromCookiesLegacy = ({
  cookies,
}: Omit<TranslationsProps, 'locale' | 'headers'>): SupportedLanguageCodes | null => {
  let preferredLocale: string;

  if (!cookies) {
    preferredLocale = '';
  } else if ('language' in cookies) {
    preferredLocale = cookies.language ?? '';
  } else {
    preferredLocale = '';
  }

  const language = parseLanguageFromLocale(preferredLocale);

  if (!language) {
    return null;
  }

  return language;
};

export const extractLocaleDataFromHeadersLegacy = ({
  headers,
}: Omit<TranslationsProps, 'locale' | 'cookies'>): SupportedLanguageCodes | null => {
  let headerLocales: string[];

  if (!headers) {
    headerLocales = [''];
  } else if ('accept-language' in headers) {
    const acceptLanguage = headers['accept-language'];
    headerLocales = (acceptLanguage ?? '').split(',');
  } else {
    headerLocales = [''];
  }

  const language = parseLanguageFromLocale(headerLocales[0]);

  return language;
};
