import type { TFunction } from 'i18next';
import z from 'zod';

export const getValidationSchema = (t: TFunction) => {
  return z.object({
    email: z
      .email(t('newsletter.welcome.error.email'))
      .min(1, t('newsletter.welcome.error.required'))
      .max(80, t('newsletter.welcome.error.emailLength')),
  });
};
