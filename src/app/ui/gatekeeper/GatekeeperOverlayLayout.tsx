'use client';

import { WelcomeOverlayLayout } from '@/components/WelcomeOverlayLayout/WelcomeOverlayLayout';
import { HeaderHeight } from '@/const/headerHeight';
import type { FC, PropsWithChildren } from 'react';
import {
  GatekeeperDesktopImage,
  GatekeeperMobileImage,
  GatekeeperOverlayContentContainer,
} from './Gatekeeper.style';
import { GatekeeperOverlayContent } from './GatekeeperOverlayContent';
import { noop } from 'lodash';
import type { GatekeeperIllustrations } from './types';

interface GatekeeperOverlayLayoutProps extends PropsWithChildren {
  title: string;
  subtitle: string;
  illustrations: GatekeeperIllustrations;
}

export const GatekeeperOverlayLayout: FC<GatekeeperOverlayLayoutProps> = ({
  title,
  subtitle,
  children,
  illustrations,
}) => {
  return (
    <WelcomeOverlayLayout
      overlayContent={
        <GatekeeperOverlayContent title={title} subtitle={subtitle}>
          {children}
        </GatekeeperOverlayContent>
      }
      isOverlayOpen
      onOverlayClose={noop}
      enabled
      containerSx={{
        overflow: 'hidden',
        height: {
          xs: `calc(100dvh - ${HeaderHeight.XS}px)`,
          sm: `calc(100dvh - ${HeaderHeight.SM}px)`,
          md: `calc(100dvh - ${HeaderHeight.MD}px)`,
        },
      }}
      fullWidthGlowEffect
    >
      <GatekeeperOverlayContentContainer>
        <GatekeeperMobileImage
          src={illustrations.mobile.src}
          alt={title}
          width={0}
          height={0}
          sizes="100vw"
          priority
          sx={illustrations.mobile.sx}
        />
        <GatekeeperDesktopImage
          src={illustrations.desktop.src}
          alt={title}
          width={0}
          height={0}
          sizes="100vw"
          priority
          sx={illustrations.desktop.sx}
        />
      </GatekeeperOverlayContentContainer>
    </WelcomeOverlayLayout>
  );
};
