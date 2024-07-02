'use client';
import { useTheme, type CSSObject } from '@mui/material';
import { useMemo } from 'react';
import { STRAPI_URL_PATH } from 'src/const/urls';
import { usePartnerFilter } from 'src/hooks/usePartnerFilter';
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
  const { partnerName } = usePartnerFilter();
  const { partnerTheme, activeUid, backgroundColor, imgUrl } =
    usePartnerTheme();
  const theme = useTheme();
  const bgImg = useMemo(() => {
    return (
      imgUrl ||
      (theme.palette.mode === 'light'
        ? partnerTheme?.attributes.BackgroundImageLight.data?.attributes.url &&
          new URL(
            partnerTheme?.attributes.BackgroundImageLight.data.attributes.url,
            STRAPI_URL_PATH,
          )
        : partnerTheme?.attributes.BackgroundImageDark.data?.attributes.url &&
          new URL(
            partnerTheme?.attributes.BackgroundImageDark.data.attributes.url,
            STRAPI_URL_PATH,
          ))
    );
  }, [
    imgUrl,
    partnerTheme?.attributes.BackgroundImageDark,
    partnerTheme?.attributes.BackgroundImageLight,
    theme.palette.mode,
  ]);
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
    <BackgroundGradientContainer
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
    </BackgroundGradientContainer>
  );
};
