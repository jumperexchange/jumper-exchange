import { AnimatePresence } from 'motion/react';
import { AnimatedBackgroundImageContainer } from './AnimatedBackgroundImage.styles';
import Image from 'next/image';
import type { SxProps, Theme } from '@mui/material/styles';

export interface AnimatedBackgroundImageProps {
  src?: string | null;
  sx?: SxProps<Theme>;
}

export const AnimatedBackgroundImage = ({
  src,
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
        </AnimatedBackgroundImageContainer>
      )}
    </AnimatePresence>
  );
};
