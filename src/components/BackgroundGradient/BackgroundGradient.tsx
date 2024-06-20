'use client';
import { type CSSObject } from '@mui/material';
import {
  BackgroundGradientBottomLeft,
  BackgroundGradientBottomRight,
  BackgroundGradientContainer,
  BackgroundGradientTopCenter,
} from '.';
import { SirBridgeLot } from '../illustrations/SirBridgeLot';
import { FixBoxWithNoOverflow, MovingBox } from './MovingBox.style';
import { usePartnerTheme } from 'src/hooks/usePartnerTheme';
import Image from 'next/image';

interface BackgroundGradientProps {
  styles?: CSSObject;
}

export const BackgroundGradient = ({ styles }: BackgroundGradientProps) => {
  const { partnerName } = usePartnerTheme();

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
    <BackgroundGradientContainer sx={styles}>
      <BackgroundGradientBottomLeft />
      <BackgroundGradientBottomRight />
      <BackgroundGradientTopCenter />
    </BackgroundGradientContainer>
  );
};
