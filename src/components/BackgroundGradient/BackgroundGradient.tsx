'use client';
import { type CSSObject } from '@mui/material';
import {
  BackgroundGradientBottomLeft,
  BackgroundGradientBottomRight,
  BackgroundGradientContainer,
  BackgroundGradientTopCenter,
} from '.';
import { usePathname } from 'next/navigation';
import { SirBridgeLot } from '../illustrations/SirBridgeLot';
import { FixBoxWithNoOverflow, MovingBox } from './MovingBox.style';

interface BackgroundGradientProps {
  styles?: CSSObject;
}

export const BackgroundGradient = ({ styles }: BackgroundGradientProps) => {
  const pathname = usePathname();

  return !pathname.includes('memecoins') ? (
    <BackgroundGradientContainer sx={styles}>
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
