'use client';

import type { FC, MouseEventHandler } from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next/TransWithoutContext';
import { CustomColor } from '@/components/CustomColorTypography.style';
import { ToolCards } from '@/components/WelcomeScreen/ToolCard/ToolCards';
import {
  ContentWrapper,
  WelcomeContent,
  WelcomeScreenSubtitle,
} from '@/components/WelcomeScreen/WelcomeScreen.style';
import { TrackingAction, TrackingCategory } from '@/const/trackingKeys';
import { usePortfolioWelcomeScreen } from '@/hooks/usePortfolioWelcomeScreen';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import {
  PortfolioWelcomeScreenButton,
  PortfolioWelcomeScreenButtonsContainer,
} from './PortfolioPage.styles';
import { useAccount, useWalletMenu } from '@lifi/wallet-management';

interface PortfolioWelcomeScreenProps {
  onClose: () => void;
}

export const PortfolioWelcomeScreen: FC<PortfolioWelcomeScreenProps> = ({
  onClose,
}) => {
  const { portfolioWelcomeScreenClosed, setPortfolioWelcomeScreenClosed } =
    usePortfolioWelcomeScreen();
  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();
  const { account } = useAccount();
  const { openWalletMenu } = useWalletMenu();

  const [openChainsToolModal, setOpenChainsToolModal] = useState(false);
  const [openBridgesToolModal, setOpenBridgesToolModal] = useState(false);
  const [openDexsToolModal, setOpenDexsToolModal] = useState(false);

  useEffect(() => {
    if (portfolioWelcomeScreenClosed) {
      trackEvent({
        category: TrackingCategory.Portfolio,
        action: TrackingAction.ShowWelcomeMessageScreen,
        label: 'open-portfolio-welcome-screen',
      });
    }
  }, [trackEvent, portfolioWelcomeScreenClosed]);

  const handleGetStarted: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (!account.address) {
      openWalletMenu();
    }

    event.stopPropagation();
    onClose();
    if (!portfolioWelcomeScreenClosed) {
      setPortfolioWelcomeScreenClosed(true);
      trackEvent({
        category: TrackingCategory.Portfolio,
        action: TrackingAction.CloseWelcomeScreen,
        label: 'enter_portfolio_welcome_screen',
        enableAddressable: true,
      });
    }
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
        </PortfolioWelcomeScreenButtonsContainer>
      </WelcomeContent>
    </ContentWrapper>
  );
};
