'use client';

import { WelcomeOverlayLayout } from '@/components/WelcomeOverlayLayout/WelcomeOverlayLayout';
import { HeaderHeight } from '@/const/headerHeight';
import type { FC, PropsWithChildren } from 'react';
import { GatekeeperIllustrationWrapper } from './Gatekeeper.style';
import { GatekeeperOverlayContent } from './GatekeeperOverlayContent';
import { noop } from 'lodash';
import type { GatekeeperIllustrations } from './types';

interface GatekeeperOverlayLayoutProps extends PropsWithChildren {
  title: string;
  subtitleIntro: string;
  subtitle: string;
  illustrations: GatekeeperIllustrations;
}

export const GatekeeperOverlayLayout: FC<GatekeeperOverlayLayoutProps> = ({
  title,
  subtitleIntro,
  subtitle,
  children,
  illustrations,
}) => {
  return (
    <WelcomeOverlayLayout
      overlayContent={
        <GatekeeperOverlayContent
          title={title}
          subtitle={[subtitleIntro, subtitle].join('<br/><br/>')}
        >
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
      <GatekeeperIllustrationWrapper
        sx={(theme) => ({
          ...illustrations.mobile.sx,
          [theme.breakpoints.up('md')]: {
            ...illustrations.desktop.sx,
          },
        })}
      >
        {illustrations.illustration}
      </GatekeeperIllustrationWrapper>
    </WelcomeOverlayLayout>
  );
};
