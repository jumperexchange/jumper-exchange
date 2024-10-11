/* eslint-disable @next/next/no-img-element */
'use client';
import type { PropsWithChildren } from 'react';

interface ImageGenerationProps {
  width: number;
  height: number;
  scale: number;
  backgroundImage: string;
}

export const ImageGeneration: React.FC<
  PropsWithChildren<ImageGenerationProps>
> = ({ children, width, height, scale, backgroundImage }) => {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        width: width * scale,
        height: height * scale,
      }}
    >
      <p>huhuhu</p>
      <img
        alt="Widget Example"
        width={'100%'}
        height={'100%'}
        style={{
          margin: 'auto',
          position: 'absolute',
          top: 0,
          left: 0,
          objectFit: 'cover',
          width: width * scale,
          height: height * scale,
        }}
        src={backgroundImage}
      />
      {children}
    </div>
  );
};
