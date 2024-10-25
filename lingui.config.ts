import type { LinguiConfig } from '@lingui/conf';

import { APP_I18N_OPTIONS } from '@documenso/lib/constants/i18n';

const config: LinguiConfig = {
  sourceLocale: APP_I18N_OPTIONS.sourceLang,
  locales: APP_I18N_OPTIONS.supportedLangs as unknown as string[],
  // Any changes to these catalogue paths should be reflected in crowdin.yml
  catalogs: [
    {
      path: '<rootDir>/packages/lib/translations/{locale}/marketing',
      include: ['apps/marketing/src'],
      exclude: ['**/node_modules/**'],
    },
    {
      path: '<rootDir>/packages/lib/translations/{locale}/web',
      include: ['apps/web/src', 'apps/web/src/app/(internal)/%5F%5Fhtmltopdf/certificate/page.tsx'],
      exclude: ['**/node_modules/**'],
    },
    {
      path: '<rootDir>/packages/lib/translations/{locale}/common',
      include: ['packages/ui', 'packages/lib', 'packages/trpc', 'packages/email'],
      exclude: ['**/node_modules/**'],
    },
  ],
};

export default config;
