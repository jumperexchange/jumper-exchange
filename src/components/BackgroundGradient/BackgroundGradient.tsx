'use client';
import { useTheme, type CSSObject } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { usePartnerFilter } from 'src/hooks/usePartnerFilter';
import { usePartnerTheme } from 'src/hooks/usePartnerTheme';
import {
  BackgroundGradientBottomLeft,
  BackgroundGradientBottomRight,
  BackgroundGradientContainer,
  BackgroundGradientTopCenter,
  SuperfestBackgroundContainer,
} from '.';
import { SirBridgeLot } from '../illustrations/SirBridgeLot';
import { FixBoxWithNoOverflow, MovingBox } from './MovingBox.style';

interface BackgroundGradientProps {
  styles?: CSSObject;
}

export const BackgroundGradient = ({ styles }: BackgroundGradientProps) => {
  const { partnerName } = usePartnerFilter();
  const pathname = usePathname();
  const { partnerTheme, activeUid, backgroundColor, imgUrl } =
    usePartnerTheme();
  const theme = useTheme();
  const bgImg = useMemo(() => {
    return imgUrl;
  }, [imgUrl]);
  const bgCol = useMemo(() => {
    return (
      backgroundColor ||
      (theme.palette.mode === 'light'
        ? partnerTheme?.attributes.lightConfig?.customization?.palette
            .background
        : partnerTheme?.attributes.darkConfig?.customization?.palette
            .background)
    );
  }, [
    backgroundColor,
    partnerTheme?.attributes.darkConfig,
    partnerTheme?.attributes.lightConfig,
    theme.palette.mode,
  ]);

  if (partnerName.includes('memecoins')) {
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
  return !pathname?.includes('superfest') ? (
    <BackgroundGradientContainer
      sx={styles}
      backgroundImageUrl={activeUid ? bgImg : undefined}
      backgroundColor={activeUid ? (bgCol as string) : undefined}
    >
      {!activeUid && (
        <>
          <BackgroundGradientBottomLeft />
          <BackgroundGradientBottomRight />
          <BackgroundGradientTopCenter />
        </>
      )}
    </BackgroundGradientContainer>
  ) : (
    <SuperfestBackgroundContainer sx={styles} />
  );
};
