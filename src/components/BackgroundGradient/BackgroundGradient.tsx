'use client';
import { type CSSObject } from '@mui/material';
import {
  BackgroundGradientBottomLeft,
  BackgroundGradientBottomRight,
  BackgroundGradientContainer,
  BackgroundGradientTopCenter,
} from '.';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

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
    <Image
      src="/pepe_background.jpeg"
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
};
