'use client';
import { useThemeStore } from '@/stores/theme';
import { styled } from '@mui/material/styles';
import {
  BackgroundGradientBottomLeft,
  BackgroundGradientBottomRight,
  BackgroundGradientTopCenter,
} from './BackgroundGradient';

export interface BackgroundContainerProps {
  variant?: 'outlined';
  backgroundColor?: string;
  backgroundImageUrl?: URL;
}

const BackgroundContainer = styled('div', {
  name: 'Background', // The component name
  slot: 'root', // The slot name
})(() => ({}));

function Background() {
  const configTheme = useThemeStore((state) => state.configTheme);

  return (
    <BackgroundContainer>
      {configTheme?.hasBackgroundGradient && (
        <>
          <BackgroundGradientBottomLeft />
          <BackgroundGradientBottomRight />
          <BackgroundGradientTopCenter />
        </>
      )}
    </BackgroundContainer>
  );
}
export default Background;
