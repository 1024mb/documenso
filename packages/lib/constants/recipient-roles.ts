import type { MessageDescriptor } from '@lingui/core';
import { msg } from '@lingui/macro';

import { RecipientRole } from '@documenso/prisma/client';

export const RECIPIENT_ROLES_DESCRIPTION = {
  [RecipientRole.APPROVER]: {
    actionVerb: msg({ message: 'Approve', context: 'Action verb' }),
    actioned: msg({ message: 'Approved', context: 'Past tense' }),
    progressiveVerb: msg({ message: 'Approving', context: 'Progressive verb' }),
    roleName: msg({ message: 'Approver', context: 'Role name' }),
    roleNamePlural: msg({ message: 'Approvers', context: 'Role name' }),
  },
  [RecipientRole.CC]: {
    actionVerb: msg({ message: 'CC', context: 'Action verb' }),
    actioned: msg({ message: "CC'd", context: 'Past tense' }),
    progressiveVerb: msg({ message: 'CC', context: 'Progressive verb' }),
    roleName: msg({ message: 'Cc', context: 'Role name' }),
    roleNamePlural: msg({ message: "Cc'ers", context: 'Role name' }),
  },
  [RecipientRole.SIGNER]: {
    actionVerb: msg({ message: 'Sign', context: 'Action verb' }),
    actioned: msg({ message: 'Signed', context: 'Past tense' }),
    progressiveVerb: msg({ message: 'Signing', context: 'Progressive verb' }),
    roleName: msg({ message: 'Signer', context: 'Role name' }),
    roleNamePlural: msg({ message: 'Signers', context: 'Role name' }),
  },
  [RecipientRole.VIEWER]: {
    actionVerb: msg({ message: 'View', context: 'Action verb' }),
    actioned: msg({ message: 'Viewed', context: 'Past tense' }),
    progressiveVerb: msg({ message: 'Viewing', context: 'Progressive verb' }),
    roleName: msg({ message: 'Viewer', context: 'Role name' }),
    roleNamePlural: msg({ message: 'Viewers', context: 'Role name' }),
  },
} satisfies Record<keyof typeof RecipientRole, unknown>;

/**
 * Raw english descriptions for emails.
 *
 * Todo: Handle i18n for emails.
 */
export const RECIPIENT_ROLES_DESCRIPTION_ENG = {
  [RecipientRole.APPROVER]: {
    actionVerb: `Approve`,
    actioned: `Approved`,
    progressiveVerb: `Approving`,
    roleName: `Approver`,
  },
  [RecipientRole.CC]: {
    actionVerb: `CC`,
    actioned: `CC'd`,
    progressiveVerb: `CC`,
    roleName: `Cc`,
  },
  [RecipientRole.SIGNER]: {
    actionVerb: `Sign`,
    actioned: `Signed`,
    progressiveVerb: `Signing`,
    roleName: `Signer`,
  },
  [RecipientRole.VIEWER]: {
    actionVerb: `View`,
    actioned: `Viewed`,
    progressiveVerb: `Viewing`,
    roleName: `Viewer`,
  },
} satisfies Record<keyof typeof RecipientRole, unknown>;

export const RECIPIENT_ROLE_TO_EMAIL_TYPE = {
  [RecipientRole.SIGNER]: 'SIGNING_REQUEST',
  [RecipientRole.VIEWER]: 'VIEW_REQUEST',
  [RecipientRole.APPROVER]: 'APPROVE_REQUEST',
} as const;

export const RECIPIENT_ROLE_SIGNING_REASONS = {
  [RecipientRole.SIGNER]: msg`I am a signer of this document`,
  [RecipientRole.APPROVER]: msg`I am an approver of this document`,
  [RecipientRole.CC]: msg`I am required to receive a copy of this document`,
  [RecipientRole.VIEWER]: msg`I am a viewer of this document`,
} satisfies Record<keyof typeof RecipientRole, MessageDescriptor>;

/**
 * Raw english descriptions for certificates.
 */
export const RECIPIENT_ROLE_SIGNING_REASONS_ENG = {
  [RecipientRole.SIGNER]: `I am a signer of this document`,
  [RecipientRole.APPROVER]: `I am an approver of this document`,
  [RecipientRole.CC]: `I am required to receive a copy of this document`,
  [RecipientRole.VIEWER]: `I am a viewer of this document`,
} satisfies Record<keyof typeof RecipientRole, string>;
