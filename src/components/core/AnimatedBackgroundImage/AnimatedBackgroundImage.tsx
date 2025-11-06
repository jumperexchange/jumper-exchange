import { AnimatePresence } from 'framer-motion';
import { AnimatedBackgroundImageContainer } from './AnimatedBackgroundImage.styles';
import Image from 'next/image';

export interface AnimatedBackgroundImageProps {
  src?: string | null;
}

export const AnimatedBackgroundImage = ({
  src,
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
        >
          <Image
            src={src}
            alt="Animated background image"
            fill
            priority
            sizes="100vw"
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        </AnimatedBackgroundImageContainer>
      )}
    </AnimatePresence>
  );
};
