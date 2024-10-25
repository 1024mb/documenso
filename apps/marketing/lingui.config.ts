import type { LinguiConfig } from '@lingui/conf';

import { APP_I18N_OPTIONS } from '@documenso/lib/constants/i18n';

// Extends root lingui.config.cjs.
const config: LinguiConfig = {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  locales: APP_I18N_OPTIONS.supportedLangs as unknown as string[],
  catalogs: [
    {
      path: '<rootDir>/../../packages/lib/translations/{locale}/marketing',
      include: ['<rootDir>/apps/marketing/src'],
    },
    {
      path: '<rootDir>/../../packages/lib/translations/{locale}/common',
      include: [
        '<rootDir>/packages/ui',
        '<rootDir>/packages/lib',
        '<rootDir>/packages/trpc',
        '<rootDir>/packages/email',
      ],
    },
  ],
  catalogsMergePath: '<rootDir>/../../packages/lib/translations/{locale}/marketing',
};

export default config;
