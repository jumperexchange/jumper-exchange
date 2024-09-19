'use client';
import { CustomColor } from '@/components/CustomColorTypography.style';
import { TrackingAction, TrackingCategory } from '@/const/trackingKeys';
import { useWelcomeScreen } from '@/hooks/useWelcomeScreen';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import type { MouseEventHandler } from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next/TransWithoutContext';
import { JUMPER_URL } from 'src/const/urls';
import { ToolCards } from './ToolCard/ToolCards';
import {
  ContentWrapper,
  WelcomeContent,
  WelcomeScreenButton,
  WelcomeScreenButtonLabel,
  WelcomeScreenSubtitle,
} from './WelcomeScreen.style';

interface WelcomeScreenProps {
  closed: boolean;
  activeTheme?: string;
}

export const WelcomeScreen = ({ closed, activeTheme }: WelcomeScreenProps) => {
  const { welcomeScreenClosed, setWelcomeScreenClosed } = useWelcomeScreen(
    closed,
    activeTheme,
  );
  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();
  const [openChainsToolModal, setOpenChainsToolModal] = useState(false);
  const [openBridgesToolModal, setOpenBridgesToolModal] = useState(false);
  const [openDexsToolModal, setOpenDexsToolModal] = useState(false);
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
        <CustomColor as="h1" variant={'headerMedium'}>
          {t('navbar.welcome.title')}
        </CustomColor>
        <WelcomeScreenSubtitle variant={'bodyLarge'}>
          <Trans
            i18nKey={'navbar.welcome.subtitle' as string & never[]}
            components={[
              <a
                className={'link-jumper'}
                href={JUMPER_URL}
                target={'_blank'}
                rel="noreferrer"
                // onClick={handleAuditClick}
              />,
              <a
                className={'link-jumper'}
                href={JUMPER_URL}
                // onClick={handleLIFIClick}
                target={'_blank'}
                rel="noreferrer"
              />,
            ]}
          />
        </WelcomeScreenSubtitle>
        <ToolCards
          openChainsToolModal={openChainsToolModal}
          setOpenChainsToolModal={setOpenChainsToolModal}
          openBridgesToolModal={openBridgesToolModal}
          setOpenBridgesToolModal={setOpenBridgesToolModal}
          openDexsToolModal={openDexsToolModal}
          setOpenDexsToolModal={setOpenDexsToolModal}
        />
        <WelcomeScreenButton
          aria-label="Open welcome screen"
          onClick={handleGetStarted}
          id="get-started-button"
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
