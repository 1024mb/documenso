import { msg } from '@lingui/macro';

import type { TranslationsProps } from '@documenso/lib/utils/i18n.import';
import { getTranslation } from '@documenso/lib/utils/i18n.import';
import { formatTeamUrl } from '@documenso/lib/utils/teams';
import config from '@documenso/tailwind-config';

import { Body, Container, Head, Hr, Html, Preview, Section, Tailwind, Text } from '../components';
import { TemplateFooter } from '../template-components/template-footer';
import type { TemplateFooterData } from '../template-components/template-footer';
import TemplateImage from '../template-components/template-image';

export type TeamLeaveEmailProps = {
  assetBaseUrl: string;
  baseUrl: string;
  memberName: string;
  memberEmail: string;
  teamName: string;
  teamUrl: string;
  teamLeaveEmailTemplateData: TeamLeaveEmailTemplateData;
  footerData: TemplateFooterData;
};

export type TeamLeaveEmailTemplateData = {
  previewText: string;
  message1: string;
  message2: string;
};

export const teamLeaveEmailTemplateData = async ({
  memberName,
  memberEmail,
  teamName,
  headers,
  cookies,
}: {
  memberName: string;
  memberEmail: string;
  teamName: string;
} & TranslationsProps): Promise<TeamLeaveEmailTemplateData> => {
  const translations = await getTranslation({
    headers: headers,
    cookies: cookies,
    message: [
      msg`A team member has left a team on Documenso`,
      msg`${memberName || memberEmail} left the team ${teamName} on Documenso`,
      msg`${memberEmail} left the following team`,
    ],
  });

  return {
    previewText: translations[0],
    message1: translations[1],
    message2: translations[2],
  };
};

export const TeamLeaveEmailTemplate = ({
  assetBaseUrl = 'http://localhost:3002',
  baseUrl = 'https://documenso.com',
  memberName = 'John Doe',
  memberEmail = 'johndoe@documenso.com',
  teamName = 'Team Name',
  teamUrl = 'demo',
  teamLeaveEmailTemplateData,
  footerData,
}: TeamLeaveEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>{teamLeaveEmailTemplateData.previewText}</Preview>
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
                  staticAsset="delete-user.png"
                />
              </Section>

              <Section className="p-2 text-slate-500">
                <Text className="text-center text-lg font-medium text-black">
                  {teamLeaveEmailTemplateData.message1}
                </Text>

                <Text className="my-1 text-center text-base">
                  {teamLeaveEmailTemplateData.message2}
                </Text>

                <div className="mx-auto my-2 w-fit rounded-lg bg-gray-50 px-4 py-2 text-base font-medium text-slate-600">
                  {formatTeamUrl(teamUrl, baseUrl)}
                </div>
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

export default TeamLeaveEmailTemplate;
