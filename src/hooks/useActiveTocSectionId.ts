import { useLayoutEffect, useRef, useState } from 'react';

const DEFAULT_SCROLL_OFFSET_PX = 120;

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
  const [activeId, setActiveId] = useState<string | undefined>(sectionIds[0]);
  const rafId = useRef(0);

  useLayoutEffect(() => {
    if (sectionIds.length === 0) {
      setActiveId(undefined);
      return;
    }

    const scheduleUpdate = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const next = computeActiveId(sectionIds, scrollOffsetPx);
        setActiveId((prev) => (prev === next ? prev : next));
      });
    };

    scheduleUpdate();

    const listenerOptions = { passive: true };
    window.addEventListener('scroll', scheduleUpdate, listenerOptions);
    window.addEventListener('resize', scheduleUpdate, listenerOptions);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, [sectionIds, scrollOffsetPx]);

  return activeId;
};
