import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { isVideoMime } from '@/utils/isVideoMime';
import { AnimatedBackgroundImageContainer } from './AnimatedBackgroundImage.styles';

export interface AnimatedBackgroundImageProps {
  src?: string | null;
  mime?: string | null;
  sx?: SxProps<Theme>;
}

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
            <Box
              component="video"
              src={src}
              autoPlay
              loop
              playsInline
              aria-hidden
              sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
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
