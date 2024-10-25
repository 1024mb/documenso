import { msg } from '@lingui/macro';

import type { TranslationsProps } from '@documenso/lib/utils/i18n.import';
import { getTranslation } from '@documenso/lib/utils/i18n.import';
import config from '@documenso/tailwind-config';

import { Body, Container, Head, Hr, Html, Img, Preview, Section, Tailwind } from '../components';
import type {
  TemplateDocumentCancelData,
  TemplateDocumentCancelProps,
} from '../template-components/template-document-cancel';
import { TemplateDocumentCancel } from '../template-components/template-document-cancel';
import { TemplateFooter } from '../template-components/template-footer';
import type { TemplateFooterData } from '../template-components/template-footer';

export type DocumentCancelEmailTemplateProps = Partial<TemplateDocumentCancelProps> & {
  documentCancelTemplateData: DocumentCancelTemplateData;
  footerData: TemplateFooterData;
  templateDocumentCancelData: TemplateDocumentCancelData;
};

export type DocumentCancelTemplateData = {
  previewText: string;
};

export const documentCancelTemplateData = async ({
  inviterName,
  documentName,
  headers,
  cookies,
}: {
  inviterName: string;
  documentName: string;
} & TranslationsProps): Promise<DocumentCancelTemplateData> => {
  const translations = await getTranslation({
    headers: headers,
    cookies: cookies,
    message: [
      msg`${inviterName} has cancelled the document ${documentName}, you don't need to sign it anymore.`,
    ],
  });

  return {
    previewText: translations[0],
  };
};

export const DocumentCancelTemplate = ({
  inviterName = 'Lucas Smith',
  inviterEmail = 'lucas@documenso.com',
  documentName = 'Open Source Pledge.pdf',
  assetBaseUrl = 'http://localhost:3002',
  documentCancelTemplateData,
  templateDocumentCancelData,
  footerData,
}: DocumentCancelEmailTemplateProps) => {
  const getAssetUrl = (path: string) => {
    return new URL(path, assetBaseUrl).toString();
  };

  return (
    <Html>
      <Head />
      <Preview>{documentCancelTemplateData.previewText}</Preview>
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

                <TemplateDocumentCancel
                  inviterName={inviterName}
                  inviterEmail={inviterEmail}
                  documentName={documentName}
                  assetBaseUrl={assetBaseUrl}
                  templateDocumentCancelData={templateDocumentCancelData}
                />
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

export default DocumentCancelTemplate;
