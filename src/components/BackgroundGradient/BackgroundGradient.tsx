'use client';
import { type CSSObject } from '@mui/material';
import { usePathname } from 'next/navigation';
import { usePartnerTheme } from 'src/hooks/usePartnerTheme';
import {
  BackgroundFooterImage,
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
  const { activeUid, backgroundColor, imgUrl, footerImageUrl } =
    usePartnerTheme();

  console.log('imgUrl', imgUrl);
  console.log('footerImageUrl', footerImageUrl);
  return !pathname?.includes('memecoins') ? (
    <BackgroundGradientContainer
      sx={styles}
      backgroundImageUrl={imgUrl}
      backgroundColor={backgroundColor}
    >
      {activeUid && footerImageUrl !== undefined && (
        <BackgroundFooterImage
          alt="footer-image"
          src={footerImageUrl.href}
          width={300}
          height={200}
        />
      )}
      {!activeUid && (
        <>
          <BackgroundGradientBottomLeft />
          <BackgroundGradientBottomRight />
          <BackgroundGradientTopCenter />
        </>
      )}
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
