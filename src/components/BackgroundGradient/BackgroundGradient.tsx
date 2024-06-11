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
  const { partnerName, backgroundURL } = usePartnerTheme();

  if (backgroundURL) {
    return (
      <Image
        src={backgroundURL}
        width={0}
        height={0}
        sizes="100vw"
        style={{
          transform: 'translateX(-50%)',
          top: 0,
          left: '50%',
          position: 'fixed',
          width: '100%',
          height: '100vh',
          zIndex: -1,
          backgroundColor: '#000000',
          opacity: 0.8,
        }}
        alt="pepe_background"
      />
    );
  }
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
