import { msg } from '@lingui/macro';

import type { TranslationsProps } from '@documenso/lib/utils/i18n.import';
import { getTranslation } from '@documenso/lib/utils/i18n.import';
import { formatTeamUrl } from '@documenso/lib/utils/teams';
import config from '@documenso/tailwind-config';

import { Body, Container, Head, Hr, Html, Preview, Section, Tailwind, Text } from '../components';
import { TemplateFooter } from '../template-components/template-footer';
import type { TemplateFooterData } from '../template-components/template-footer';
import TemplateImage from '../template-components/template-image';

export type TeamDeleteEmailProps = {
  assetBaseUrl: string;
  baseUrl: string;
  teamUrl: string;
  isOwner: boolean;
  teamDeleteEmailTemplateData: TeamDeleteEmailTemplateData;
  footerData: TemplateFooterData;
};

export type TeamDeleteEmailTemplateData = {
  previewText1: string;
  previewText2: string;
  title1: string;
  title2: string;
  description1: string;
  description2: string;
};

export const teamDeleteEmailTemplateData = async ({
  headers,
  cookies,
}: TranslationsProps): Promise<TeamDeleteEmailTemplateData> => {
  const translations = await getTranslation({
    headers: headers,
    cookies: cookies,
    message: [
      msg`Your team has been deleted`,
      msg`A team you were a part of has been deleted`,
      msg`Your team has been deleted`,
      msg`A team you were a part of has been deleted`,
      msg`The following team has been deleted by you`,
      msg`The following team has been deleted by its owner. You will no longer be able to access this team and its documents`,
    ],
  });

  return {
    previewText1: translations[0],
    previewText2: translations[1],
    title1: translations[2],
    title2: translations[3],
    description1: translations[4],
    description2: translations[5],
  };
};

export const TeamDeleteEmailTemplate = ({
  assetBaseUrl = 'http://localhost:3002',
  baseUrl = 'https://documenso.com',
  teamUrl = 'demo',
  isOwner = false,
  teamDeleteEmailTemplateData,
  footerData,
}: TeamDeleteEmailProps) => {
  const previewText = isOwner
    ? teamDeleteEmailTemplateData.previewText1
    : teamDeleteEmailTemplateData.previewText2;

  const title = isOwner ? teamDeleteEmailTemplateData.title1 : teamDeleteEmailTemplateData.title2;

  const description = isOwner
    ? teamDeleteEmailTemplateData.description1
    : teamDeleteEmailTemplateData.description2;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
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
                  staticAsset="delete-team.png"
                />
              </Section>

              <Section className="p-2 text-slate-500">
                <Text className="text-center text-lg font-medium text-black">{title}</Text>

                <Text className="my-1 text-center text-base">{description}</Text>

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

export default TeamDeleteEmailTemplate;
