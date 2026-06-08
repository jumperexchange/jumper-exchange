'use client';

import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { isVideoMime } from '@/utils/isVideoMime';
import { AnimatedBackgroundImageContainer } from './AnimatedBackgroundImage.styles';

export interface AnimatedBackgroundImageProps {
  src?: string | null;
  mime?: string | null;
  sx?: SxProps<Theme>;
}

const AnimatedBackgroundVideo = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = true;

    const playVideo = () => {
      void video.play().catch(() => undefined);
    };

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      playVideo();
      return;
    }

    video.addEventListener('loadeddata', playVideo);

    return () => {
      video.removeEventListener('loadeddata', playVideo);
    };
  }, [src]);

  return (
    <Box
      component="video"
      ref={videoRef}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden
      sx={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }}
    />
  );
};

export const AnimatedBackgroundImage = ({
  src,
  mime,
  sx,
}: AnimatedBackgroundImageProps) => {
  return (
    <AnimatePresence mode="wait">
      {src && (
        <AnimatedBackgroundImageContainer
          key={src}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.5,
            ease: 'easeInOut',
          }}
          sx={sx}
        >
          {isVideoMime(mime) ? (
            <AnimatedBackgroundVideo src={src} />
          ) : (
            <Image
              src={src}
              alt="Animated background image"
              fill
              priority
              sizes="100vw"
              style={{
                objectFit: 'cover',
              }}
            />
          )}
        </AnimatedBackgroundImageContainer>
      )}
    </AnimatePresence>
  );
};
