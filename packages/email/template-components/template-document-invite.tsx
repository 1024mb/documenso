import { Trans, msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { RECIPIENT_ROLES_DESCRIPTION_ENG } from '@documenso/lib/constants/recipient-roles';
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
}

export const TemplateDocumentInvite = ({
  inviterName,
  documentName,
  signDocumentLink,
  assetBaseUrl,
  role,
  selfSigner,
  isTeamInvite,
  teamName,
}: TemplateDocumentInviteProps) => {
  const { _ } = useLingui();

  const { actionVerb, progressiveVerb } = RECIPIENT_ROLES_DESCRIPTION_ENG[role];

  return (
    <>
      <TemplateDocumentImage className="mt-6" assetBaseUrl={assetBaseUrl} />

      <Section>
        <Text className="text-primary mx-auto mb-0 max-w-[80%] text-center text-lg font-semibold">
          {selfSigner ? (
            <>
              {_(msg`Please ${actionVerb.toLowerCase()} your document`)}
              <br />
              {`"${documentName}"`}
            </>
          ) : isTeamInvite ? (
            <>
              {_(
                msg`${inviterName} on behalf of ${teamName} has invited you to ${actionVerb.toLowerCase()}`,
              )}
              <br />
              {`"${documentName}"`}
            </>
          ) : (
            <>
              {_(msg`${inviterName} has invited you to ${actionVerb.toLowerCase()}`)}
              <br />
              {`"${documentName}"`}
            </>
          )}
        </Text>

        <Text className="my-1 text-center text-base text-slate-400">
          <Trans>Continue by {progressiveVerb.toLowerCase()} the document.</Trans>
        </Text>

        <Section className="mb-6 mt-8 text-center">
          <Button
            className="bg-documenso-500 inline-flex items-center justify-center rounded-lg px-6 py-3 text-center text-sm font-medium text-black no-underline"
            href={signDocumentLink}
          >
            <Trans>{actionVerb} Document</Trans>
          </Button>
        </Section>
      </Section>
    </>
  );
};

export default TemplateDocumentInvite;
