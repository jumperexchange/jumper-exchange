'use client';
import { CustomColor } from '@/components/CustomColorTypography.style';
import { TrackingAction, TrackingCategory } from '@/const/trackingKeys';
import { useWelcomeScreen } from '@/hooks/useWelcomeScreen';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import type { MouseEventHandler } from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';
import { JUMPER_URL } from 'src/const/urls';
import { ToolCards } from './ToolCard/ToolCards';
import {
  ContentWrapper,
  WelcomeContent,
  WelcomeScreenButton,
  WelcomeScreenButtonLabel,
  WelcomeScreenSubtitle,
} from './WelcomeScreen.style';
import { Link } from '../Link/Link';

interface WelcomeScreenProps {
  activeTheme?: string;
}

export const WelcomeScreen = ({ activeTheme }: WelcomeScreenProps) => {
  const { welcomeScreenClosed, setWelcomeScreenClosed } = useWelcomeScreen();

  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();

  useEffect(() => {
    if (welcomeScreenClosed) {
      trackEvent({
        category: TrackingCategory.WelcomeScreen,
        label: 'open-welcome-screen',
        action: TrackingAction.ShowWelcomeMessageScreen,
      });
    }
  }, [trackEvent, welcomeScreenClosed]);

  const handleGetStarted: MouseEventHandler<HTMLButtonElement> = (event) => {
    const classList = (event.target as HTMLElement).classList;
    if (
      classList.contains?.('stats-card') ||
      classList.contains?.('link-jumper')
    ) {
      return;
    } else {
      event.stopPropagation();
      if (!welcomeScreenClosed) {
        setWelcomeScreenClosed(true);
        trackEvent({
          category: TrackingCategory.WelcomeScreen,
          action: TrackingAction.CloseWelcomeScreen,
          label: 'enter_welcome_screen',
          enableAddressable: true,
        });
      }
    }
  };

  return (
    <ContentWrapper>
      <WelcomeContent>
        <CustomColor variant="h1">{t('navbar.welcome.title')}</CustomColor>
        <WelcomeScreenSubtitle variant={'bodyLarge'}>
          <Trans
            i18nKey={'navbar.welcome.subtitle'}
            components={[
              <Link
                href={JUMPER_URL}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ fontWeight: 'bold' }}
                className={'link-jumper'}
              />,
            ]}
          />
        </WelcomeScreenSubtitle>
        <ToolCards />
        <WelcomeScreenButton
          aria-label="Open welcome screen"
          onClick={handleGetStarted}
          data-testid="get-started-button"
        >
          <WelcomeScreenButtonLabel
            aria-label="Close welcome screen"
            variant={'bodyMediumStrong'}
          >
            {t('navbar.welcome.cta')}
          </WelcomeScreenButtonLabel>
        </WelcomeScreenButton>
      </WelcomeContent>
    </ContentWrapper>
  );
};
