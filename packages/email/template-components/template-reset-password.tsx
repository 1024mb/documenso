import { msg } from '@lingui/macro';
import { env } from 'next-runtime-env';

import type { TranslationsProps } from '@documenso/lib/utils/i18n.import';
import { getTranslation } from '@documenso/lib/utils/i18n.import';

import { Button, Section, Text } from '../components';
import { TemplateDocumentImage } from './template-document-image';

export interface TemplateResetPasswordProps {
  userName: string;
  userEmail: string;
  assetBaseUrl: string;
  templateResetPasswordData: TemplateResetPasswordData;
}

export type TemplateResetPasswordData = {
  message1: string;
  message2: string;
  message3: string;
};

export const templateResetPasswordData = async ({
  headers,
  cookies,
}: TranslationsProps): Promise<TemplateResetPasswordData> => {
  const translation = await getTranslation({
    headers: headers,
    cookies: cookies,
    message: [msg`Password updated!`, msg`Your password has been updated.`, msg`Sign In`],
  });

  return {
    message1: translation[0],
    message2: translation[1],
    message3: translation[2],
  };
};

export const TemplateResetPassword = ({
  assetBaseUrl,
  templateResetPasswordData,
}: TemplateResetPasswordProps) => {
  const NEXT_PUBLIC_WEBAPP_URL = env('NEXT_PUBLIC_WEBAPP_URL');

  return (
    <>
      <TemplateDocumentImage className="mt-6" assetBaseUrl={assetBaseUrl} />

      <Section className="flex-row items-center justify-center">
        <Text className="text-primary mx-auto mb-0 max-w-[80%] text-center text-lg font-semibold">
          {templateResetPasswordData.message1}
        </Text>

        <Text className="my-1 text-center text-base text-slate-400">
          {templateResetPasswordData.message2}
        </Text>

        <Section className="mb-6 mt-8 text-center">
          <Button
            className="bg-documenso-500 inline-flex items-center justify-center rounded-lg px-6 py-3 text-center text-sm font-medium text-black no-underline"
            href={`${NEXT_PUBLIC_WEBAPP_URL ?? 'http://localhost:3000'}/signin`}
          >
            {templateResetPasswordData.message3}
          </Button>
        </Section>
      </Section>
    </>
  );
};

export default TemplateResetPassword;
