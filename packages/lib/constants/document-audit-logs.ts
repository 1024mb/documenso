import { msg } from '@lingui/macro';

import { DOCUMENT_EMAIL_TYPE } from '../types/document-audit-logs';

export const DOCUMENT_AUDIT_LOG_EMAIL_FORMAT = {
  [DOCUMENT_EMAIL_TYPE.SIGNING_REQUEST]: {
    description: msg`Signing request`,
  },
  [DOCUMENT_EMAIL_TYPE.VIEW_REQUEST]: {
    description: msg`Viewing request`,
  },
  [DOCUMENT_EMAIL_TYPE.APPROVE_REQUEST]: {
    description: msg`Approval request`,
  },
  [DOCUMENT_EMAIL_TYPE.CC]: {
    description: msg`CC`,
  },
  [DOCUMENT_EMAIL_TYPE.DOCUMENT_COMPLETED]: {
    description: msg`Document completed`,
  },
} satisfies Record<keyof typeof DOCUMENT_EMAIL_TYPE, unknown>;
