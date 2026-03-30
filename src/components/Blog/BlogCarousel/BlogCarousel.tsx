'use client';

import type { BlogArticleData, StrapiResponseData } from '@/types/strapi';
import { BlogArticleCardSkeleton } from '../BlogArticleCard/BlogArticleCardSkeleton';
import { useState, useEffect, useRef } from 'react';
import { useMotionValue, animate, useInView } from 'motion/react';
import { Box, Typography } from '@mui/material';
import { IconButton } from '@/components/core/buttons/IconButton/IconButton';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { BlogCarouselAnimatedCard } from './BlogCarouselAnimatedCard';
import { BlogCarouselPagination } from './BlogCarouselPagination';
import { useCarouselDrag, useCarouselMeasure } from './hooks';
import {
  BlogCarouselContainer,
  CarouselViewport,
  DraggableRow,
  CARD_GAP,
  SPREAD_SPRING,
  FALLBACK_CARD_HEIGHT,
} from './BlogCarousel.style';

interface BlogCarouselProps {
  title?: string;
  data: StrapiResponseData<BlogArticleData> | undefined;
}

export const BlogCarousel = ({ data, title }: BlogCarouselProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);

  const motionIndex = useMotionValue(0);
  const spreadMotion = useMotionValue(0);

  const { firstCardRef, cardSlot, containerHeight } = useCarouselMeasure(data);

  const total = data?.length ?? 0;

  const isInView = useInView(sectionRef, {
    amount: 0.5,
    margin: `${FALLBACK_CARD_HEIGHT / 2}px 100px 0px 0px`,
    once: false,
  });

  const isSpread = isHovered || isInView;

  const {
    displayIndex,
    isDragging,
    carouselSessionActiveRef,
    handlePointerCancel,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleNext,
    handlePrev,
  } = useCarouselDrag(motionIndex, cardSlot, total, isSpread);

  useEffect(() => {
    animate(spreadMotion, isSpread ? 1 : 0, SPREAD_SPRING);
  }, [isSpread, spreadMotion]);

  if (!data) {
    return (
      <BlogCarouselContainer>
        <Box sx={{ display: 'flex', gap: `${CARD_GAP}px`, flexWrap: 'wrap' }}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <BlogArticleCardSkeleton key={idx} />
          ))}
        </Box>
      </BlogCarouselContainer>
    );
  }

  return (
    <BlogCarouselContainer
      ref={sectionRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
        <Typography variant="bodyXLargeStrong">{title}</Typography>

        <Box sx={{ ml: 'auto', display: isSpread ? 'flex' : 'none', gap: 1 }}>
          <IconButton onClick={handlePrev} aria-label="Previous slide">
            <ArrowBackRoundedIcon />
          </IconButton>

          <BlogCarouselPagination total={total} activeIndex={displayIndex} />

          <IconButton onClick={handleNext} aria-label="Next slide">
            <ArrowForwardRoundedIcon />
          </IconButton>
        </Box>
      </Box>

      <CarouselViewport>
        <Box
          sx={{
            position: 'relative',
            height: containerHeight ?? FALLBACK_CARD_HEIGHT,
          }}
        >
          <DraggableRow
            onDragStart={(e) => e.preventDefault()}
            onPointerCancel={handlePointerCancel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              left: 0,
              top: 0,
              cursor: isSpread ? 'grab' : 'default',
              touchAction: isSpread ? 'pan-y' : 'auto',
            }}
          >
            {data.map((article, index) => (
              <BlogCarouselAnimatedCard
                key={article.id}
                article={article}
                index={index}
                motionIndex={motionIndex}
                spreadMotion={spreadMotion}
                cardSlot={cardSlot}
                total={total}
                isSpread={isSpread}
                isDragging={isDragging}
                carouselSessionActiveRef={carouselSessionActiveRef}
                measureRef={index === 0 ? firstCardRef : undefined}
              />
            ))}
          </DraggableRow>
        </Box>
      </CarouselViewport>
    </BlogCarouselContainer>
  );
};
