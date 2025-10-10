import { useEffect, useState } from 'react';
import { extractColors } from 'extract-colors';

export interface Color {
  hex: string;
  red: number;
  green: number;
  blue: number;
  area: number;
  hue: number;
  saturation: number;
  lightness: number;
  intensity: number;
}

export const useGetColorsFromImage = (imageUrl: string) => {
  const [colors, setColors] = useState<Color[]>([]);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const palette = await extractColors(imageUrl);
        setColors(palette);
      } catch {
        setColors([]);
      }
    };

    if (!imageUrl) {
      setColors([]);
      return;
    }

    fetchColors();
  }, [imageUrl]);

  return colors;
};
