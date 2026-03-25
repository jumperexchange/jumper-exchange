'use client';

import type { BlogArticleData, StrapiResponseData } from '@/types/strapi';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { animate, useMotionValue } from 'motion/react';
import { CARD_GAP, FALLBACK_SLOT, NAV_SPRING } from './BlogCarousel.style';

const FLING_VELOCITY_THRESHOLD_PX = 300;

type PointerSession = {
  active: boolean;
  lastClientX: number;
  lastMoveTime: number;
  lastVelocityX: number;
};

const getSnapIndexFromFling = (current: number, velocityX: number): number => {
  if (velocityX > FLING_VELOCITY_THRESHOLD_PX) {
    return Math.floor(current);
  }
  if (velocityX < -FLING_VELOCITY_THRESHOLD_PX) {
    return Math.ceil(current);
  }
  return Math.round(current);
};

export const useCarouselMeasure = (
  data: StrapiResponseData<BlogArticleData> | undefined,
) => {
  const firstCardRef = useRef<HTMLDivElement>(null);
  const cardSlot = useMotionValue(FALLBACK_SLOT);
  const [containerHeight, setContainerHeight] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    const el = firstCardRef.current;
    if (!el) {
      return;
    }
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0) {
        cardSlot.set(width + CARD_GAP);
      }
      if (height > 0) {
        setContainerHeight(height);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [cardSlot, data]);

  return { firstCardRef, cardSlot, containerHeight };
};

export const useCarouselDrag = (
  motionIndex: ReturnType<typeof useMotionValue<number>>,
  cardSlot: ReturnType<typeof useMotionValue<number>>,
  total: number,
  dragEnabled: boolean,
) => {
  const isAnimating = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const pointerSession = useRef<PointerSession>({
    active: false,
    lastClientX: 0,
    lastMoveTime: 0,
    lastVelocityX: 0,
  });

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!dragEnabled) {
        return;
      }
      e.currentTarget.setPointerCapture(e.pointerId);
      pointerSession.current = {
        active: true,
        lastClientX: e.clientX,
        lastMoveTime: performance.now(),
        lastVelocityX: 0,
      };
    },
    [dragEnabled],
  );

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!pointerSession.current.active) {
        return;
      }
      const now = performance.now();
      const dx = e.clientX - pointerSession.current.lastClientX;
      const dt = now - pointerSession.current.lastMoveTime;
      if (dt > 0) {
        pointerSession.current.lastVelocityX = (dx / dt) * 1000;
      }
      pointerSession.current.lastClientX = e.clientX;
      pointerSession.current.lastMoveTime = now;

      const next = motionIndex.get() - dx / cardSlot.get();
      motionIndex.set(next);
      setActiveIndex(Math.round(next));
    },
    [motionIndex, cardSlot],
  );

  const endPointerDrag = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!pointerSession.current.active) {
        return;
      }
      pointerSession.current.active = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // already released
      }
      const current = motionIndex.get();
      const vx = pointerSession.current.lastVelocityX;
      const snapped = getSnapIndexFromFling(current, vx);
      setActiveIndex(snapped);
      animate(motionIndex, snapped, NAV_SPRING);
    },
    [motionIndex],
  );

  const scrollToIndex = useCallback(
    (next: number) => {
      if (isAnimating.current) {
        return;
      }
      isAnimating.current = true;
      setActiveIndex(next);
      animate(motionIndex, next, {
        ...NAV_SPRING,
        onComplete: () => {
          isAnimating.current = false;
        },
      });
    },
    [motionIndex],
  );

  const handleNext = useCallback(() => {
    scrollToIndex(activeIndex + 1);
  }, [scrollToIndex, activeIndex]);

  const handlePrev = useCallback(() => {
    scrollToIndex(activeIndex - 1);
  }, [scrollToIndex, activeIndex]);

  const displayIndex =
    total === 0 ? 0 : ((activeIndex % total) + total) % total;

  return {
    displayIndex,
    handleNext,
    handlePointerCancel: endPointerDrag,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp: endPointerDrag,
    handlePrev,
    scrollToIndex,
  };
};
