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
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '../components';
import { TemplateFooter } from '../template-components/template-footer';
import type { TemplateFooterData } from '../template-components/template-footer';
import type {
  TemplateResetPasswordData,
  TemplateResetPasswordProps,
} from '../template-components/template-reset-password';
import { TemplateResetPassword } from '../template-components/template-reset-password';

export type ResetPasswordTemplateProps = Partial<TemplateResetPasswordProps> & {
  resetPasswordTemplateData: ResetPasswordTemplateData;
  footerData: TemplateFooterData;
  templateResetPasswordData: TemplateResetPasswordData;
};

export type ResetPasswordTemplateData = {
  previewText: string;
  message1: string;
  message2: string;
  message3: string;
  message4: string;
};

export const resetPasswordTemplateData = async ({
  userName,
  headers,
  cookies,
}: { userName: string } & TranslationsProps): Promise<ResetPasswordTemplateData> => {
  const translation = await getTranslation({
    headers: headers,
    cookies: cookies,
    message: [
      msg`Password Reset Successful`,
      msg`Hi, ${userName}`,
      msg`We've changed your password as you asked. You can now sign in with your new password.`,
      msg`Didn't request a password change? We are here to help you secure your account, just`,
      msg`contact us.`,
    ],
  });

  return {
    previewText: translation[0],
    message1: translation[1],
    message2: translation[2],
    message3: translation[3],
    message4: translation[4],
  };
};

export const ResetPasswordTemplate = ({
  userName = 'Lucas Smith',
  userEmail = 'lucas@documenso.com',
  assetBaseUrl = 'http://localhost:3002',
  resetPasswordTemplateData,
  templateResetPasswordData,
  footerData,
}: ResetPasswordTemplateProps) => {
  const getAssetUrl = (path: string) => {
    return new URL(path, assetBaseUrl).toString();
  };

  return (
    <Html>
      <Head />
      <Preview>{resetPasswordTemplateData.previewText}</Preview>
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

                <TemplateResetPassword
                  userName={userName}
                  userEmail={userEmail}
                  assetBaseUrl={assetBaseUrl}
                  templateResetPasswordData={templateResetPasswordData}
                />
              </Section>
            </Container>

            <Container className="mx-auto mt-12 max-w-xl">
              <Section>
                <Text className="my-4 text-base font-semibold">
                  {resetPasswordTemplateData.message1}{' '}
                  <Link className="font-normal text-slate-400" href={`mailto:${userEmail}`}>
                    ({userEmail})
                  </Link>
                </Text>

                <Text className="mt-2 text-base text-slate-400">
                  {resetPasswordTemplateData.message2}
                </Text>
                <Text className="mt-2 text-base text-slate-400">
                  {resetPasswordTemplateData.message3}{' '}
                  <Link className="text-documenso-700 font-normal" href="mailto:hi@documenso.com">
                    {resetPasswordTemplateData.message4}
                  </Link>
                </Text>
              </Section>
            </Container>

            <Hr className="mx-auto mt-12 max-w-xl" />

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

export default ResetPasswordTemplate;
