'use client';
import { useTheme, type CSSObject } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { STRAPI_PARTNER_THEMES } from 'src/const/strapiContentKeys';
import { useStrapi } from 'src/hooks/useStrapi';
import { useSettingsStore } from 'src/stores/settings';
import type { PartnerThemesData } from 'src/types/strapi';
import { shallow } from 'zustand/shallow';
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
  const theme = useTheme();
  const partnerThemeUid = useSettingsStore(
    (state) => state.partnerThemeUid,
    shallow,
  );
  const {
    data: partnerThemes,
    url,
    isSuccess: partnerThemesIsSuccess,
  } = useStrapi<PartnerThemesData>({
    contentType: STRAPI_PARTNER_THEMES,
    filterUid: partnerThemeUid,
    queryKey: ['partner-themes'],
  });

  const imageUrl = useMemo(() => {
    if (partnerThemes) {
      return theme.palette.mode === 'light'
        ? new URL(
            partnerThemes[0].attributes.BackgroundImageLight.data?.attributes.url,
            url.origin,
          )
        : new URL(
            partnerThemes[0].attributes.BackgroundImageDark.data?.attributes.url,
            url.origin,
          );
    } else {
      return undefined;
    }
  }, [partnerThemes, theme.palette.mode, url.origin]);
  return !pathname?.includes('memecoins') ? (
    <BackgroundGradientContainer
      sx={styles}
      backgroundImageUrl={partnerThemeUid ? imageUrl : undefined}
    >
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
