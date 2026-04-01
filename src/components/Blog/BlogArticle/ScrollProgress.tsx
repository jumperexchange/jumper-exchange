import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import type { UseScrollOptions } from 'motion/react';
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'motion/react';
import type { FC, PropsWithChildren } from 'react';
import { useRef, useState } from 'react';

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
  const [isDockedAtContentEnd, setIsDockedAtContentEnd] = useState(false);

  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: [topOffset ?? 'start start', 'end end'],
  });

  const clampedProgress = useTransform(scrollYProgress, (v) =>
    Math.min(1, Math.max(0, v)),
  );

  useMotionValueEvent(clampedProgress, 'change', (p) => {
    onScroll?.(p);
    if (p >= 1) {
      setIsDockedAtContentEnd(true);
    } else if (p < 0.995) {
      setIsDockedAtContentEnd(false);
    }
  });

  const barColor = (theme.vars || theme).palette.primary.main;
  const barHeight = theme.spacing(1.25);

  return (
    <Box ref={contentRef} sx={{ position: 'relative' }}>
      {showProgress &&
        (isDockedAtContentEnd ? (
          <Box
            sx={(theme) => ({
              position: 'absolute',
              bottom: theme.spacing(-7),
              left: '50%',
              width: '100vw',
              marginLeft: '-50vw',
              height: barHeight,
              zIndex: 1,
              pointerEvents: 'none',
            })}
          >
            <motion.div
              style={{
                scaleX: 1,
                height: '100%',
                width: '100%',
                originX: 0,
                background: barColor,
              }}
            />
          </Box>
        ) : (
          <motion.div
            style={{
              scaleX: clampedProgress,
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              height: barHeight,
              originX: 0,
              background: barColor,
              zIndex: 1000,
            }}
          />
        ))}
      {children}
    </Box>
  );
};
