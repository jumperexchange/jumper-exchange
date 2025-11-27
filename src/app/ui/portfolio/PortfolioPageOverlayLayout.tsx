'use client';

import { WelcomeOverlayLayout } from '@/components/WelcomeOverlayLayout/WelcomeOverlayLayout';
import { TrackingCategory, TrackingAction } from '@/const/trackingKeys';
import { HeaderHeight } from '@/const/headerHeight';
import { useSettingsStore } from '@/stores/settings/SettingsStore';
import { PortfolioWelcomeScreen } from './PortfolioWelcomeScreen';
import { useAccount } from '@lifi/wallet-management';
import { useEffect } from 'react';
import type { FC, PropsWithChildren } from 'react';
import { PortfolioPageOverlayContentContainer } from './PortfolioPage.styles';

export const PortfolioPageOverlayLayout: FC<PropsWithChildren> = ({
  children,
}) => {
  const { account } = useAccount();

  const [portfolioWelcomeScreenClosed, setPortfolioWelcomeScreenClosed] =
    useSettingsStore((state) => [
      state.portfolioWelcomeScreenClosed,
      state.setPortfolioWelcomeScreenClosed,
    ]);

  useEffect(() => {
    if (account?.address) {
      return;
    }
    setPortfolioWelcomeScreenClosed(false);
  }, [account?.address, setPortfolioWelcomeScreenClosed]);

  const handleOverlayClose = () => {
    setPortfolioWelcomeScreenClosed(true);
  };

  return (
    <WelcomeOverlayLayout
      overlayContent={<PortfolioWelcomeScreen onClose={handleOverlayClose} />}
      isOverlayOpen={!portfolioWelcomeScreenClosed}
      onOverlayClose={handleOverlayClose}
      enabled
      trackingConfig={{
        category: TrackingCategory.Portfolio,
        action: TrackingAction.ClosePortfolioScreen,
        label: 'portfolio_welcome_dismissed',
      }}
      containerSx={{
        overflow: portfolioWelcomeScreenClosed ? 'auto' : 'hidden',
        height: {
          xs: `calc(100dvh - ${HeaderHeight.XS}px)`,
          sm: `calc(100dvh - ${HeaderHeight.SM}px)`,
          md: `calc(100dvh - ${HeaderHeight.MD}px)`,
        },
      }}
      fullWidthGlowEffect
    >
      <PortfolioPageOverlayContentContainer
        portfolioWelcomeScreenClosed={portfolioWelcomeScreenClosed}
      >
        {children}
      </PortfolioPageOverlayContentContainer>
    </WelcomeOverlayLayout>
  );
};
