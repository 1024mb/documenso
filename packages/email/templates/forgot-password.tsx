import { msg } from '@lingui/macro';

import type { TranslationsProps } from '@documenso/lib/utils/i18n.import';
import { getTranslation } from '@documenso/lib/utils/i18n.import';
import config from '@documenso/tailwind-config';

import { Body, Container, Head, Html, Img, Preview, Section, Tailwind } from '../components';
import { TemplateFooter } from '../template-components/template-footer';
import type { TemplateFooterData } from '../template-components/template-footer';
import type {
  TemplateForgotPasswordData,
  TemplateForgotPasswordProps,
} from '../template-components/template-forgot-password';
import { TemplateForgotPassword } from '../template-components/template-forgot-password';

export type ForgotPasswordTemplateProps = Partial<TemplateForgotPasswordProps> & {
  forgotPasswordTemplateData: ForgotPasswordTemplateData;
  templateForgotPasswordData: TemplateForgotPasswordData;
  footerData: TemplateFooterData;
};

export type ForgotPasswordTemplateData = {
  previewText: string;
};

export const forgotPasswordTemplateData = async ({
  headers,
  cookies,
}: TranslationsProps): Promise<ForgotPasswordTemplateData> => {
  const translation = await getTranslation({
    headers: headers,
    cookies: cookies,
    message: [msg`Password Reset Requested`],
  });

  return {
    previewText: translation[0],
  };
};

export const ForgotPasswordTemplate = ({
  resetPasswordLink = 'https://documenso.com',
  assetBaseUrl = 'http://localhost:3002',
  forgotPasswordTemplateData,
  templateForgotPasswordData,
  footerData,
}: ForgotPasswordTemplateProps) => {
  const getAssetUrl = (path: string) => {
    return new URL(path, assetBaseUrl).toString();
  };

  return (
    <Html>
      <Head />
      <Preview>{forgotPasswordTemplateData.previewText}</Preview>
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

                <TemplateForgotPassword
                  resetPasswordLink={resetPasswordLink}
                  assetBaseUrl={assetBaseUrl}
                  templateForgotPasswordData={templateForgotPasswordData}
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

export default ForgotPasswordTemplate;
