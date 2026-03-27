'use client';

import type { BlogArticleData, StrapiResponseData } from '@/types/strapi';
import { TrackingCategory } from '@/const/trackingKeys';
import { BlogArticleCard } from '../BlogArticleCard/BlogArticleCard';
import { useRef } from 'react';
import { Box } from '@mui/material';
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useMotionValueEvent,
  animate,
} from 'motion/react';
import { STACK_PEEK_PX } from './BlogCarousel.style';

export const wrapRelativeIndex = (raw: number, total: number) => {
  const half = total / 2;
  return (((raw % total) + total + half) % total) - half;
};

export const getConveyorX = (
  index: number,
  mi: number,
  slot: number,
  total: number,
) => {
  const totalWidth = total * slot;
  const raw = (index - mi) * slot;
  return ((((raw + slot) % totalWidth) + totalWidth) % totalWidth) - slot;
};

interface BlogCarouselAnimatedCardProps {
  article: StrapiResponseData<BlogArticleData>[number];
  index: number;
  motionIndex: ReturnType<typeof useMotionValue<number>>;
  spreadMotion: ReturnType<typeof useMotionValue<number>>;
  cardSlot: ReturnType<typeof useMotionValue<number>>;
  total: number;
  isSpread: boolean;
  isDragging: boolean;
  carouselSessionActiveRef: React.MutableRefObject<boolean>;
  measureRef?: React.RefObject<HTMLDivElement | null>;
}

export const BlogCarouselAnimatedCard = ({
  article,
  index,
  motionIndex,
  spreadMotion,
  cardSlot,
  total,
  isSpread,
  isDragging,
  carouselSessionActiveRef,
  measureRef,
}: BlogCarouselAnimatedCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const ref = measureRef ?? cardRef;

  const prevConveyorX = useRef(
    getConveyorX(index, motionIndex.get(), cardSlot.get(), total),
  );
  const teleportOpacity = useMotionValue(1);

  useMotionValueEvent(motionIndex, 'change', (latest) => {
    const slot = cardSlot.get();
    const newX = getConveyorX(index, latest, slot, total);
    if (Math.abs(newX - prevConveyorX.current) > total * slot * 0.4) {
      teleportOpacity.set(0);
      animate(teleportOpacity, 1, { duration: 0.15, delay: 0.03 });
    }
    prevConveyorX.current = newX;
  });

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 120, damping: 20 });
  const springY = useSpring(rawY, { stiffness: 120, damping: 20 });
  const tiltX = useTransform(springY, [-0.5, 0.5], [6, -6]);
  const tiltY = useTransform(springX, [-0.5, 0.5], [-6, 6]);
  const imgX = useTransform(springX, [-0.5, 0.5], [-8, 8]);
  const imgY = useTransform(springY, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSpread || carouselSessionActiveRef.current) {
      return;
    }
    const rect = (
      ref as React.RefObject<HTMLDivElement>
    ).current?.getBoundingClientRect();
    if (!rect) {
      return;
    }
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const x = useTransform(
    [motionIndex, spreadMotion, cardSlot],
    (inputs: number[]) => {
      const [mi, sp, slot] = inputs as [number, number, number];
      return (
        sp * getConveyorX(index, mi, slot, total) +
        (1 - sp) * wrapRelativeIndex(index - mi, total) * STACK_PEEK_PX
      );
    },
  );

  const scale = useTransform(
    [motionIndex, spreadMotion],
    (inputs: number[]) => {
      const [mi, sp] = inputs as [number, number];
      const absRel = Math.abs(wrapRelativeIndex(index - mi, total));
      return sp + (1 - sp) * (1 - absRel * 0.05);
    },
  );

  const baseOpacity = useTransform(
    [motionIndex, spreadMotion],
    (inputs: number[]): number => {
      const [mi, sp] = inputs as [number, number];
      if (sp > 0.5) {
        return 1;
      }
      const absRel = Math.abs(wrapRelativeIndex(index - mi, total));
      return absRel < 0.5 ? 1 : 0.55;
    },
  );

  const opacity = useTransform(
    [baseOpacity, teleportOpacity],
    (inputs: number[]) => {
      const [base, tp] = inputs as [number, number];
      return base * tp;
    },
  );

  const zIndex = useTransform(
    motionIndex,
    (mi) => total - Math.round(Math.abs(wrapRelativeIndex(index - mi, total))),
  );

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (carouselSessionActiveRef.current) {
      e.preventDefault();
    }
  };

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x,
        scale,
        opacity,
        zIndex,
        rotateX: tiltX,
        rotateY: tiltY,
        transformPerspective: 800,
        position: 'absolute',
        left: 0,
        top: 0,
        width: 'max-content',
        pointerEvents: !isSpread || isDragging ? 'none' : 'auto',
      }}
    >
      <Box
        component="div"
        onDragStart={handleDragStart}
        sx={{ width: 'max-content' }}
      >
        <motion.div style={{ x: imgX, y: imgY }}>
          <BlogArticleCard
            article={article}
            trackingCategory={TrackingCategory.BlogCarousel}
          />
        </motion.div>
      </Box>
    </motion.div>
  );
};
