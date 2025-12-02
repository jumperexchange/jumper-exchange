import { useEffect, useState } from 'react';
import { extractColors, extractColorsFromImageData } from 'extract-colors';

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

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

const extractCenterRegion = (
  img: HTMLImageElement,
  cropRatio: number,
): ImageData => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    throw new Error('Canvas 2D context not supported');
  }

  const croppedWidth = img.width * cropRatio;
  const croppedHeight = img.height * cropRatio;
  const offsetX = (img.width - croppedWidth) / 2;
  const offsetY = (img.height - croppedHeight) / 2;

  canvas.width = croppedWidth;
  canvas.height = croppedHeight;

  ctx.drawImage(
    img,
    offsetX,
    offsetY,
    croppedWidth,
    croppedHeight,
    0,
    0,
    croppedWidth,
    croppedHeight,
  );

  return ctx.getImageData(0, 0, croppedWidth, croppedHeight);
};

const extractColorsFromCroppedImage = async (
  imageUrl: string,
  cropRatio: number,
): Promise<Color[]> => {
  const img = await loadImage(imageUrl);
  const imageData = extractCenterRegion(img, cropRatio);
  return extractColorsFromImageData(imageData);
};

const extractColorsFromFullImage = async (
  imageUrl: string,
): Promise<Color[]> => {
  return extractColors(imageUrl, {
    crossOrigin: 'anonymous',
  });
};

export const useGetColorsFromImage = (
  imageUrl: string,
  useCenterCrop = false,
  cropRatio = 0.5,
) => {
  const [colors, setColors] = useState<Color[]>([]);

  useEffect(() => {
    if (!imageUrl) {
      setColors([]);
      return;
    }

    const extractImageColors = async () => {
      try {
        const isValidCropRatio = cropRatio > 0 && cropRatio < 1;
        const shouldCrop = useCenterCrop && isValidCropRatio;

        if (useCenterCrop && !isValidCropRatio) {
          console.warn(
            'Skipping image crop: cropRatio must be between 0 and 1',
          );
        }

        const palette = shouldCrop
          ? await extractColorsFromCroppedImage(imageUrl, cropRatio)
          : await extractColorsFromFullImage(imageUrl);

        setColors(palette);
      } catch (error) {
        console.error('Error extracting colors from image:', error);
        setColors([]);
      }
    };

    extractImageColors();
  }, [imageUrl, useCenterCrop, cropRatio]);

  return colors;
};
