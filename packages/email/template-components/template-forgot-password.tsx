import { msg } from '@lingui/macro';

import type { TranslationsProps } from '@documenso/lib/utils/i18n.import';
import { getTranslation } from '@documenso/lib/utils/i18n.import';

import { Button, Section, Text } from '../components';
import { TemplateDocumentImage } from './template-document-image';

export type TemplateForgotPasswordProps = {
  resetPasswordLink: string;
  assetBaseUrl: string;
  templateForgotPasswordData: TemplateForgotPasswordData;
};

export type TemplateForgotPasswordData = {
  message1: string;
  message2: string;
  message3: string;
};

export const templateForgotPasswordData = async ({
  headers,
  cookies,
}: TranslationsProps): Promise<TemplateForgotPasswordData> => {
  const translation = await getTranslation({
    headers: headers,
    cookies: cookies,
    message: [
      msg`Forgot your password?`,
      msg`That's okay, it happens! Click the button below to reset your password.`,
      msg`Reset Password`,
    ],
  });

  return {
    message1: translation[0],
    message2: translation[1],
    message3: translation[2],
  };
};

export const TemplateForgotPassword = ({
  resetPasswordLink,
  assetBaseUrl,
  templateForgotPasswordData,
}: TemplateForgotPasswordProps) => {
  return (
    <>
      <TemplateDocumentImage className="mt-6" assetBaseUrl={assetBaseUrl} />

      <Section className="flex-row items-center justify-center">
        <Text className="text-primary mx-auto mb-0 max-w-[80%] text-center text-lg font-semibold">
          {templateForgotPasswordData.message1}
        </Text>

        <Text className="my-1 text-center text-base text-slate-400">
          {templateForgotPasswordData.message2}
        </Text>

        <Section className="mb-6 mt-8 text-center">
          <Button
            className="bg-documenso-500 inline-flex items-center justify-center rounded-lg px-6 py-3 text-center text-sm font-medium text-black no-underline"
            href={resetPasswordLink}
          >
            {templateForgotPasswordData.message3}
          </Button>
        </Section>
      </Section>
    </>
  );
};

export default TemplateForgotPassword;
