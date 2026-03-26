import { useEffect, useMemo, useState } from 'react';
import { extractColors, extractColorsFromImageData } from 'extract-colors';
import { maxBy } from 'lodash';

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

const extractEdgeRegion = (
  img: HTMLImageElement,
  cropRatio: number,
): ImageData => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    throw new Error('Canvas 2D context not supported');
  }

  canvas.width = img.width;
  canvas.height = img.height;

  ctx.drawImage(img, 0, 0, img.width, img.height);

  const centerWidth = img.width * cropRatio;
  const centerHeight = img.height * cropRatio;
  const offsetX = (img.width - centerWidth) / 2;
  const offsetY = (img.height - centerHeight) / 2;

  ctx.clearRect(offsetX, offsetY, centerWidth, centerHeight);

  return ctx.getImageData(0, 0, img.width, img.height);
};

const extractColorsFromCroppedImage = async (
  imageUrl: string,
  cropRatio: number,
): Promise<Color[]> => {
  const img = await loadImage(imageUrl);
  const imageData = extractCenterRegion(img, cropRatio);
  return extractColorsFromImageData(imageData);
};

const extractColorsFromEdgeImage = async (
  imageUrl: string,
  cropRatio: number,
): Promise<Color[]> => {
  const img = await loadImage(imageUrl);
  const imageData = extractEdgeRegion(img, cropRatio);
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
  useEdgeCrop = false,
  cropRatio = 0.45,
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

        if ((useCenterCrop || useEdgeCrop) && !isValidCropRatio) {
          console.warn(
            'Skipping image crop: cropRatio must be between 0 and 1',
          );
        }

        let palette: Color[];

        if (useEdgeCrop && isValidCropRatio) {
          palette = await extractColorsFromEdgeImage(imageUrl, cropRatio);
        } else if (useCenterCrop && isValidCropRatio) {
          palette = await extractColorsFromCroppedImage(imageUrl, cropRatio);
        } else {
          palette = await extractColorsFromFullImage(imageUrl);
        }

        setColors(palette);
      } catch (error) {
        console.error('Error extracting colors from image:', error);
        setColors([]);
      }
    };

    extractImageColors();
  }, [imageUrl, useCenterCrop, useEdgeCrop, cropRatio]);

  return colors;
};

export const useDominantColorFromImage = (
  imageUrl: string,
  useCenterCrop = false,
  useEdgeCrop = false,
  cropRatio = 0.5,
): string | undefined => {
  const colors = useGetColorsFromImage(
    imageUrl,
    useCenterCrop,
    useEdgeCrop,
    cropRatio,
  );

  return useMemo(
    () =>
      maxBy(
        colors.filter((color) => color.area > 0.1),
        'area',
      )?.hex,
    [colors],
  );
};
