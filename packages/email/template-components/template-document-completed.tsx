import { msg } from '@lingui/macro';

import type { TranslationsProps } from '@documenso/lib/utils/i18n.import';
import { getTranslation } from '@documenso/lib/utils/i18n.import';

import { Button, Column, Img, Section, Text } from '../components';
import { TemplateDocumentImage } from './template-document-image';

export interface TemplateDocumentCompletedProps {
  downloadLink: string;
  documentName: string;
  assetBaseUrl: string;
  customBody?: string;
  templateDocumentCompletedData: TemplateDocumentCompletedData;
}

export type TemplateDocumentCompletedData = {
  message1: string;
  message2: string;
  message3: string;
  message4: string;
};

export const templateDocumentCompletedData = async ({
  documentName,
  headers,
  cookies,
}: { documentName: string } & TranslationsProps): Promise<TemplateDocumentCompletedData> => {
  const translations = await getTranslation({
    headers: headers,
    cookies: cookies,
    message: [
      msg`Completed`,
      msg`“${documentName}” was signed by all signers`,
      msg`Continue by downloading the document.`,
      msg`Download`,
    ],
  });

  return {
    message1: translations[0],
    message2: translations[1],
    message3: translations[2],
    message4: translations[3],
  };
};

export const TemplateDocumentCompleted = ({
  downloadLink,
  documentName,
  assetBaseUrl,
  customBody,
  templateDocumentCompletedData,
}: TemplateDocumentCompletedProps) => {
  const getAssetUrl = (path: string) => {
    return new URL(path, assetBaseUrl).toString();
  };

  return (
    <>
      <TemplateDocumentImage className="mt-6" assetBaseUrl={assetBaseUrl} />

      <Section>
        <Section className="mb-4">
          <Column align="center">
            <Text className="text-base font-semibold text-[#7AC455]">
              <Img
                src={getAssetUrl('/static/completed.png')}
                className="-mt-0.5 mr-2 inline h-7 w-7 align-middle"
              />
              {templateDocumentCompletedData.message1}
            </Text>
          </Column>
        </Section>

        <Text className="text-primary mb-0 text-center text-lg font-semibold">
          {customBody ?? templateDocumentCompletedData.message2}
        </Text>

        <Text className="my-1 text-center text-base text-slate-400">
          {templateDocumentCompletedData.message3}
        </Text>

        <Section className="mb-6 mt-8 text-center">
          {/* <Button
            className="mr-4 inline-flex items-center justify-center rounded-lg border border-solid border-slate-200 px-4 py-2 text-center text-sm font-medium text-black no-underline"
            href={reviewLink}
          >
            <Img src={getAssetUrl('/static/review.png')} className="-mb-1 mr-2 inline h-5 w-5" />
            Review
          </Button> */}
          <Button
            className="rounded-lg border border-solid border-slate-200 px-4 py-2 text-center text-sm font-medium text-black no-underline"
            href={downloadLink}
          >
            <Img
              src={getAssetUrl('/static/download.png')}
              className="mb-0.5 mr-2 inline h-5 w-5 align-middle"
            />
            {templateDocumentCompletedData.message4}
          </Button>
        </Section>
      </Section>
    </>
  );
};

export default TemplateDocumentCompleted;
