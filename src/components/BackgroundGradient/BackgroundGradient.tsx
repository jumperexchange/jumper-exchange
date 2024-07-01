'use client';
import { type CSSObject } from '@mui/material';
import { useMemo } from 'react';
import { STRAPI_URL_PATH } from 'src/const/urls';
import { usePartnerFilter } from 'src/hooks/usePartnerFilter';
import { usePartnerTheme } from 'src/hooks/usePartnerTheme';
import type { ThemeModesSupported } from 'src/types/settings';
import type { PartnerThemesAttributes } from 'src/types/strapi';
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
  partnerTheme?: PartnerThemesAttributes;
  themeMode?: ThemeModesSupported;
}

export const BackgroundGradient = ({
  styles,
  partnerTheme,
  themeMode,
}: BackgroundGradientProps) => {
  const { partnerName } = usePartnerFilter();
  const { activeUid, backgroundColor, imgUrl, availableWidgetTheme } =
    usePartnerTheme();
  console.log('BackgroundGradient: CHECK partnerTheme', partnerTheme);
  console.log('BackgroundGradient: Check OBJECT', {
    activeUid,
    backgroundColor,
    imgUrl,
    availableWidgetTheme,
  });

  console.log('activeUid', activeUid);

  const bgImg = useMemo(() => {
    return (
      (themeMode === 'light'
        ? partnerTheme?.BackgroundImageLight.data?.attributes.url &&
          new URL(
            partnerTheme?.BackgroundImageLight.data.attributes.url,
            STRAPI_URL_PATH,
          )
        : partnerTheme?.BackgroundImageDark.data?.attributes.url &&
          new URL(
            partnerTheme?.BackgroundImageDark.data.attributes.url,
            STRAPI_URL_PATH,
          )) || imgUrl
    );
  }, [imgUrl, partnerTheme, themeMode]);

  console.log('bgImg', bgImg);
  const bgCol = useMemo(() => {
    return (
      backgroundColor ||
      (themeMode === 'light'
        ? partnerTheme?.lightConfig?.customization?.palette.background
        : partnerTheme?.darkConfig?.customization?.palette.background)
    );
  }, [backgroundColor, partnerTheme, themeMode]);
  console.log('bgCol', bgCol);

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
      backgroundImageUrl={bgImg}
      backgroundColor={bgCol as string}
    >
      {(!activeUid || activeUid === 'undefined') && (
        <>
          <BackgroundGradientBottomLeft />
          <BackgroundGradientBottomRight />
          <BackgroundGradientTopCenter />
        </>
      )}
    </BackgroundGradientContainer>
  );
};
