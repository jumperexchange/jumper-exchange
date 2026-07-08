'use client';

import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { canBrowserPlayVideoMime, isVideoMime } from '@/utils/isVideoMime';
import { AnimatedBackgroundImageContainer } from './AnimatedBackgroundImage.styles';

export interface AnimatedBackgroundImageProps {
  src?: string | null;
  mime?: string | null;
  sx?: SxProps<Theme>;
}

interface AnimatedBackgroundVideoProps {
  src: string;
  mime: string;
  onPlaybackUnavailable: () => void;
}

const AnimatedBackgroundVideo = ({
  src,
  mime,
  onPlaybackUnavailable,
}: AnimatedBackgroundVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!canBrowserPlayVideoMime(mime)) {
      onPlaybackUnavailable();
      return;
    }

    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = true;

    const handlePlaybackFailure = () => {
      onPlaybackUnavailable();
    };

    const playVideo = () => {
      void video.play().catch(handlePlaybackFailure);
    };

    video.addEventListener('error', handlePlaybackFailure);

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      playVideo();
    } else {
      video.addEventListener('loadeddata', playVideo);
    }

    return () => {
      video.removeEventListener('error', handlePlaybackFailure);
      video.removeEventListener('loadeddata', playVideo);
    };
  }, [mime, onPlaybackUnavailable, src]);

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
  const [isVideoPlaybackUnavailable, setIsVideoPlaybackUnavailable] =
    useState(false);

  const videoBackground =
    src && mime && isVideoMime(mime) && !isVideoPlaybackUnavailable
      ? { src, mime }
      : null;

  useEffect(() => {
    setIsVideoPlaybackUnavailable(false);
  }, [mime, src]);

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
          {videoBackground ? (
            <AnimatedBackgroundVideo
              src={videoBackground.src}
              mime={videoBackground.mime}
              onPlaybackUnavailable={() => setIsVideoPlaybackUnavailable(true)}
            />
          ) : !isVideoMime(mime) ? (
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
          ) : null}
        </AnimatedBackgroundImageContainer>
      )}
    </AnimatePresence>
  );
};
