import { msg } from '@lingui/macro';

import type { TranslationsProps } from '@documenso/lib/utils/i18n.import';
import { getTranslation } from '@documenso/lib/utils/i18n.import';
import config from '@documenso/tailwind-config';

import { Body, Container, Head, Html, Img, Preview, Section, Tailwind } from '../components';
import type { TemplateConfirmationEmailData } from '../template-components/template-confirmation-email';
import { TemplateConfirmationEmail } from '../template-components/template-confirmation-email';
import type { TemplateFooterData } from '../template-components/template-footer';
import { TemplateFooter } from '../template-components/template-footer';

export type ConfirmEmailTemplateProps = {
  confirmationLink: string;
  assetBaseUrl: string;
  footerData: TemplateFooterData;
  confirmEmailTemplateData: ConfirmEmailTemplateData;
  templateConfirmationEmailData: TemplateConfirmationEmailData;
};

export type ConfirmEmailTemplateData = {
  previewText: string;
};

export const confirmEmailTemplateData = async ({
  headers,
  cookies,
  locale,
}: TranslationsProps): Promise<ConfirmEmailTemplateData> => {
  const translations = await getTranslation({
    headers: headers,
    cookies: cookies,
    locale: locale,
    message: [msg`Please confirm your email address`],
  });

  return {
    previewText: translations[0],
  };
};

export const ConfirmEmailTemplate = ({
  confirmationLink,
  assetBaseUrl = 'http://localhost:3002',
  confirmEmailTemplateData,
  templateConfirmationEmailData,
  footerData,
}: ConfirmEmailTemplateProps) => {
  const getAssetUrl = (path: string) => {
    return new URL(path, assetBaseUrl).toString();
  };

  return (
    <Html>
      <Head />
      <Preview>{confirmEmailTemplateData.previewText}</Preview>
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

                <TemplateConfirmationEmail
                  confirmationLink={confirmationLink}
                  assetBaseUrl={assetBaseUrl}
                  templateConfirmationEmailData={templateConfirmationEmailData}
                />
              </Section>
            </Container>
            <div className="mx-auto mt-12 max-w-xl" />

            <Container className="mx-auto max-w-xl">
              <TemplateFooter
                isDocument={false}
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

export default ConfirmEmailTemplate;
