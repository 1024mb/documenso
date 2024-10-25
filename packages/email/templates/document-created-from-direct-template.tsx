import { msg } from '@lingui/macro';

import type { TranslationsProps } from '@documenso/lib/utils/i18n.import';
import { getTranslation } from '@documenso/lib/utils/i18n.import';
import config from '@documenso/tailwind-config';

import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from '../components';
import TemplateDocumentImage from '../template-components/template-document-image';
import { TemplateFooter } from '../template-components/template-footer';
import type { TemplateFooterData } from '../template-components/template-footer';
import { RecipientRole } from '.prisma/client';

export type DocumentCompletedEmailTemplateProps = {
  recipientName?: string;
  recipientRole?: RecipientRole;
  documentLink?: string;
  documentName?: string;
  assetBaseUrl?: string;
  documentCreatedFromDirectTemplateData: DocumentCreatedFromDirectTemplateData;
  footerData: TemplateFooterData;
};

export type DocumentCreatedFromDirectTemplateData = {
  previewText: string;
  message1: string;
  message2: string;
};

export const documentCreatedFromDirectTemplateData = async ({
  recipientName,
  recipientActionActioned,
  headers,
  cookies,
}: {
  recipientName: string;
  recipientActionActioned: string;
} & TranslationsProps): Promise<DocumentCreatedFromDirectTemplateData> => {
  const translations = await getTranslation({
    headers: headers,
    cookies: cookies,
    message: [
      msg`Document created from direct template`,
      msg`${recipientName} ${recipientActionActioned} a document by using one of your direct links`,
      msg`View document`,
    ],
  });

  return {
    previewText: translations[0],
    message1: translations[1],
    message2: translations[2],
  };
};

export const DocumentCreatedFromDirectTemplateEmailTemplate = ({
  recipientName = 'John Doe',
  recipientRole = RecipientRole.SIGNER,
  documentLink = 'http://localhost:3000',
  documentName = 'Open Source Pledge.pdf',
  assetBaseUrl = 'http://localhost:3002',
  documentCreatedFromDirectTemplateData,
  footerData,
}: DocumentCompletedEmailTemplateProps) => {
  const getAssetUrl = (path: string) => {
    return new URL(path, assetBaseUrl).toString();
  };

  return (
    <Html>
      <Head />
      <Preview>{documentCreatedFromDirectTemplateData.previewText}</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: config.theme.extend.colors,
            },
          },
        }}
      >
        <Body className="mx-auto my-auto font-sans">
          <Section className="bg-white">
            <Container className="mx-auto mb-2 mt-8 max-w-xl rounded-lg border border-solid border-slate-200 p-2 backdrop-blur-sm">
              <Section className="p-2">
                <Img
                  src={getAssetUrl('/static/logo.png')}
                  alt="Documenso Logo"
                  className="mb-4 h-6"
                />

                <TemplateDocumentImage className="mt-6" assetBaseUrl={assetBaseUrl} />

                <Section>
                  <Text className="text-primary mb-0 text-center text-lg font-semibold">
                    {documentCreatedFromDirectTemplateData.message1}
                  </Text>

                  <div className="mx-auto my-2 w-fit rounded-lg bg-gray-50 px-4 py-2 text-sm text-slate-600">
                    {documentName}
                  </div>

                  <Section className="my-6 text-center">
                    <Button
                      className="bg-documenso-500 inline-flex items-center justify-center rounded-lg px-6 py-3 text-center text-sm font-medium text-black no-underline"
                      href={documentLink}
                    >
                      {documentCreatedFromDirectTemplateData.message2}
                    </Button>
                  </Section>
                </Section>
              </Section>
            </Container>

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

export default DocumentCreatedFromDirectTemplateEmailTemplate;
