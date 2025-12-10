'use client';

import { CustomColor } from '@/components/CustomColorTypography.style';
import { TrackingAction, TrackingCategory } from '@/const/trackingKeys';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import type { FC, MouseEventHandler } from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next/TransWithoutContext';
import { ToolCards } from '@/components/WelcomeScreen/ToolCard/ToolCards';
import {
  ContentWrapper,
  WelcomeContent,
  WelcomeScreenSubtitle,
} from '@/components/WelcomeScreen/WelcomeScreen.style';
import { AppPaths } from '@/const/urls';
import Typography from '@mui/material/Typography';
import {
  PortfolioWelcomeScreenButton,
  PortfolioWelcomeScreenButtonsContainer,
  PortfolioWelcomeScreenLink,
} from './PortfolioPage.styles';

interface PortfolioWelcomeScreenProps {
  onClose: () => void;
}

export const PortfolioWelcomeScreen: FC<PortfolioWelcomeScreenProps> = ({
  onClose,
}) => {
  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();
  const [openChainsToolModal, setOpenChainsToolModal] = useState(false);
  const [openBridgesToolModal, setOpenBridgesToolModal] = useState(false);
  const [openDexsToolModal, setOpenDexsToolModal] = useState(false);
  useEffect(() => {
    trackEvent({
      category: TrackingCategory.Portfolio,
      action: TrackingAction.ShowWelcomeMessageScreen,
      label: 'open-welcome-screen',
    });
  }, [trackEvent]);

  const handleGetStarted: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    onClose();
    trackEvent({
      category: TrackingCategory.Portfolio,
      action: TrackingAction.CloseWelcomeScreen,
      label: 'enter_portfolio_welcome_screen',
      enableAddressable: true,
    });
  };

  return (
    <ContentWrapper>
      <WelcomeContent>
        <CustomColor as="h1" variant="urbanistTitle2XLarge">
          {t('portfolio.welcome.title')}
        </CustomColor>
        <WelcomeScreenSubtitle
          variant={'bodyLarge'}
          sx={{ maxWidth: '484px', marginX: 'auto', marginTop: 1 }}
        >
          <Trans i18nKey={'portfolio.welcome.subtitle'} />
        </WelcomeScreenSubtitle>
        <ToolCards
          openChainsToolModal={openChainsToolModal}
          setOpenChainsToolModal={setOpenChainsToolModal}
          openBridgesToolModal={openBridgesToolModal}
          setOpenBridgesToolModal={setOpenBridgesToolModal}
          openDexsToolModal={openDexsToolModal}
          setOpenDexsToolModal={setOpenDexsToolModal}
        />
        <PortfolioWelcomeScreenButtonsContainer direction="row" useFlexGap>
          <PortfolioWelcomeScreenButton
            aria-label="Open portfolio page"
            onClick={handleGetStarted}
            id="portfolio-get-started-button"
          >
            {t('portfolio.welcome.getStarted')}
          </PortfolioWelcomeScreenButton>
          <PortfolioWelcomeScreenLink href={AppPaths.Profile}>
            <Typography variant="bodyMediumStrong">
              {t('portfolio.welcome.explorePass')}
            </Typography>
          </PortfolioWelcomeScreenLink>
        </PortfolioWelcomeScreenButtonsContainer>
      </WelcomeContent>
    </ContentWrapper>
  );
};
