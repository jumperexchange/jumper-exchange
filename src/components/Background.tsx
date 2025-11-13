'use client';
import { useThemeStore } from '@/stores/theme';
import { styled } from '@mui/material/styles';
import {
  BackgroundGradientBottomLeft,
  BackgroundGradientBottomRight,
} from './BackgroundGradient';
import { AnimatedBackgroundImage } from './core/AnimatedBackgroundImage/AnimatedBackgroundImage';
import { useGetPartnerThemeImage } from 'src/hooks/theme/useGetPartnerThemeImage';

export interface BackgroundContainerProps {
  variant?: 'outlined';
  backgroundColor?: string;
  backgroundImageUrl?: URL;
}

const BackgroundContainer = styled('div', {
  name: 'Background',
  slot: 'root',
})(() => ({}));

function Background() {
  const configTheme = useThemeStore((state) => state.configTheme);

  const backgroundImageUrl = useGetPartnerThemeImage();

  return (
    <BackgroundContainer id="background-root">
      <AnimatedBackgroundImage
        src={backgroundImageUrl}
        sx={{
          '& > img': {
            objectPosition: configTheme?.backgroundImagePosition ?? 'center',
          },
        }}
      />

      {configTheme?.hasBackgroundGradient && (
        <>
          <BackgroundGradientBottomLeft />
          <BackgroundGradientBottomRight />
        </>
      )}
    </BackgroundContainer>
  );
}
export default Background;
