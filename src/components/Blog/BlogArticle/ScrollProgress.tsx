import { useTheme } from '@mui/material/styles';
import type { UseScrollOptions } from 'motion/react';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import type { FC, PropsWithChildren } from 'react';
import { useRef } from 'react';

type OffsetPoint = NonNullable<UseScrollOptions['offset']>[number];

interface ScrollProgressProps extends PropsWithChildren {
  topOffset?: OffsetPoint;
  showProgress?: boolean;
  onScroll?: (value: number) => void;
}

export const ScrollProgress: FC<ScrollProgressProps> = ({
  children,
  topOffset,
  showProgress,
  onScroll,
}) => {
  const theme = useTheme();
  const contentRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: [topOffset ?? 'start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    onScroll?.(latest);
  });

  return (
    <div ref={contentRef}>
      {showProgress && (
        <motion.div
          style={{
            scaleX: scrollYProgress,
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: theme.spacing(1.25),
            originX: 0,
            background: (theme.vars || theme).palette.primary.main,
            zIndex: 1000,
          }}
        />
      )}
      {children}
    </div>
  );
};
