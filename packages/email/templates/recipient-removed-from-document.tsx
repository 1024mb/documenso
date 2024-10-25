import { msg } from '@lingui/macro';

import type { TranslationsProps } from '@documenso/lib/utils/i18n.import';
import { getTranslation } from '@documenso/lib/utils/i18n.import';
import config from '@documenso/tailwind-config';

import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from '../components';
import type { TemplateDocumentCancelProps } from '../template-components/template-document-cancel';
import TemplateDocumentImage from '../template-components/template-document-image';
import { TemplateFooter } from '../template-components/template-footer';
import type { TemplateFooterData } from '../template-components/template-footer';

export type DocumentCancelEmailTemplateProps = Partial<
  Omit<TemplateDocumentCancelProps, 'templateDocumentCancelData'>
> & {
  recipientRemovedFromDocumentTemplateData: RecipientRemovedFromDocumentTemplateData;
  footerData: TemplateFooterData;
};

export type RecipientRemovedFromDocumentTemplateData = {
  previewText: string;
  message1: string;
  message2: string;
};

export const recipientRemovedFromDocumentTemplateData = async ({
  inviterName,
  documentName,
  headers,
  cookies,
}: {
  inviterName: string | undefined;
  documentName: string;
} & TranslationsProps): Promise<RecipientRemovedFromDocumentTemplateData> => {
  const translations = await getTranslation({
    headers: headers,
    cookies: cookies,
    message: [
      msg`${inviterName} has removed you from the document ${documentName}.`,
      msg`${inviterName} has removed you from the document`,
      msg`"${documentName}"`,
    ],
  });

  return {
    previewText: translations[0],
    message1: translations[1],
    message2: translations[2],
  };
};

export const RecipientRemovedFromDocumentTemplate = ({
  inviterName = 'Lucas Smith',
  documentName = 'Open Source Pledge.pdf',
  assetBaseUrl = 'http://localhost:3002',
  recipientRemovedFromDocumentTemplateData,
  footerData,
}: DocumentCancelEmailTemplateProps) => {
  const getAssetUrl = (path: string) => {
    return new URL(path, assetBaseUrl).toString();
  };

  return (
    <Html>
      <Head />
      <Preview>{recipientRemovedFromDocumentTemplateData.previewText}</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: config.theme.extend.colors,
            },
          },
        }}
      >
        <Body className="mx-auto my-auto bg-white font-sans">
          <Section>
            <Container className="mx-auto mb-2 mt-8 max-w-xl rounded-lg border border-solid border-slate-200 p-4 backdrop-blur-sm">
              <Section>
                <Img
                  src={getAssetUrl('/static/logo.png')}
                  alt="Documenso Logo"
                  className="mb-4 h-6"
                />

                <TemplateDocumentImage className="mt-6" assetBaseUrl={assetBaseUrl} />

                <Section>
                  <Text className="text-primary mx-auto mb-0 max-w-[80%] text-center text-lg font-semibold">
                    {recipientRemovedFromDocumentTemplateData.message1}
                    <br />
                    {recipientRemovedFromDocumentTemplateData.message2}
                  </Text>
                </Section>
              </Section>
            </Container>

            <Hr className="mx-auto mt-12 max-w-xl" />

            <Container className="mx-auto max-w-xl">
              <TemplateFooter
                address={footerData.address}
                companyName={footerData.companyName}
                message1={footerData.message1}
                message2={footerData.message2}
              />
            </Container>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default RecipientRemovedFromDocumentTemplate;
