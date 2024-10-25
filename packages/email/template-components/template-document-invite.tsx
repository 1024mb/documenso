import { msg } from '@lingui/macro';

import type { TranslationsProps } from '@documenso/lib/utils/i18n.import';
import { getTranslation } from '@documenso/lib/utils/i18n.import';
import type { RecipientRole } from '@documenso/prisma/client';

import { Button, Section, Text } from '../components';
import { TemplateDocumentImage } from './template-document-image';

export interface TemplateDocumentInviteProps {
  inviterName: string;
  inviterEmail: string;
  documentName: string;
  signDocumentLink: string;
  assetBaseUrl: string;
  role: RecipientRole;
  selfSigner: boolean;
  isTeamInvite: boolean;
  teamName?: string;
  templateDocumentInviteData: TemplateDocumentInviteData;
}

export type TemplateDocumentInviteData = {
  actionVerb: string;
  progressiveVerb: string;
  documentName: string;
  message1: string;
  message2: string;
  message3: string;
  message4: string;
  message5: string;
};

type TemplateDocumentInviteParams = {
  recipientActionVerb: string;
  progressiveVerb: string;
  documentName: string;
  inviterName: string | undefined;
  teamName: string | undefined;
};

export const templateDocumentInviteData = async ({
  recipientActionVerb,
  progressiveVerb,
  documentName,
  inviterName,
  teamName,
  headers,
  cookies,
}: TemplateDocumentInviteParams & TranslationsProps): Promise<TemplateDocumentInviteData> => {
  const translations = await getTranslation({
    headers: headers,
    cookies: cookies,
    message: [
      msg`Please ${recipientActionVerb} your document`,
      msg`${inviterName} on behalf of ${teamName} has invited you to ${recipientActionVerb}`,
      msg`${inviterName} has invited you to ${recipientActionVerb}`,
      msg`"${documentName}"`,
      msg`Continue by ${progressiveVerb} the document.`,
      msg`${recipientActionVerb} Document`,
    ],
  });

  return {
    actionVerb: recipientActionVerb,
    progressiveVerb: progressiveVerb,
    message1: translations[0],
    message2: translations[1],
    message3: translations[2],
    documentName: translations[3],
    message4: translations[4],
    message5: translations[5],
  };
};

export const TemplateDocumentInvite = ({
  inviterName,
  documentName,
  signDocumentLink,
  assetBaseUrl,
  role,
  selfSigner,
  isTeamInvite,
  teamName,
  templateDocumentInviteData,
}: TemplateDocumentInviteProps) => {
  return (
    <>
      <TemplateDocumentImage className="mt-6" assetBaseUrl={assetBaseUrl} />

      <Section>
        <Text className="text-primary mx-auto mb-0 max-w-[80%] text-center text-lg font-semibold">
          {selfSigner ? (
            <>
              {templateDocumentInviteData.message1}
              <br />
              {templateDocumentInviteData.documentName}
            </>
          ) : isTeamInvite ? (
            <>
              {templateDocumentInviteData.message2}
              <br />
              {templateDocumentInviteData.documentName}
            </>
          ) : (
            <>
              {templateDocumentInviteData.message3}
              <br />
              {templateDocumentInviteData.documentName}
            </>
          )}
        </Text>

        <Text className="my-1 text-center text-base text-slate-400">
          {templateDocumentInviteData.message4}
        </Text>

        <Section className="mb-6 mt-8 text-center">
          <Button
            className="bg-documenso-500 inline-flex items-center justify-center rounded-lg px-6 py-3 text-center text-sm font-medium text-black no-underline"
            href={signDocumentLink}
          >
            {templateDocumentInviteData.message5}
          </Button>
        </Section>
      </Section>
    </>
  );
};

export default TemplateDocumentInvite;
