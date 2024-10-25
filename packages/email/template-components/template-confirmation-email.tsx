import { msg } from '@lingui/macro';

import type { TranslationsProps } from '@documenso/lib/utils/i18n.import';
import { getTranslation } from '@documenso/lib/utils/i18n.import';

import { Button, Section, Text } from '../components';
import { TemplateDocumentImage } from './template-document-image';

export type TemplateConfirmationEmailProps = {
  confirmationLink: string;
  assetBaseUrl: string;
  templateConfirmationEmailData: TemplateConfirmationEmailData;
};

export type TemplateConfirmationEmailData = {
  welcomeText: string;
  message1: string;
  message2: string;
  message3: string;
  message4: string;
};

export const templateConfirmationEmailData = async ({
  headers,
  cookies,
  locale,
}: TranslationsProps): Promise<TemplateConfirmationEmailData> => {
  const messages = await getTranslation({
    headers: headers,
    cookies: cookies,
    locale: locale,
    message: [
      msg`Welcome to Documenso!`,
      msg`Before you get started, please confirm your email address by clicking the button below:`,
      msg`Confirm email`,
      msg`You can also copy and paste this link into your browser:`,
      msg`(link expires in 1 hour)`,
    ],
  });

  return {
    welcomeText: messages[0],
    message1: messages[1],
    message2: messages[2],
    message3: messages[3],
    message4: messages[4],
  };
};

export const TemplateConfirmationEmail = ({
  confirmationLink,
  assetBaseUrl,
  templateConfirmationEmailData,
}: TemplateConfirmationEmailProps) => {
  return (
    <>
      <TemplateDocumentImage className="mt-6" assetBaseUrl={assetBaseUrl} />

      <Section className="flex-row items-center justify-center">
        <Text className="text-primary mx-auto mb-0 max-w-[80%] text-center text-lg font-semibold">
          {templateConfirmationEmailData.welcomeText}
        </Text>

        <Text className="my-1 text-center text-base text-slate-400">
          {templateConfirmationEmailData.message1}
        </Text>

        <Section className="mb-6 mt-8 text-center">
          <Button
            className="bg-documenso-500 inline-flex items-center justify-center rounded-lg px-6 py-3 text-center text-sm font-medium text-black no-underline"
            href={confirmationLink}
          >
            {templateConfirmationEmailData.message2}
          </Button>
          <Text className="mt-8 text-center text-sm italic text-slate-400">
            {templateConfirmationEmailData.message3} {confirmationLink}{' '}
            {templateConfirmationEmailData.message4}
          </Text>
        </Section>
      </Section>
    </>
  );
};
