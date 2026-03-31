import { useLayoutEffect, useRef, useState } from 'react';
import { useHeaderHeight } from './useHeaderHeight';

const LAYOUT_STABILIZE_MS = 500;

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
  scrollOffsetPx?: number,
): string | undefined => {
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const rafId = useRef(0);
  const headerHeight = useHeaderHeight();
  const offset = scrollOffsetPx ?? headerHeight;

  useLayoutEffect(() => {
    if (sectionIds.length === 0) {
      setActiveId(undefined);
      return;
    }

    const hash = window.location.hash.slice(1);
    let observer: ResizeObserver | undefined;
    let stabilizeTimer = 0;

    if (hash && sectionIds.includes(hash)) {
      setActiveId((prev) => (prev === hash ? prev : hash));

      const section = document.getElementById(hash);
      if (section) {
        const tryAlign = () => {
          const scrollMarginTop =
            parseFloat(getComputedStyle(section).scrollMarginTop) || offset;
          const { top } = section.getBoundingClientRect();
          if (top < 0 || top > scrollMarginTop) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        };

        tryAlign();

        // Re-align whenever the document layout shifts (images/fonts loading).
        // Disconnects once the layout has been stable for LAYOUT_STABILIZE_MS.
        observer = new ResizeObserver(() => {
          tryAlign();
          clearTimeout(stabilizeTimer);
          stabilizeTimer = window.setTimeout(
            () => observer?.disconnect(),
            LAYOUT_STABILIZE_MS,
          );
        });

        observer.observe(document.body);

        // Start the timer immediately so the observer disconnects even if no
        // resize or layout-shift fires during the initial load.
        stabilizeTimer = window.setTimeout(
          () => observer?.disconnect(),
          LAYOUT_STABILIZE_MS,
        );
      }
    } else {
      const initial = computeActiveId(sectionIds, offset);
      setActiveId((prev) => (prev === initial ? prev : initial));
    }

    const scheduleUpdate = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const next = computeActiveId(sectionIds, offset);
        setActiveId((prev) => (prev === next ? prev : next));
      });
    };

    const listenerOptions = { passive: true };
    window.addEventListener('scroll', scheduleUpdate, listenerOptions);
    window.addEventListener('resize', scheduleUpdate, listenerOptions);

    return () => {
      cancelAnimationFrame(rafId.current);
      clearTimeout(stabilizeTimer);
      observer?.disconnect();
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, [sectionIds, offset]);

  return activeId;
};
