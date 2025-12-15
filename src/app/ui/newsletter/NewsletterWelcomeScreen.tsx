'use client';

import { CustomColor } from '@/components/CustomColorTypography.style';
import { TrackingAction, TrackingCategory } from '@/const/trackingKeys';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next/TransWithoutContext';
import {
  ContentWrapper,
  WelcomeContent,
  WelcomeScreenSubtitle,
} from '@/components/WelcomeScreen/WelcomeScreen.style';
import { AppPaths, TERMS_CONDITIONS_URL } from '@/const/urls';
import Typography from '@mui/material/Typography';
import {
  NewsletterErrorMessage,
  NewsletterLink,
  NewsletterWelcomeContentContainer,
  NewsletterFormGroup,
  NewsletterWelcomeContentTitleContainer,
  NewsletterForm,
  NewsletterFormButton,
} from './NewsletterPage.style';
import { useNewsletterSubscribe } from '@/hooks/useNewsletterSubscribe';
import Input from '@mui/material/Input';
import { getValidationSchema } from './utils';
import { useMenuStore } from '@/stores/menu';

interface NewsletterWelcomeScreenProps {
  confirmSubscription?: boolean;
}

export const NewsletterWelcomeScreen: FC<NewsletterWelcomeScreenProps> = ({
  confirmSubscription = false,
}) => {
  console.log(
    '[NewsletterWelcomeScreen] confirmSubscription:',
    confirmSubscription,
  );
  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();
  const [email, setEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const setSnackbarState = useMenuStore((state) => state.setSnackbarState);
  const { mutate, isPending, isSuccess } = useNewsletterSubscribe();

  useEffect(() => {
    if (!confirmSubscription) {
      return;
    }
    setSnackbarState(true, t('newsletter.welcome.success'), 'success');
  }, [confirmSubscription, setSnackbarState, t]);

  useEffect(() => {
    if (!isSuccess) {
      return;
    }
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
      label: 'newsletter-page-open',
    });
    mutate(
      {
        email: result.data.email,
        utmSource: 'jumper-exchange',
        utmMedium: 'website',
        utmCampaign: 'newsletter-page',
        referringSite: window.location.href,
      },
      {
        onError: (error) => {
          setErrorMessage(error.message);
        },
      },
    );
  };

  return (
    <ContentWrapper>
      <WelcomeContent>
        <NewsletterWelcomeContentContainer>
          <NewsletterWelcomeContentTitleContainer>
            <CustomColor as="h1" variant="urbanistTitle2XLarge">
              {t('newsletter.welcome.title')}
            </CustomColor>
            <WelcomeScreenSubtitle variant={'bodyLarge'} sx={{ marginTop: 1 }}>
              <Trans i18nKey={'newsletter.welcome.subtitle'} />
            </WelcomeScreenSubtitle>
          </NewsletterWelcomeContentTitleContainer>
          <NewsletterForm as="form" onSubmit={handleSubscribe}>
            <NewsletterFormGroup error={!!errorMessage}>
              <Input
                name="email"
                id="email"
                placeholder={t('newsletter.welcome.emailPlaceholder')}
                fullWidth
                value={email}
                onChange={handleEmailChange}
              />
              <NewsletterFormButton
                type="submit"
                disabled={!email || isPending}
              >
                {t('newsletter.welcome.subscribe')}
              </NewsletterFormButton>
            </NewsletterFormGroup>
            {errorMessage && (
              <NewsletterErrorMessage variant="bodyMedium">
                {errorMessage}
              </NewsletterErrorMessage>
            )}
          </NewsletterForm>
          <Typography
            variant="bodyXSmall"
            color="text.secondary"
            sx={{ maxWidth: 402, textAlign: 'left' }}
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
        </NewsletterWelcomeContentContainer>
      </WelcomeContent>
    </ContentWrapper>
  );
};
