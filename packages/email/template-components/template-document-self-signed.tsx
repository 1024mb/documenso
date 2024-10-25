import { msg } from '@lingui/macro';
import { env } from 'next-runtime-env';

import type { TranslationsProps } from '@documenso/lib/utils/i18n.import';
import { getTranslation } from '@documenso/lib/utils/i18n.import';

import { Button, Column, Img, Link, Section, Text } from '../components';
import { TemplateDocumentImage } from './template-document-image';

export interface TemplateDocumentSelfSignedProps {
  documentName: string;
  assetBaseUrl: string;
  templateDocumentSelfSignedData: TemplateDocumentSelfSignedData;
}

export type TemplateDocumentSelfSignedData = {
  message1: string;
  message2: string;
  message3: string;
  message4: string;
  message5: string;
  message6: string;
  message7: string;
};

export const templateDocumentSelfSignedData = async ({
  documentName,
  headers,
  cookies,
}: {
  documentName: string | undefined;
} & TranslationsProps): Promise<TemplateDocumentSelfSignedData> => {
  const translations = await getTranslation({
    headers: headers,
    cookies: cookies,
    message: [
      msg`Completed`,
      msg`You have signed “${documentName}”`,
      msg`Create a`,
      msg`free account`,
      msg`to access your signed documents at any time.`,
      msg`Create account`,
      msg`View plans`,
    ],
  });

  return {
    message1: translations[0],
    message2: translations[1],
    message3: translations[2],
    message4: translations[3],
    message5: translations[4],
    message6: translations[5],
    message7: translations[6],
  };
};

export const TemplateDocumentSelfSigned = ({
  documentName,
  assetBaseUrl,
  templateDocumentSelfSignedData,
}: TemplateDocumentSelfSignedProps) => {
  const NEXT_PUBLIC_WEBAPP_URL = env('NEXT_PUBLIC_WEBAPP_URL');

  const signUpUrl = `${NEXT_PUBLIC_WEBAPP_URL ?? 'http://localhost:3000'}/signup`;

  const getAssetUrl = (path: string) => {
    return new URL(path, assetBaseUrl).toString();
  };

  return (
    <>
      <TemplateDocumentImage className="mt-6" assetBaseUrl={assetBaseUrl} />

      <Section className="flex-row items-center justify-center">
        <Section>
          <Column align="center">
            <Text className="text-base font-semibold text-[#7AC455]">
              <Img
                src={getAssetUrl('/static/completed.png')}
                className="-mt-0.5 mr-2 inline h-7 w-7 align-middle"
              />
              {templateDocumentSelfSignedData.message1}
            </Text>
          </Column>
        </Section>

        <Text className="text-primary mb-0 mt-6 text-center text-lg font-semibold">
          {templateDocumentSelfSignedData.message2}
        </Text>

        <Text className="mx-auto mb-6 mt-1 max-w-[80%] text-center text-base text-slate-400">
          {templateDocumentSelfSignedData.message3}{' '}
          <Link
            href={signUpUrl}
            target="_blank"
            className="text-documenso-700 hover:text-documenso-600 whitespace-nowrap"
          >
            {templateDocumentSelfSignedData.message4}
          </Link>{' '}
          {templateDocumentSelfSignedData.message5}
        </Text>

        <Section className="mb-6 mt-8 text-center">
          <Button
            href={signUpUrl}
            className="mr-4 rounded-lg border border-solid border-slate-200 px-4 py-2 text-center text-sm font-medium text-black no-underline"
          >
            <Img
              src={getAssetUrl('/static/user-plus.png')}
              className="mb-0.5 mr-2 inline h-5 w-5 align-middle"
            />
            {templateDocumentSelfSignedData.message6}
          </Button>

          <Button
            className="rounded-lg border border-solid border-slate-200 px-4 py-2 text-center text-sm font-medium text-black no-underline"
            href="https://documenso.com/pricing"
          >
            <Img
              src={getAssetUrl('/static/review.png')}
              className="mb-0.5 mr-2 inline h-5 w-5 align-middle"
            />
            {templateDocumentSelfSignedData.message7}
          </Button>
        </Section>
      </Section>
    </>
  );
};

export default TemplateDocumentSelfSigned;
