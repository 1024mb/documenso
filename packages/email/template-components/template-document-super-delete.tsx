import { msg } from '@lingui/macro';

import type { TranslationsProps } from '@documenso/lib/utils/i18n.import';
import { getTranslation } from '@documenso/lib/utils/i18n.import';

import { Section, Text } from '../components';
import { TemplateDocumentImage } from './template-document-image';

export interface TemplateDocumentDeleteProps {
  reason: string;
  documentName: string;
  assetBaseUrl: string;
  templateDocumentDeleteData: TemplateDocumentDeleteData;
}

export type TemplateDocumentDeleteData = {
  message1: string;
  message2: string;
  message3: string;
  message4: string;
};

export const templateDocumentDeleteData = async ({
  documentName,
  headers,
  cookies,
}: { documentName: string } & TranslationsProps): Promise<TemplateDocumentDeleteData> => {
  const translation = await getTranslation({
    headers: headers,
    cookies: cookies,
    message: [
      msg`Your document has been deleted by an admin!`,
      msg`"${documentName}" has been deleted by an admin.`,
      msg`This document can not be recovered, if you would like to dispute the reason for future documents please contact support.`,
      msg`The reason provided for deletion is the following:`,
    ],
  });

  return {
    message1: translation[0],
    message2: translation[1],
    message3: translation[2],
    message4: translation[3],
  };
};

export const TemplateDocumentDelete = ({
  reason,
  documentName,
  assetBaseUrl,
  templateDocumentDeleteData,
}: TemplateDocumentDeleteProps) => {
  return (
    <>
      <TemplateDocumentImage className="mt-6" assetBaseUrl={assetBaseUrl} />

      <Section>
        <Text className="text-primary mb-0 mt-6 text-left text-lg font-semibold">
          {templateDocumentDeleteData.message1}
        </Text>

        <Text className="mx-auto mb-6 mt-1 text-left text-base text-slate-400">
          {templateDocumentDeleteData.message2}
        </Text>

        <Text className="mx-auto mb-6 mt-1 text-left text-base text-slate-400">
          {templateDocumentDeleteData.message3}
        </Text>

        <Text className="mx-auto mt-1 text-left text-base text-slate-400">
          {templateDocumentDeleteData.message4}
        </Text>

        <Text className="mx-auto mb-6 mt-1 text-left text-base italic text-slate-400">
          {reason}
        </Text>
      </Section>
    </>
  );
};

export default TemplateDocumentDelete;
