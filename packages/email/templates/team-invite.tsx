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
  Preview,
  Section,
  Tailwind,
  Text,
} from '../components';
import { TemplateFooter } from '../template-components/template-footer';
import type { TemplateFooterData } from '../template-components/template-footer';
import TemplateImage from '../template-components/template-image';

export type TeamInviteEmailProps = {
  assetBaseUrl: string;
  baseUrl: string;
  senderName: string;
  teamName: string;
  teamUrl: string;
  token: string;
  teamInviteEmailTemplateData: TeamInviteEmailTemplateData;
  footerData: TemplateFooterData;
};

export type TeamInviteEmailTemplateData = {
  previewText: string;
  message1: string;
  message2: string;
  message3: string;
  message4: string;
  message5: string;
};

export const teamInviteEmailTemplateData = async ({
  teamName,
  headers,
  cookies,
}: { teamName: string } & TranslationsProps): Promise<TeamInviteEmailTemplateData> => {
  const translations = await getTranslation({
    headers: headers,
    cookies: cookies,
    message: [
      msg`Accept invitation to join a team on Documenso`,
      msg`Join ${teamName} on Documenso`,
      msg`You have been invited to join the following team`,
      msg`by`,
      msg`Accept`,
      msg`Decline`,
    ],
  });

  return {
    previewText: translations[0],
    message1: translations[1],
    message2: translations[2],
    message3: translations[3],
    message4: translations[4],
    message5: translations[5],
  };
};

export const TeamInviteEmailTemplate = ({
  assetBaseUrl = 'http://localhost:3002',
  baseUrl = 'https://documenso.com',
  senderName = 'John Doe',
  teamName = 'Team Name',
  teamUrl = 'demo',
  token = '',
  teamInviteEmailTemplateData,
  footerData,
}: TeamInviteEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>{teamInviteEmailTemplateData.previewText}</Preview>
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
          <Section className="bg-white text-slate-500">
            <Container className="mx-auto mb-2 mt-8 max-w-xl rounded-lg border border-solid border-slate-200 p-2 backdrop-blur-sm">
              <TemplateImage
                assetBaseUrl={assetBaseUrl}
                className="mb-4 h-6 p-2"
                staticAsset="logo.png"
              />

              <Section>
                <TemplateImage
                  className="mx-auto"
                  assetBaseUrl={assetBaseUrl}
                  staticAsset="add-user.png"
                />
              </Section>

              <Section className="p-2 text-slate-500">
                <Text className="text-center text-lg font-medium text-black">
                  {teamInviteEmailTemplateData.message1}
                </Text>

                <Text className="my-1 text-center text-base">
                  {teamInviteEmailTemplateData.message2}
                </Text>

                <div className="mx-auto my-2 w-fit rounded-lg bg-gray-50 px-4 py-2 text-base font-medium text-slate-600">
                  {formatTeamUrl(teamUrl, baseUrl)}
                </div>

                <Text className="my-1 text-center text-base">
                  {teamInviteEmailTemplateData.message3}{' '}
                  <span className="text-slate-900">{senderName}</span>
                </Text>

                <Section className="mb-6 mt-6 text-center">
                  <Button
                    className="bg-documenso-500 inline-flex items-center justify-center rounded-lg px-6 py-3 text-center text-sm font-medium text-black no-underline"
                    href={`${baseUrl}/team/invite/${token}`}
                  >
                    {teamInviteEmailTemplateData.message4}
                  </Button>
                  <Button
                    className="ml-4 inline-flex items-center justify-center rounded-lg bg-gray-50 px-6 py-3 text-center text-sm font-medium text-slate-600 no-underline"
                    href={`${baseUrl}/team/decline/${token}`}
                  >
                    {teamInviteEmailTemplateData.message5}
                  </Button>
                </Section>
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

export default TeamInviteEmailTemplate;
