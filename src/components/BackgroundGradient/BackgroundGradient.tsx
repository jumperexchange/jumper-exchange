'use client';
import { type CSSObject } from '@mui/material';
import {
  BackgroundGradientBottomLeft,
  BackgroundGradientBottomRight,
  BackgroundGradientContainer,
  BackgroundGradientTopCenter,
  SuperfestBackgroundContainer,
} from '.';
import { SirBridgeLot } from '../illustrations/SirBridgeLot';
import { FixBoxWithNoOverflow, MovingBox } from './MovingBox.style';
import { usePartnerTheme } from 'src/hooks/usePartnerTheme';
import { usePathname } from 'next/navigation';
import { useSuperfest } from 'src/hooks/useSuperfest';
import { useMainPaths } from 'src/hooks/useMainPaths';

interface BackgroundGradientProps {
  styles?: CSSObject;
}

export const BackgroundGradient = ({ styles }: BackgroundGradientProps) => {
  const { partnerName } = usePartnerTheme();
  const pathname = usePathname();
  const { isSuperfest } = useSuperfest();
  const { isMainPaths } = useMainPaths();

  if (isSuperfest || isMainPaths) {
    return <SuperfestBackgroundContainer sx={styles} />;
  }

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
  return (
    <BackgroundGradientContainer sx={styles}>
      <BackgroundGradientBottomLeft />
      <BackgroundGradientBottomRight />
      <BackgroundGradientTopCenter />
    </BackgroundGradientContainer>
  );
};
