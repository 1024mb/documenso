import type { MessageDescriptor } from '@lingui/core';
import { msg } from '@lingui/macro';

import { IdentityProvider, UserSecurityAuditLogType } from '@documenso/prisma/client';

export const SALT_ROUNDS = 12;

export const IDENTITY_PROVIDER_NAME: { [key in IdentityProvider]: MessageDescriptor } = {
  [IdentityProvider.DOCUMENSO]: msg`Documenso`,
  [IdentityProvider.GOOGLE]: msg`Google`,
  [IdentityProvider.OIDC]: msg`OIDC`,
};

export const IS_GOOGLE_SSO_ENABLED = Boolean(
  process.env.NEXT_PRIVATE_GOOGLE_CLIENT_ID && process.env.NEXT_PRIVATE_GOOGLE_CLIENT_SECRET,
);

export const IS_OIDC_SSO_ENABLED = Boolean(
  process.env.NEXT_PRIVATE_OIDC_WELL_KNOWN &&
    process.env.NEXT_PRIVATE_OIDC_CLIENT_ID &&
    process.env.NEXT_PRIVATE_OIDC_CLIENT_SECRET,
);

export const OIDC_PROVIDER_LABEL = process.env.NEXT_PRIVATE_OIDC_PROVIDER_LABEL;

export const USER_SECURITY_AUDIT_LOG_MAP: { [key in UserSecurityAuditLogType]: MessageDescriptor } =
  {
    [UserSecurityAuditLogType.ACCOUNT_SSO_LINK]: msg`Linked account to SSO`,
    [UserSecurityAuditLogType.ACCOUNT_PROFILE_UPDATE]: msg`Profile updated`,
    [UserSecurityAuditLogType.AUTH_2FA_DISABLE]: msg`2FA Disabled`,
    [UserSecurityAuditLogType.AUTH_2FA_ENABLE]: msg`2FA Enabled`,
    [UserSecurityAuditLogType.PASSKEY_CREATED]: msg`Passkey created`,
    [UserSecurityAuditLogType.PASSKEY_DELETED]: msg`Passkey deleted`,
    [UserSecurityAuditLogType.PASSKEY_UPDATED]: msg`Passkey updated`,
    [UserSecurityAuditLogType.PASSWORD_RESET]: msg`Password reset`,
    [UserSecurityAuditLogType.PASSWORD_UPDATE]: msg`Password updated`,
    [UserSecurityAuditLogType.SIGN_OUT]: msg`Signed Out`,
    [UserSecurityAuditLogType.SIGN_IN]: msg`Signed In`,
    [UserSecurityAuditLogType.SIGN_IN_FAIL]: msg`Sign in attempt failed`,
    [UserSecurityAuditLogType.SIGN_IN_PASSKEY_FAIL]: msg`Passkey sign in failed`,
    [UserSecurityAuditLogType.SIGN_IN_2FA_FAIL]: msg`Sign in 2FA attempt failed`,
  };

/**
 * The duration to wait for a passkey to be verified in MS.
 */
export const PASSKEY_TIMEOUT = 60000;

/**
 * The maximum number of passkeys are user can have.
 */
export const MAXIMUM_PASSKEYS = 50;
