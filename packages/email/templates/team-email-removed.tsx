import { msg } from '@lingui/macro';

import type { TranslationsProps } from '@documenso/lib/utils/i18n.import';
import { getTranslation } from '@documenso/lib/utils/i18n.import';
import { formatTeamUrl } from '@documenso/lib/utils/teams';
import config from '@documenso/tailwind-config';

import { Body, Container, Head, Hr, Html, Preview, Section, Tailwind, Text } from '../components';
import { TemplateFooter } from '../template-components/template-footer';
import type { TemplateFooterData } from '../template-components/template-footer';
import TemplateImage from '../template-components/template-image';

export type TeamEmailRemovedTemplateProps = {
  assetBaseUrl: string;
  baseUrl: string;
  teamEmail: string;
  teamName: string;
  teamUrl: string;
  teamEmailRemovedTemplateData: TeamEmailRemovedTemplateData;
  footerData: TemplateFooterData;
};

export type TeamEmailRemovedTemplateData = {
  previewText: string;
  message1: string;
  message2: string;
  message3: string;
};

export const teamEmailRemovedTemplateData = async ({
  teamName,
  headers,
  cookies,
}: { teamName: string } & TranslationsProps): Promise<TeamEmailRemovedTemplateData> => {
  const translations = await getTranslation({
    headers: headers,
    cookies: cookies,
    message: [
      msg`Team email removed for ${teamName} on Documenso`,
      msg`Team email removed`,
      msg`The team email`,
      msg`has been removed from the following team`,
    ],
  });

  return {
    previewText: translations[0],
    message1: translations[1],
    message2: translations[2],
    message3: translations[3],
  };
};

export const TeamEmailRemovedTemplate = ({
  assetBaseUrl = 'http://localhost:3002',
  baseUrl = 'https://documenso.com',
  teamEmail = 'example@documenso.com',
  teamName = 'Team Name',
  teamUrl = 'demo',
  teamEmailRemovedTemplateData,
  footerData,
}: TeamEmailRemovedTemplateProps) => {
  return (
    <Html>
      <Head />
      <Preview>{teamEmailRemovedTemplateData.previewText}</Preview>
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
                  staticAsset="mail-open-alert.png"
                />
              </Section>

              <Section className="p-2 text-slate-500">
                <Text className="text-center text-lg font-medium text-black">
                  {teamEmailRemovedTemplateData.message1}
                </Text>

                <Text className="my-1 text-center text-base">
                  {teamEmailRemovedTemplateData.message2}{' '}
                  <span className="font-bold">{teamEmail}</span>{' '}
                  {teamEmailRemovedTemplateData.message3}
                </Text>

                <div className="mx-auto mb-6 mt-2 w-fit rounded-lg bg-gray-50 px-4 py-2 text-base font-medium text-slate-600">
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

export default TeamEmailRemovedTemplate;
