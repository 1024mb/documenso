import { msg } from '@lingui/macro';

import type { TranslationsProps } from '@documenso/lib/utils/i18n.import';
import { getTranslation } from '@documenso/lib/utils/i18n.import';

import { Column, Img, Section, Text } from '../components';
import { TemplateDocumentImage } from './template-document-image';

export interface TemplateDocumentPendingProps {
  documentName: string;
  assetBaseUrl: string;
  templateDocumentPendingData: TemplateDocumentPendingData;
}

export type TemplateDocumentPendingData = {
  message1: string;
  message2: string;
  message3: string;
  message4: string;
};

export const templateDocumentPendingData = async ({
  documentName,
  headers,
  cookies,
}: { documentName: string } & TranslationsProps): Promise<TemplateDocumentPendingData> => {
  const translations = await getTranslation({
    headers: headers,
    cookies: cookies,
    message: [
      msg`Waiting for others`,
      msg`“${documentName}” has been signed`,
      msg`We're still waiting for other signers to sign this document.`,
      msg`We'll notify you as soon as it's ready.`,
    ],
  });

  return {
    message1: translations[0],
    message2: translations[1],
    message3: translations[2],
    message4: translations[3],
  };
};

export const TemplateDocumentPending = ({
  documentName,
  assetBaseUrl,
  templateDocumentPendingData,
}: TemplateDocumentPendingProps) => {
  const getAssetUrl = (path: string) => {
    return new URL(path, assetBaseUrl).toString();
  };

  return (
    <>
      <TemplateDocumentImage className="mt-6" assetBaseUrl={assetBaseUrl} />

      <Section>
        <Section className="mb-4">
          <Column align="center">
            <Text className="text-base font-semibold text-blue-500">
              <Img
                src={getAssetUrl('/static/clock.png')}
                className="-mt-0.5 mr-2 inline h-7 w-7 align-middle"
              />
              {templateDocumentPendingData.message1}
            </Text>
          </Column>
        </Section>

        <Text className="text-primary mb-0 text-center text-lg font-semibold">
          {templateDocumentPendingData.message2}
        </Text>

        <Text className="mx-auto mb-6 mt-1 max-w-[80%] text-center text-base text-slate-400">
          {templateDocumentPendingData.message3}
          <br />
          {templateDocumentPendingData.message4}
        </Text>
      </Section>
    </>
  );
};

export default TemplateDocumentPending;
