'use client';

import { motion } from 'motion/react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

const Track = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
});

const Dot = styled(motion.div, {
  shouldForwardProp: (p) => p !== 'isActive',
})<{ isActive: boolean }>(({ theme, isActive }) => ({
  height: '6px',
  borderRadius: '6px',
  width: isActive ? '40px' : '6px',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: `${(theme.vars || theme).palette.alpha300.main}`,
  transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
}));

const Fill = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  borderRadius: 'inherit',
  backgroundColor: (theme.vars || theme).palette.accent1.main,
  transformOrigin: 'left',
}));

interface BlogCarouselPaginationProps {
  total: number;
  activeIndex: number;
}

export const BlogCarouselPagination = ({
  total,
  activeIndex,
}: BlogCarouselPaginationProps) => {
  return (
    <Track role="tablist" aria-label="Carousel pagination">
      {Array.from({ length: total }).map((_, i) => (
        <Dot
          key={i}
          isActive={i === activeIndex}
          layout
          role="tab"
          aria-selected={i === activeIndex}
          aria-label={`Slide ${i + 1} of ${total}`}
        >
          {i === activeIndex && (
            <Fill style={{ width: '100%', transformOrigin: 'left' }} />
          )}
        </Dot>
      ))}
    </Track>
  );
};
