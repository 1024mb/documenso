import crypto from 'crypto';
import { DateTime } from 'luxon';

import { prisma } from '@documenso/prisma';

import { ONE_HOUR } from '../../constants/time';
import type { TranslationsProps } from '../../utils/i18n.import';
import { sendConfirmationEmail } from '../auth/send-confirmation-email';
import { getMostRecentVerificationTokenByUserId } from './get-most-recent-verification-token-by-user-id';

const IDENTIFIER = 'confirmation-email';

type SendConfirmationTokenOptions = {
  email: string;
  force?: boolean;
};

export const sendConfirmationToken = async ({
  email,
  force = false,
  headers,
  cookies,
  locale,
}: SendConfirmationTokenOptions & TranslationsProps) => {
  const token = crypto.randomBytes(20).toString('hex');

  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  if (user.emailVerified) {
    throw new Error('Email verified');
  }

  const mostRecentToken = await getMostRecentVerificationTokenByUserId({ userId: user.id });

  // If we've sent a token in the last 5 minutes, don't send another one
  if (
    !force &&
    mostRecentToken?.createdAt &&
    DateTime.fromJSDate(mostRecentToken.createdAt).diffNow('minutes').minutes > -5
  ) {
    return;
  }

  const createdToken = await prisma.verificationToken.create({
    data: {
      identifier: IDENTIFIER,
      token: token,
      expires: new Date(Date.now() + ONE_HOUR),
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  if (!createdToken) {
    throw new Error(`Failed to create the verification token`);
  }

  try {
    await sendConfirmationEmail({
      userId: user.id,
      headers: headers,
      cookies: cookies,
      // This one uses locale too because sometimes that's the only parameters it receives
      locale: locale,
    });

    return { success: true };
  } catch (err) {
    console.error(err);

    throw new Error(`Failed to send the confirmation email`);
  }
};
