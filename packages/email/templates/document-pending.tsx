import { msg } from '@lingui/macro';

import type { TranslationsProps } from '@documenso/lib/utils/i18n.import';
import { getTranslation } from '@documenso/lib/utils/i18n.import';
import config from '@documenso/tailwind-config';

import { Body, Container, Head, Html, Img, Preview, Section, Tailwind } from '../components';
import type {
  TemplateDocumentPendingData,
  TemplateDocumentPendingProps,
} from '../template-components/template-document-pending';
import { TemplateDocumentPending } from '../template-components/template-document-pending';
import { TemplateFooter } from '../template-components/template-footer';
import type { TemplateFooterData } from '../template-components/template-footer';

export type DocumentPendingEmailTemplateProps = Partial<TemplateDocumentPendingProps> & {
  documentPendingEmailTemplateData: DocumentPendingEmailTemplateData;
  footerData: TemplateFooterData;
  templateDocumentPendingData: TemplateDocumentPendingData;
};

export type DocumentPendingEmailTemplateData = {
  previewText: string;
};

export const documentPendingEmailTemplateData = async ({
  headers,
  cookies,
}: TranslationsProps): Promise<DocumentPendingEmailTemplateData> => {
  const translations = await getTranslation({
    headers: headers,
    cookies: cookies,
    message: [msg`Pending Document`],
  });

  return {
    previewText: translations[0],
  };
};

export const DocumentPendingEmailTemplate = ({
  documentName = 'Open Source Pledge.pdf',
  assetBaseUrl = 'http://localhost:3002',
  documentPendingEmailTemplateData,
  templateDocumentPendingData,
  footerData,
}: DocumentPendingEmailTemplateProps) => {
  const getAssetUrl = (path: string) => {
    return new URL(path, assetBaseUrl).toString();
  };

  return (
    <Html>
      <Head />
      <Preview>{documentPendingEmailTemplateData.previewText}</Preview>
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
            <Container className="mx-auto mb-2 mt-8 max-w-xl rounded-lg border border-solid border-slate-200 p-4 backdrop-blur-sm">
              <Section>
                <Img
                  src={getAssetUrl('/static/logo.png')}
                  alt="Documenso Logo"
                  className="mb-4 h-6"
                />

                <TemplateDocumentPending
                  documentName={documentName}
                  assetBaseUrl={assetBaseUrl}
                  templateDocumentPendingData={templateDocumentPendingData}
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

export default DocumentPendingEmailTemplate;
