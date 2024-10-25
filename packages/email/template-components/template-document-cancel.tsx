import { msg } from '@lingui/macro';

import type { TranslationsProps } from '@documenso/lib/utils/i18n.import';
import { getTranslation } from '@documenso/lib/utils/i18n.import';

import { Section, Text } from '../components';
import { TemplateDocumentImage } from './template-document-image';

export interface TemplateDocumentCancelProps {
  inviterName: string;
  inviterEmail: string;
  documentName: string;
  assetBaseUrl: string;
  templateDocumentCancelData: TemplateDocumentCancelData;
}

export type TemplateDocumentCancelData = {
  message1: string;
  message2: string;
  message3: string;
  message4: string;
};

export const templateDocumentCancelData = async ({
  inviterName,
  documentName,
  headers,
  cookies,
}: {
  inviterName: string;
  documentName: string;
} & TranslationsProps): Promise<TemplateDocumentCancelData> => {
  const translations = await getTranslation({
    headers: headers,
    cookies: cookies,
    message: [
      msg`${inviterName} has canceled the document`,
      msg`"${documentName}"`,
      msg`All signatures have been voided.`,
      msg`You don't need to sign it anymore.`,
    ],
  });

  return {
    message1: translations[0],
    message2: translations[1],
    message3: translations[2],
    message4: translations[3],
  };
};

export const TemplateDocumentCancel = ({
  inviterName,
  documentName,
  assetBaseUrl,
  templateDocumentCancelData,
}: TemplateDocumentCancelProps) => {
  return (
    <>
      <TemplateDocumentImage className="mt-6" assetBaseUrl={assetBaseUrl} />

      <Section>
        <Text className="text-primary mx-auto mb-0 max-w-[80%] text-center text-lg font-semibold">
          {templateDocumentCancelData.message1}
          <br />
          {templateDocumentCancelData.message2}
        </Text>

        <Text className="my-1 text-center text-base text-slate-400">
          {templateDocumentCancelData.message3}
        </Text>

        <Text className="my-1 text-center text-base text-slate-400">
          {templateDocumentCancelData.message4}
        </Text>
      </Section>
    </>
  );
};

export default TemplateDocumentCancel;
