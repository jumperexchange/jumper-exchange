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
import { useRef, useState } from 'react';

type OffsetPoint = NonNullable<UseScrollOptions['offset']>[number];

interface ScrollProgressProps extends PropsWithChildren {
  topOffset?: OffsetPoint;
  showProgress?: boolean;
  onScroll?: (value: number) => void;
  targetRef?: RefObject<HTMLElement | null>;
}

export const ScrollProgress: FC<ScrollProgressProps> = ({
  children,
  topOffset,
  showProgress,
  onScroll,
  targetRef,
}) => {
  const theme = useTheme();
  const contentRef = useRef<HTMLElement>(null);

  // Represents the pixel gap from contentRef's bottom to targetRef's bottom
  const [dockedBottom, setDockedBottom] = useState<number | string>(0);
  const [isDocked, setIsDocked] = useState(false);

  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: [topOffset ?? 'start start', 'end end'],
  });

  const { scrollY } = useScroll();

  const progress = useTransform(scrollYProgress, (v) =>
    Math.min(1, Math.max(0, v)),
  );

  // Tracks the bar's bottom offset relative to the viewport
  const fixedBottom = useTransform(scrollY, () => {
    if (typeof window === 'undefined') {
      return 0;
    }
    const bottom = targetRef?.current?.getBoundingClientRect().bottom ?? 0;
    const height = window.innerHeight ?? 0;
    return Math.max(0, height - bottom);
  });

  useMotionValueEvent(progress, 'change', (p) => {
    onScroll?.(p);
    if (p >= 1 && !isDocked) {
      if (contentRef.current && targetRef?.current) {
        const contentBottom = contentRef.current.getBoundingClientRect().bottom;
        const targetBottom = targetRef.current.getBoundingClientRect().bottom;
        setDockedBottom(contentBottom - targetBottom);
      }
      setIsDocked(true);
    } else if (p < 0.995 && isDocked) {
      setIsDocked(false);
    }
  });

  const barHeight = theme.spacing(1.25);
  const barColor = (theme.vars || theme).palette.primary.main;

  return (
    <Box ref={contentRef} sx={{ position: 'relative' }}>
      {showProgress && (
        <motion.div
          style={{
            scaleX: isDocked ? 1 : progress,
            position: isDocked ? 'absolute' : 'fixed',
            bottom: isDocked ? dockedBottom : fixedBottom,
            left: isDocked ? '50%' : 0,
            marginLeft: isDocked ? '-50vw' : 0,
            right: isDocked ? undefined : 0,
            width: isDocked ? '100vw' : undefined,
            height: barHeight,
            originX: 0,
            background: barColor,
            zIndex: 1000,
            pointerEvents: 'none',
          }}
        />
      )}
      {children}
    </Box>
  );
};
