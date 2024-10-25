import { msg } from '@lingui/macro';

import type { TranslationsProps } from '@documenso/lib/utils/i18n.import';
import { getTranslation } from '@documenso/lib/utils/i18n.import';
import config from '@documenso/tailwind-config';

import { Body, Container, Head, Html, Img, Preview, Section, Tailwind } from '../components';
import type {
  TemplateDocumentSelfSignedData,
  TemplateDocumentSelfSignedProps,
} from '../template-components/template-document-self-signed';
import { TemplateDocumentSelfSigned } from '../template-components/template-document-self-signed';
import { TemplateFooter } from '../template-components/template-footer';
import type { TemplateFooterData } from '../template-components/template-footer';

export type DocumentSelfSignedTemplateProps = TemplateDocumentSelfSignedProps & {
  documentSelfSignedEmailTemplateData: DocumentSelfSignedEmailTemplateData;
  footerData: TemplateFooterData;
  templateDocumentSelfSignedData: TemplateDocumentSelfSignedData;
};

export type DocumentSelfSignedEmailTemplateData = {
  previewText: string;
};

export const documentSelfSignedEmailTemplateData = async ({
  headers,
  cookies,
}: TranslationsProps): Promise<DocumentSelfSignedEmailTemplateData> => {
  const translations = await getTranslation({
    headers: headers,
    cookies: cookies,
    message: [msg`Completed Document`],
  });

  return {
    previewText: translations[0],
  };
};

export const DocumentSelfSignedEmailTemplate = ({
  documentName = 'Open Source Pledge.pdf',
  assetBaseUrl = 'http://localhost:3002',
  documentSelfSignedEmailTemplateData,
  templateDocumentSelfSignedData,
  footerData,
}: DocumentSelfSignedTemplateProps) => {
  const getAssetUrl = (path: string) => {
    return new URL(path, assetBaseUrl).toString();
  };

  return (
    <Html>
      <Head />
      <Preview>{documentSelfSignedEmailTemplateData.previewText}</Preview>
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

                <TemplateDocumentSelfSigned
                  documentName={documentName}
                  assetBaseUrl={assetBaseUrl}
                  templateDocumentSelfSignedData={templateDocumentSelfSignedData}
                />
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

export default DocumentSelfSignedEmailTemplate;
