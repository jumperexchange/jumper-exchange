'use client';

import { CustomColor } from '@/components/CustomColorTypography.style';
import {
  ContentWrapper,
  WelcomeContent,
  WelcomeScreenSubtitle,
} from '@/components/WelcomeScreen/WelcomeScreen.style';
import { useMenuStore } from '@/stores/menu';
import type { FC } from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next/TransWithoutContext';
import {
  NewsletterWelcomeContentContainer,
  NewsletterWelcomeContentTitleContainer,
} from './NewsletterPage.style';
import { NewsletterSubscribeForm } from './NewsletterSubscribeForm';

interface NewsletterWelcomeScreenProps {
  confirmSubscription?: boolean;
}

export const NewsletterWelcomeScreen: FC<NewsletterWelcomeScreenProps> = ({
  confirmSubscription = false,
}) => {
  const { t } = useTranslation();
  const setSnackbarState = useMenuStore((state) => state.setSnackbarState);

  useEffect(() => {
    if (!confirmSubscription) {
      return;
    }
    setSnackbarState(true, t('newsletter.welcome.success'), 'success');
  }, [confirmSubscription, setSnackbarState, t]);

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
          <NewsletterSubscribeForm />
        </NewsletterWelcomeContentContainer>
      </WelcomeContent>
    </ContentWrapper>
  );
};
