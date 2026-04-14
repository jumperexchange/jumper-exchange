import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import type { UseScrollOptions } from 'motion/react';
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'motion/react';
import type { FC, PropsWithChildren, RefObject } from 'react';

type OffsetPoint = NonNullable<UseScrollOptions['offset']>[number];

interface ScrollProgressProps extends PropsWithChildren {
  topOffset?: OffsetPoint;
  showProgress?: boolean;
  onScroll?: (value: number) => void;
  progressRef: RefObject<HTMLElement | null>;
}

export const ScrollProgress: FC<ScrollProgressProps> = ({
  children,
  topOffset,
  showProgress,
  onScroll,
  progressRef,
}) => {
  const theme = useTheme();

  const barHeight = theme.spacing(1.25);
  const barColor = (theme.vars || theme).palette.primary.main;

  const { scrollYProgress } = useScroll({
    target: progressRef,
    offset: [topOffset ?? 'start start', 'end end'],
  });

  const progress = useTransform(scrollYProgress, (v) =>
    Math.min(1, Math.max(0, v)),
  );

  useMotionValueEvent(progress, 'change', (p) => {
    onScroll?.(p);
  });

  return (
    <Box>
      {children}
      {showProgress && (
        <motion.div
          style={{
            scaleX: progress,
            position: 'sticky',
            bottom: 0,
            left: 0,
            right: 0,
            height: barHeight,
            marginTop: `-${barHeight}`,
            originX: 0,
            background: barColor,
            zIndex: 1000,
            pointerEvents: 'none',
          }}
        />
      )}
    </Box>
  );
};
