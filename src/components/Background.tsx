'use client';
import { CanvasBackground } from '@/components/CanvasBackground/CanvasBackground';
import { ClientOnly } from '@/components/ClientOnly';
import { useThemeStore } from '@/stores/theme';
import { styled } from '@mui/material/styles';
import {
  BackgroundGradientBottomLeft,
  BackgroundGradientBottomRight,
} from './BackgroundGradient/BackgroundGradient.style';
import { AnimatedBackgroundImage } from './core/AnimatedBackgroundImage/AnimatedBackgroundImage';
import { useGetPartnerThemeImage } from 'src/hooks/theme/useGetPartnerThemeImage';
import { useThemeConditionsMet } from '@/hooks/theme/useThemeConditionsMet';

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
  const { shouldShowForTheme } = useThemeConditionsMet();
  const canvasBackground = configTheme?.canvasBackground;
  const showCanvas = shouldShowForTheme && canvasBackground?.id;

  const { url: backgroundImageUrl, mime: backgroundImageMime } =
    useGetPartnerThemeImage();

  return (
    <BackgroundContainer id="background-root">
      {showCanvas ? (
        <ClientOnly>
          <CanvasBackground
            id={canvasBackground.id}
            options={canvasBackground.options}
          />
        </ClientOnly>
      ) : (
        <>
          <AnimatedBackgroundImage
            src={backgroundImageUrl}
            mime={backgroundImageMime}
            sx={{
              '& > img, & > video': {
                objectPosition:
                  configTheme?.backgroundImagePosition ?? 'center',
              },
            }}
          />

          {!shouldShowForTheme && (
            <>
              <BackgroundGradientBottomLeft />
              <BackgroundGradientBottomRight />
            </>
          )}
        </>
      )}
    </BackgroundContainer>
  );
}
export default Background;
