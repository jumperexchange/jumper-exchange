'use client';
import { type CSSObject } from '@mui/material';
import { usePathname } from 'next/navigation';
import { usePartnerTheme } from 'src/hooks/usePartnerTheme';
import {
  BackgroundGradientBottomLeft,
  BackgroundGradientBottomRight,
  BackgroundGradientContainer,
  BackgroundGradientTopCenter,
} from '.';
import { SirBridgeLot } from '../illustrations/SirBridgeLot';
import { FixBoxWithNoOverflow, MovingBox } from './MovingBox.style';

interface BackgroundGradientProps {
  styles?: CSSObject;
}

export const BackgroundGradient = ({ styles }: BackgroundGradientProps) => {
  const pathname = usePathname();
  const { imgUrl } = usePartnerTheme();

  return !pathname?.includes('memecoins') ? (
    <BackgroundGradientContainer sx={styles} backgroundImageUrl={imgUrl}>
      <BackgroundGradientBottomLeft />
      <BackgroundGradientBottomRight />
      <BackgroundGradientTopCenter />
    </BackgroundGradientContainer>
  ) : (
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
};
