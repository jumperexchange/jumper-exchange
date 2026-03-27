'use client';

import type { BlogArticleData, StrapiResponseData } from '@/types/strapi';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { animate, useMotionValue } from 'motion/react';
import { CARD_GAP, FALLBACK_SLOT, NAV_SPRING } from './BlogCarousel.style';

const FLING_VELOCITY_THRESHOLD_PX = 300;
/** Horizontal movement past this (from pointer down) before cards lose pointer events — avoids breaking clicks. */
const POINTER_DRAG_THRESHOLD_PX = 8;

type PointerSession = {
  active: boolean;
  pointerId: number;
  lastClientX: number;
  pointerDownClientX: number;
  motionIndexAtPointerDown: number;
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
  const [isDragging, setIsDragging] = useState(false);
  const carouselSessionActiveRef = useRef(false);
  const dragThresholdMetRef = useRef(false);
  const pointerCaptureHeldRef = useRef(false);
  const windowPointerCleanupRef = useRef<(() => void) | null>(null);
  const pointerSession = useRef<PointerSession>({
    active: false,
    pointerId: -1,
    lastClientX: 0,
    pointerDownClientX: 0,
    motionIndexAtPointerDown: 0,
    lastMoveTime: 0,
    lastVelocityX: 0,
  });

  useEffect(() => {
    return () => {
      windowPointerCleanupRef.current?.();
      windowPointerCleanupRef.current = null;
    };
  }, []);

  const finalizeDrag = useCallback(
    (
      ev: PointerEvent | ReactPointerEvent<HTMLDivElement>,
      row: HTMLDivElement,
    ) => {
      windowPointerCleanupRef.current?.();
      windowPointerCleanupRef.current = null;

      setIsDragging(false);
      carouselSessionActiveRef.current = false;
      dragThresholdMetRef.current = false;

      if (!pointerSession.current.active) {
        return;
      }
      if (ev.pointerId !== pointerSession.current.pointerId) {
        return;
      }

      pointerSession.current.active = false;

      if (pointerCaptureHeldRef.current) {
        try {
          row.releasePointerCapture(ev.pointerId);
        } catch {
          // already released
        }
        pointerCaptureHeldRef.current = false;
      }

      const current = motionIndex.get();
      const vx = pointerSession.current.lastVelocityX;
      const snapped = getSnapIndexFromFling(current, vx);
      setActiveIndex(snapped);
      animate(motionIndex, snapped, NAV_SPRING);
    },
    [motionIndex],
  );

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!dragEnabled) {
        return;
      }
      dragThresholdMetRef.current = false;
      pointerCaptureHeldRef.current = false;
      isAnimating.current = false;
      carouselSessionActiveRef.current = true;
      const row = e.currentTarget;
      pointerSession.current = {
        active: true,
        pointerId: e.pointerId,
        lastClientX: e.clientX,
        pointerDownClientX: e.clientX,
        motionIndexAtPointerDown: motionIndex.get(),
        lastMoveTime: performance.now(),
        lastVelocityX: 0,
      };

      const onWindowPointerEnd = (ev: PointerEvent) => {
        if (
          !pointerSession.current.active ||
          ev.pointerId !== pointerSession.current.pointerId
        ) {
          return;
        }
        finalizeDrag(ev, row);
      };
      window.addEventListener('pointerup', onWindowPointerEnd);
      window.addEventListener('pointercancel', onWindowPointerEnd);
      windowPointerCleanupRef.current = () => {
        window.removeEventListener('pointerup', onWindowPointerEnd);
        window.removeEventListener('pointercancel', onWindowPointerEnd);
      };
    },
    [dragEnabled, finalizeDrag, motionIndex],
  );

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!pointerSession.current.active) {
        return;
      }

      if (!dragThresholdMetRef.current) {
        const movedFromStart = Math.abs(
          e.clientX - pointerSession.current.pointerDownClientX,
        );
        if (movedFromStart < POINTER_DRAG_THRESHOLD_PX) {
          return;
        }
        dragThresholdMetRef.current = true;
        setIsDragging(true);
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
          pointerCaptureHeldRef.current = true;
        } catch {
          pointerCaptureHeldRef.current = false;
        }
        const now = performance.now();
        const slot = cardSlot.get();
        const totalDx = e.clientX - pointerSession.current.pointerDownClientX;
        const mi0 = pointerSession.current.motionIndexAtPointerDown;
        const next = mi0 - totalDx / slot;
        pointerSession.current.lastClientX = e.clientX;
        pointerSession.current.lastMoveTime = now;
        pointerSession.current.lastVelocityX = 0;
        motionIndex.set(next);
        setActiveIndex(Math.round(next));
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
      finalizeDrag(e, e.currentTarget);
    },
    [finalizeDrag],
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
    isDragging,
    carouselSessionActiveRef,
    handleNext,
    handlePointerCancel: endPointerDrag,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp: endPointerDrag,
    handlePrev,
    scrollToIndex,
  };
};
