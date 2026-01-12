import { useRef, useState, useLayoutEffect, useCallback } from 'react';
import { debounce } from 'lodash';

interface UseOverflowItemsOptions {
  /** Total number of items to manage */
  itemCount: number;
  /** Gap between items in pixels (default: 8) */
  gap?: number;
  /** Fallback width of the overflow indicator if not measured dynamically (default: 60) */
  overflowIndicatorWidth?: number;
  /** Whether to enable overflow detection (default: true) */
  enabled?: boolean;
}

interface UseOverflowItemsReturn {
  /** Reference to attach to the container element */
  containerRef: React.RefObject<HTMLDivElement>;
  /** Function to get ref for each item */
  getItemRef: (index: number) => (el: HTMLDivElement | null) => void;
  /** Reference to attach to the overflow indicator element for dynamic width measurement */
  overflowIndicatorRef: React.RefObject<HTMLDivElement>;
  /** Number of items that can be displayed */
  visibleCount: number | null;
  /** Number of items that are hidden */
  hiddenCount: number;
  /** Whether the calculation is complete and items are ready to display */
  isReady: boolean;
}

/**
 * Custom hook to detect and manage overflowing items in a container.
 * Automatically calculates how many items can fit and provides count of hidden items.
 * Supports dynamic overflow indicator width measurement.
 *
 * @example
 * const { containerRef, getItemRef, overflowIndicatorRef, visibleCount, hiddenCount, isReady } = useOverflowItems({
 *   itemCount: rewards.length,
 *   gap: 8,
 * });
 *
 * return (
 *   <div ref={containerRef} style={{ opacity: isReady ? 1 : 0 }}>
 *     {rewards.map((reward, index) => (
 *       <div
 *         key={reward.id}
 *         ref={getItemRef(index)}
 *         style={{ display: visibleCount === null || index < visibleCount ? 'flex' : 'none' }}
 *       >
 *         {reward.content}
 *       </div>
 *     ))}
 *     {hiddenCount > 0 && <div ref={overflowIndicatorRef}>+{hiddenCount}</div>}
 *   </div>
 * );
 */
export const useOverflowItems = ({
  itemCount,
  gap = 8,
  overflowIndicatorWidth = 60,
  enabled = true,
}: UseOverflowItemsOptions): UseOverflowItemsReturn => {
  const containerRef = useRef<HTMLDivElement>(null!);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const itemWidths = useRef<number[]>([]);
  const overflowIndicatorRef = useRef<HTMLDivElement>(null!);
  const indicatorWidthRef = useRef<number>(overflowIndicatorWidth);
  const lastContainerWidthRef = useRef<number>(0);
  const hasCalculatedRef = useRef(false);
  const [visibleCount, setVisibleCount] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);

  const getItemRef = (index: number) => (el: HTMLDivElement | null) => {
    itemRefs.current[index] = el;
    if (el) {
      const width = el.offsetWidth;
      if (width > 0) {
        itemWidths.current[index] = width;
      }
    }
  };

  const calculateVisibleItems = useCallback(
    (forceRecalculate = false) => {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      const containerWidth = container.offsetWidth;

      if (
        !forceRecalculate &&
        lastContainerWidthRef.current === containerWidth &&
        hasCalculatedRef.current
      ) {
        return;
      }

      lastContainerWidthRef.current = containerWidth;
      hasCalculatedRef.current = true;

      for (let i = 0; i < itemRefs.current.length; i++) {
        const item = itemRefs.current[i];
        if (item) {
          const width = item.offsetWidth;
          if (width > 0) {
            itemWidths.current[i] = width;
          }
        }
      }

      const indicatorEl = overflowIndicatorRef.current;
      if (indicatorEl) {
        const width = indicatorEl.offsetWidth;
        if (width > 0) {
          indicatorWidthRef.current = width;
        }
      }

      let totalWidth = 0;
      let visible = 0;

      const indicatorWidth = indicatorWidthRef.current;

      for (let i = 0; i < itemCount; i++) {
        const itemWidth = itemWidths.current[i];

        if (!itemWidth || itemWidth === 0) {
          continue;
        }

        const isLastItem = i === itemCount - 1;
        const requiredSpace = totalWidth + itemWidth + (isLastItem ? 0 : gap);

        const needsOverflowIndicator = i < itemCount - 1;
        const spaceWithOverflow =
          requiredSpace + (needsOverflowIndicator ? gap + indicatorWidth : 0);

        if (spaceWithOverflow <= containerWidth) {
          totalWidth = requiredSpace;
          visible = i + 1;
        } else {
          break;
        }
      }

      setVisibleCount((prev) => {
        if (prev !== visible && (visible > 0 || itemCount === 0)) {
          return visible;
        }
        return prev;
      });

      setIsReady(true);
    },
    [itemCount, gap],
  );

  const debouncedCalculateRef = useRef(
    debounce(() => calculateVisibleItems(false), 100),
  );

  useLayoutEffect(() => {
    debouncedCalculateRef.current = debounce(
      () => calculateVisibleItems(false),
      100,
    );
  }, [calculateVisibleItems]);

  useLayoutEffect(() => {
    if (!enabled || !containerRef.current || itemCount === 0) {
      setIsReady(true);
      return;
    }

    hasCalculatedRef.current = false;
    calculateVisibleItems(true);

    const handleResize = () => {
      debouncedCalculateRef.current();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    return () => {
      debouncedCalculateRef.current.cancel();
      resizeObserver.disconnect();
    };
  }, [itemCount, enabled, calculateVisibleItems]);

  const hiddenCount =
    visibleCount !== null && visibleCount < itemCount
      ? itemCount - visibleCount
      : 0;

  return {
    containerRef,
    getItemRef,
    overflowIndicatorRef,
    visibleCount,
    hiddenCount,
    isReady,
  };
};
