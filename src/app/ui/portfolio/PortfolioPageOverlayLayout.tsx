'use client';

import { useAccount } from '@lifi/wallet-management';
import type { FC, PropsWithChildren } from 'react';
import { WelcomeOverlayLayout } from '@/components/WelcomeOverlayLayout/WelcomeOverlayLayout';
import { HeaderHeight } from '@/const/headerHeight';
import { TrackingAction, TrackingCategory } from '@/const/trackingKeys';
import { usePortfolioWelcomeScreen } from '@/hooks/usePortfolioWelcomeScreen';
import { PortfolioPageOverlayContentContainer } from './PortfolioPage.styles';
import { PortfolioWelcomeScreen } from './PortfolioWelcomeScreen';

export const PortfolioPageOverlayLayout: FC<PropsWithChildren> = ({
  children,
}) => {
  const { account } = useAccount();

  const { portfolioWelcomeScreenClosed, setPortfolioWelcomeScreenClosed } =
    usePortfolioWelcomeScreen();

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
      contentSx={{
        paddingTop: portfolioWelcomeScreenClosed ? 0 : 3.5,
      }}
      fullWidthGlowEffect
    >
      <PortfolioPageOverlayContentContainer
        portfolioWelcomeScreenClosed={portfolioWelcomeScreenClosed ?? false}
      >
        {children}
      </PortfolioPageOverlayContentContainer>
    </WelcomeOverlayLayout>
  );
};
