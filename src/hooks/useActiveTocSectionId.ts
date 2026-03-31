import { useLayoutEffect, useRef, useState } from 'react';
import { useHeaderHeight } from './useHeaderHeight';

const DEFAULT_SCROLL_OFFSET_PX = 120;
const HEADER_SCROLL_OFFSET_PX = 10;
const LAYOUT_STABILIZE_MS = 100;

const computeActiveId = (
  sectionIds: readonly string[],
  scrollOffsetPx: number,
): string => {
  let active = sectionIds[0];
  for (const id of sectionIds) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= scrollOffsetPx) {
      active = id;
    }
  }
  return active;
};

export const useActiveTocSectionId = (
  sectionIds: readonly string[],
  scrollOffsetPx: number = DEFAULT_SCROLL_OFFSET_PX,
): string | undefined => {
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const rafId = useRef(0);
  const alignmentIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const didAlignRef = useRef(false);
  const headerHeightPx = useHeaderHeight();

  useLayoutEffect(() => {
    if (sectionIds.length === 0) {
      setActiveId(undefined);
      return;
    }

    const hash = window.location.hash.slice(1);

    if (hash && sectionIds.includes(hash) && !didAlignRef.current) {
      setActiveId((prev) => (prev === hash ? prev : hash));

      const section = document.getElementById(hash);
      if (section) {
        const tryAlign = () => {
          const { top } = section.getBoundingClientRect();
          if (
            top < HEADER_SCROLL_OFFSET_PX ||
            top > headerHeightPx + HEADER_SCROLL_OFFSET_PX
          ) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
          }

          didAlignRef.current = true;
          if (alignmentIntervalRef.current) {
            clearInterval(alignmentIntervalRef.current);
          }
        };

        tryAlign();
        alignmentIntervalRef.current = setInterval(
          tryAlign,
          LAYOUT_STABILIZE_MS,
        );
      }
    } else {
      const initial = computeActiveId(sectionIds, scrollOffsetPx);
      setActiveId((prev) => (prev === initial ? prev : initial));
    }

    const scheduleUpdate = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const next = computeActiveId(sectionIds, scrollOffsetPx);
        setActiveId((prev) => (prev === next ? prev : next));
      });
    };

    const listenerOptions = { passive: true };
    window.addEventListener('scroll', scheduleUpdate, listenerOptions);
    window.addEventListener('resize', scheduleUpdate, listenerOptions);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (alignmentIntervalRef.current) {
        clearInterval(alignmentIntervalRef.current);
      }
    };
  }, [sectionIds, headerHeightPx, scrollOffsetPx]);

  return activeId;
};
