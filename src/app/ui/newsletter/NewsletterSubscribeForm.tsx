'use client';

import { TrackingAction, TrackingCategory } from '@/const/trackingKeys';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { useNewsletterSubscribe } from '@/hooks/useNewsletterSubscribe';
import { useMenuStore } from '@/stores/menu';
import { AppPaths, TERMS_CONDITIONS_URL } from '@/const/urls';
import Input from '@mui/material/Input';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next/TransWithoutContext';
import {
  NewsletterErrorMessage,
  NewsletterForm,
  NewsletterFormButton,
  NewsletterFormGroup,
  NewsletterLink,
} from './NewsletterPage.style';
import { getValidationSchema } from './utils';

export type NewsletterSubscribeFormLayout = 'inline' | 'stacked';

export interface NewsletterSubscribeFormProps {
  utmCampaign?: string;
  layout?: NewsletterSubscribeFormLayout;
}

export const NewsletterSubscribeForm: FC<NewsletterSubscribeFormProps> = ({
  utmCampaign = 'newsletter-page',
  layout = 'inline',
}) => {
  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();
  const [email, setEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const setSnackbarState = useMenuStore((state) => state.setSnackbarState);
  const { mutate, isPending, isSuccess } = useNewsletterSubscribe();
  const isStacked = layout === 'stacked';

  useEffect(() => {
    if (!isSuccess) {
      return;
    }
    setEmail('');
    setSnackbarState(true, t('newsletter.welcome.pending'), 'success');
  }, [isSuccess, setSnackbarState, t]);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setErrorMessage(null);
  };

  const handleSubscribe = (event: React.FormEvent<HTMLDivElement>) => {
    event.preventDefault();

    const form = event.currentTarget as unknown as HTMLFormElement;
    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries());
    const validationSchema = getValidationSchema(t);
    const result = validationSchema.safeParse(values);
    if (!result.success) {
      setErrorMessage(
        result.error.issues[0]?.message ||
          t('newsletter.welcome.error.unknown'),
      );
      return;
    }
    trackEvent({
      category: TrackingCategory.Newsletter,
      action: TrackingAction.SubscribeToNewsletter,
      label: `${utmCampaign}-open`,
    });
    mutate(
      {
        email: result.data.email,
        utmSource: 'jumper-exchange',
        utmMedium: 'website',
        utmCampaign,
        referringSite: window.location.href,
      },
      {
        onError: (error) => {
          setErrorMessage(error.message);
        },
      },
    );
  };

  const emailField = (
    <Input
      name="email"
      id="newsletter-subscribe-email"
      placeholder={t('newsletter.welcome.emailPlaceholder')}
      fullWidth
      type="email"
      autoComplete="email"
      inputProps={{
        'aria-label': t('newsletter.welcome.emailPlaceholder'),
      }}
      value={email}
      disabled={isPending}
      onChange={handleEmailChange}
    />
  );

  const submitButton = (
    <NewsletterFormButton
      type="submit"
      disabled={!email || isPending}
      fullWidth={isStacked}
      loading={isPending}
      loadingPosition="start"
    >
      {t('newsletter.welcome.subscribe')}
    </NewsletterFormButton>
  );

  const termsConditions = (
    <Typography
      variant="bodyXSmall"
      sx={{
        color: 'text.secondary',
        maxWidth: isStacked ? '100%' : 402,
        textAlign: 'left',
      }}
    >
      <Trans
        i18nKey={'newsletter.welcome.hint'}
        components={[
          <NewsletterLink
            href={TERMS_CONDITIONS_URL}
            target="_blank"
            rel="noreferrer"
          />,
          <NewsletterLink
            href={AppPaths.PrivacyPolicy}
            target="_blank"
            rel="noreferrer"
          />,
        ]}
      />
    </Typography>
  );

  return (
    <>
      <NewsletterForm
        as="form"
        onSubmit={handleSubscribe}
        sx={isStacked ? { maxWidth: '100%' } : undefined}
      >
        {isStacked ? (
          <Stack spacing={2} sx={{ width: '100%' }}>
            <NewsletterFormGroup
              error={!!errorMessage}
              disabled={isPending}
              layout="stacked"
            >
              {emailField}
            </NewsletterFormGroup>
            {errorMessage && (
              <NewsletterErrorMessage variant="bodyMedium" sx={{ mt: 0 }}>
                {errorMessage}
              </NewsletterErrorMessage>
            )}

            {submitButton}

            {termsConditions}
          </Stack>
        ) : (
          <>
            <NewsletterFormGroup error={!!errorMessage} disabled={isPending}>
              {emailField}

              {submitButton}
            </NewsletterFormGroup>
            {errorMessage && (
              <NewsletterErrorMessage variant="bodyMedium">
                {errorMessage}
              </NewsletterErrorMessage>
            )}
          </>
        )}
      </NewsletterForm>
      {!isStacked && termsConditions}
    </>
  );
};
