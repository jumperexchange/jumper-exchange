'use client';
import { Box, type CSSObject } from '@mui/material';
import {
  BackgroundGradientBottomLeft,
  BackgroundGradientBottomRight,
  BackgroundGradientContainer,
  BackgroundGradientTopCenter,
} from '.';
import { usePathname } from 'next/navigation';

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
    <Box
      component="img"
      sx={{
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
      src="https://strapi.li.finance/uploads/pepebackground_b08236de5e.jpg"
    />
  );
};
