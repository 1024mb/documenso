import { i18n } from '@lingui/core';
import { msg } from '@lingui/macro';

import { getLocale } from '@documenso/lib/utils/i18n';
import type { TranslationsProps } from '@documenso/lib/utils/i18n.import';
import { loadAndActivateLocale } from '@documenso/lib/utils/i18n.import';

import { Link, Section, Text } from '../components';

export type TemplateFooterProps = {
  isDocument?: boolean;
  companyName: string;
  address: string;
  message1: string;
  message2: string;
};

export type TemplateFooterData = {
  message1: string;
  message2: string;
  companyName: string;
  address: string;
};

export const loadFooterTemplateData = async ({
  headers,
  cookies,
  locale = '',
}: TranslationsProps): Promise<TemplateFooterData> => {
  if (locale === '' || !locale) {
    locale = getLocale({ headers: headers, cookies: cookies });
  }

  await loadAndActivateLocale(locale);

  return {
    message1: i18n._(msg`This document was sent using`),
    message2: i18n._(msg`Documenso.`),
    companyName: i18n._(msg`Documenso, Inc.`),
    address: i18n._(msg`2261 Market Street, #5211, San Francisco, CA 94114, USA`),
  };
};

export const TemplateFooter = ({
  isDocument = true,
  companyName,
  address,
  message1,
  message2,
}: TemplateFooterProps) => {
  return (
    <Section>
      {isDocument && (
        <Text className="my-4 text-base text-slate-400">
          {message1}{' '}
          <Link className="text-[#7AC455]" href="https://documen.so/mail-footer">
            {message2}
          </Link>
        </Text>
      )}

      <Text className="my-8 text-sm text-slate-400">
        {companyName}
        <br />
        {address}
      </Text>
    </Section>
  );
};

export default TemplateFooter;
