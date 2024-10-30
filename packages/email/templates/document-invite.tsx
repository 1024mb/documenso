import { msg } from '@lingui/macro';

import type { TranslationsProps } from '@documenso/lib/utils/i18n.import';
import { getTranslation } from '@documenso/lib/utils/i18n.import';
import type { RecipientRole } from '@documenso/prisma/client';
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
import type {
  TemplateDocumentInviteData,
  TemplateDocumentInviteProps,
} from '../template-components/template-document-invite';
import { TemplateDocumentInvite } from '../template-components/template-document-invite';
import { TemplateFooter } from '../template-components/template-footer';
import type { TemplateFooterData } from '../template-components/template-footer';

export type DocumentInviteEmailTemplateProps = Partial<TemplateDocumentInviteProps> & {
  customBody?: string;
  role: RecipientRole;
  selfSigner?: boolean;
  isTeamInvite?: boolean;
  teamName?: string;
  teamEmail?: string;
  documentInviteEmailTemplateData: DocumentInviteEmailTemplateData;
  templateDocumentInviteData: TemplateDocumentInviteData;
  footerData: TemplateFooterData;
};

export type DocumentInviteEmailTemplateData = {
  previewText1: string;
  previewText2: string;
  previewText3: string;
  message1: string;
};

type DocumentInviteEmailTemplateParams = {
  actionVerb: string;
  imperativeVerb: string;
  documentName: string;
  inviterName: string | undefined;
  teamName: string | undefined;
};

export const documentInviteEmailTemplateData = async ({
  actionVerb,
  imperativeVerb,
  documentName,
  inviterName,
  teamName,
  headers,
  cookies,
}: DocumentInviteEmailTemplateParams &
  TranslationsProps): Promise<DocumentInviteEmailTemplateData> => {
  const translations = await getTranslation({
    headers: headers,
    cookies: cookies,
    message: [
      msg`Please ${imperativeVerb} your document ${documentName}`,
      msg`${inviterName} on behalf of ${teamName} has invited you to ${actionVerb} ${documentName}`,
      msg`${inviterName} has invited you to ${actionVerb} ${documentName}`,
      msg`${inviterName} has invited you to ${actionVerb} the document "${documentName}".`,
    ],
  });

  return {
    previewText1: translations[0],
    previewText2: translations[1],
    previewText3: translations[2],
    message1: translations[3],
  };
};

export const DocumentInviteEmailTemplate = ({
  inviterName = 'Lucas Smith',
  inviterEmail = 'lucas@documenso.com',
  documentName = 'Open Source Pledge.pdf',
  signDocumentLink = 'https://documenso.com',
  assetBaseUrl = 'http://localhost:3002',
  customBody,
  role,
  selfSigner = false,
  isTeamInvite = false,
  teamName,
  documentInviteEmailTemplateData,
  templateDocumentInviteData,
  footerData,
}: DocumentInviteEmailTemplateProps) => {
  const previewText = selfSigner
    ? documentInviteEmailTemplateData.previewText1
    : isTeamInvite
    ? documentInviteEmailTemplateData.previewText2
    : documentInviteEmailTemplateData.previewText3;

  const getAssetUrl = (path: string) => {
    return new URL(path, assetBaseUrl).toString();
  };

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
        <Body className="mx-auto my-auto bg-white font-sans">
          <Section>
            <Container className="mx-auto mb-2 mt-8 max-w-xl rounded-lg border border-solid border-slate-200 p-4 backdrop-blur-sm">
              <Section>
                <Img
                  src={getAssetUrl('/static/logo.png')}
                  alt="Documenso Logo"
                  className="mb-4 h-6"
                />

                <TemplateDocumentInvite
                  inviterName={inviterName}
                  inviterEmail={inviterEmail}
                  documentName={documentName}
                  signDocumentLink={signDocumentLink}
                  assetBaseUrl={assetBaseUrl}
                  role={role}
                  selfSigner={selfSigner}
                  isTeamInvite={isTeamInvite}
                  teamName={teamName}
                  templateDocumentInviteData={templateDocumentInviteData}
                />
              </Section>
            </Container>

            <Container className="mx-auto mt-12 max-w-xl">
              <Section>
                <Text className="my-4 text-base font-semibold">
                  {inviterName}{' '}
                  <Link className="font-normal text-slate-400" href="mailto:{inviterEmail}">
                    ({inviterEmail})
                  </Link>
                </Text>

                <Text className="mt-2 text-base text-slate-400">
                  {customBody ? (
                    <pre className="font-sans text-base text-slate-400">{customBody}</pre>
                  ) : (
                    documentInviteEmailTemplateData.message1
                  )}
                </Text>
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

export default DocumentInviteEmailTemplate;
