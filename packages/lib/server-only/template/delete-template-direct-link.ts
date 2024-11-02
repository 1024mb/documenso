'use server';

import { generateAvaliableRecipientPlaceholder } from '@documenso/lib/utils/templates';
import { prisma } from '@documenso/prisma';

import { AppError, AppErrorCode } from '../../errors/app-error';
import { getLocale } from '../../utils/i18n';
import type { TranslationsProps } from '../../utils/i18n.import';

export type DeleteTemplateDirectLinkOptions = {
  templateId: number;
  userId: number;
};

export const deleteTemplateDirectLink = async ({
  templateId,
  userId,
  headers,
  cookies,
}: DeleteTemplateDirectLinkOptions & TranslationsProps): Promise<void> => {
  const template = await prisma.template.findFirst({
    where: {
      id: templateId,
      OR: [
        {
          userId,
        },
        {
          team: {
            members: {
              some: {
                userId,
              },
            },
          },
        },
      ],
    },
    include: {
      directLink: true,
      Recipient: true,
    },
  });

  if (!template) {
    throw new AppError(AppErrorCode.NOT_FOUND, 'Template not found');
  }

  const { directLink } = template;

  if (!directLink) {
    return;
  }

  const locale = getLocale({ headers, cookies });

  await prisma.$transaction(async (tx) => {
    await tx.recipient.update({
      where: {
        templateId: template.id,
        id: directLink.directTemplateRecipientId,
      },
      data: {
        ...(await generateAvaliableRecipientPlaceholder(template.Recipient, locale)),
      },
    });

    await tx.templateDirectLink.delete({
      where: {
        templateId,
      },
    });
  });
};
