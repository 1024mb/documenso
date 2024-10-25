import { msg } from '@lingui/macro';

import type { TranslationsProps } from '@documenso/lib/utils/i18n.import';
import { getTranslation } from '@documenso/lib/utils/i18n.import';
import { formatTeamUrl } from '@documenso/lib/utils/teams';
import config from '@documenso/tailwind-config';

import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '../components';
import type { TemplateFooterData } from '../template-components/template-footer';
import { TemplateFooter } from '../template-components/template-footer';
import TemplateImage from '../template-components/template-image';

export type ConfirmTeamEmailProps = {
  assetBaseUrl: string;
  baseUrl: string;
  teamName: string;
  teamUrl: string;
  token: string;
  confirmTeamEmailData: ConfirmTeamEmailData;
  footerData: TemplateFooterData;
};

export type ConfirmTeamEmailData = {
  previewText: string;
  message1: string;
  message2: string;
  message3: string;
  message4: string;
  message5: string;
  message6: string;
  message7: string;
  message8: string;
  message9: string;
  message10: string;
  message11: string;
};

export const confirmTeamEmailData = async ({
  teamName,
  headers,
  cookies,
}: { teamName: string } & TranslationsProps): Promise<ConfirmTeamEmailData> => {
  const translation = await getTranslation({
    headers: headers,
    cookies: cookies,
    message: [
      msg`Accept team email request for ${teamName} on Documenso`,
      msg`Verify your team email address`,
      msg`has requested to use your email address for their team on Documenso.`,
      msg`By accepting this request, you will be granting`,
      msg`access to:`,
      msg`View all documents sent to and from this email address`,
      msg`Allow document recipients to reply directly to this email address`,
      msg`Send documents on behalf of the team using the email address`,
      msg`You can revoke access at any time in your team settings on Documenso`,
      msg`here.`,
      msg`Accept`,
      msg`Link expires in 1 hour.`,
    ],
  });

  return {
    previewText: translation[0],
    message1: translation[1],
    message2: translation[2],
    message3: translation[3],
    message4: translation[4],
    message5: translation[5],
    message6: translation[6],
    message7: translation[7],
    message8: translation[8],
    message9: translation[9],
    message10: translation[10],
    message11: translation[11],
  };
};

export const ConfirmTeamEmailTemplate = ({
  assetBaseUrl = 'http://localhost:3002',
  baseUrl = 'https://documenso.com',
  teamName = 'Team Name',
  teamUrl = 'demo',
  token = '',
  confirmTeamEmailData,
  footerData,
}: ConfirmTeamEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>{confirmTeamEmailData.previewText}</Preview>
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
            <Container className="mx-auto mb-2 mt-8 max-w-xl rounded-lg border border-solid border-slate-200 px-2 pt-2 backdrop-blur-sm">
              <TemplateImage
                assetBaseUrl={assetBaseUrl}
                className="mb-4 h-6 p-2"
                staticAsset="logo.png"
              />

              <Section>
                <TemplateImage
                  className="mx-auto"
                  assetBaseUrl={assetBaseUrl}
                  staticAsset="mail-open.png"
                />
              </Section>

              <Section className="p-2 text-slate-500">
                <Text className="text-center text-lg font-medium text-black">
                  {confirmTeamEmailData.message1}
                </Text>

                <Text className="text-center text-base">
                  <span className="font-bold">{teamName}</span> {confirmTeamEmailData.message2}
                </Text>

                <div className="mx-auto mt-6 w-fit rounded-lg bg-gray-50 px-4 py-2 text-base font-medium text-slate-600">
                  {formatTeamUrl(teamUrl, baseUrl)}
                </div>

                <Section className="mt-6">
                  <Text className="my-0 text-sm">
                    {confirmTeamEmailData.message3} <strong>{teamName}</strong>{' '}
                    {confirmTeamEmailData.message4}
                  </Text>

                  <ul className="mb-0 mt-2">
                    <li className="text-sm">{confirmTeamEmailData.message5}</li>
                    <li className="mt-1 text-sm">{confirmTeamEmailData.message6}</li>
                    <li className="mt-1 text-sm">{confirmTeamEmailData.message7}</li>
                  </ul>

                  <Text className="mt-2 text-sm">
                    {confirmTeamEmailData.message8}{' '}
                    <Link href={`${baseUrl}/settings/teams`}>{confirmTeamEmailData.message9}</Link>
                  </Text>
                </Section>

                <Section className="mb-6 mt-8 text-center">
                  <Button
                    className="bg-documenso-500 inline-flex items-center justify-center rounded-lg px-6 py-3 text-center text-sm font-medium text-black no-underline"
                    href={`${baseUrl}/team/verify/email/${token}`}
                  >
                    {confirmTeamEmailData.message10}
                  </Button>
                </Section>
              </Section>

              <Text className="text-center text-xs text-slate-500">
                {confirmTeamEmailData.message11}
              </Text>
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

export default ConfirmTeamEmailTemplate;
