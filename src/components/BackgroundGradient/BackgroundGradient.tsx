'use client';
import { type CSSObject } from '@mui/material';
import { usePartnerFilter } from 'src/hooks/usePartnerFilter';
import type { ThemeModesSupported } from 'src/types/settings';
import type { PartnerThemesAttributes } from 'src/types/strapi';
import {
  BackgroundGradientBottomLeft,
  BackgroundGradientBottomRight,
  BackgroundGradientContainer,
  BackgroundGradientTopCenter,
} from '.';
import Background from '../Background';
import { SirBridgeLot } from '../illustrations/SirBridgeLot';
import { FixBoxWithNoOverflow, MovingBox } from './MovingBox.style';

interface BackgroundGradientProps {
  styles?: CSSObject;
  partnerTheme?: PartnerThemesAttributes;
  themeMode?: ThemeModesSupported;
}

export const BackgroundGradient = ({
  styles,
  partnerTheme,
  themeMode,
}: BackgroundGradientProps) => {
  const { partnerName } = usePartnerFilter();

  if (partnerName === 'memecoins') {
    return (
      <>
        <FixBoxWithNoOverflow>
          <MovingBox>
            <SirBridgeLot />
          </MovingBox>
        </FixBoxWithNoOverflow>
        <BackgroundGradientContainer sx={styles}>
          <BackgroundGradientBottomLeft />
          <BackgroundGradientBottomRight />
          <BackgroundGradientTopCenter />
        </BackgroundGradientContainer>
      </>
    );
  }
  return (
    <>
      <Background />

      {/* <BackgroundGradientContainer
        sx={styles}
        backgroundImageUrl={bgImg || undefined}
        backgroundColor={bgCol as string}
      >
        {!activeUid && (
          <>
            <BackgroundGradientBottomLeft />
            <BackgroundGradientBottomRight />
            <BackgroundGradientTopCenter />
          </>
        )}
      </BackgroundGradientContainer> */}
    </>
  );
};
