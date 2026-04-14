import { useMemo } from 'react';
import { maxBy } from 'lodash';
import { useColorScheme, useTheme } from '@mui/material/styles';
import { readableColor } from 'polished';
import { useGetColorsFromImage } from './useGetColorsFromImage';

export const useGetContrastBgColor = (imageUrl: string) => {
  const colors = useGetColorsFromImage(imageUrl, true);
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const basePalette = theme.palette;
  const currentMode =
    colorScheme.mode === 'system' ? 'light' : colorScheme.mode || 'light';
  const currentPalette =
    theme.colorSchemes?.[currentMode]?.palette || basePalette;

  const isLoading = colors.length === 0;

  const contrastBgColor = useMemo(() => {
    if (!colors.length) {
      return currentPalette.surface1.main;
    }

    const highestPopulationColor = maxBy(colors, 'area');

    if (!highestPopulationColor) {
      return currentPalette.surface1.main;
    }

    const contrastColor = readableColor(
      highestPopulationColor.hex,
      basePalette.alphaDark900.main,
      basePalette.alphaLight900.main,
      true,
    );

    return contrastColor;
  }, [colors, currentPalette, basePalette]);

  return { contrastBgColor, isLoading };
};
