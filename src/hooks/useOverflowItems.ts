import { useRef, useState, useLayoutEffect, useCallback } from 'react';
import { debounce } from 'lodash';

interface UseOverflowItemsOptions {
  /** Total number of items to manage */
  itemCount: number;
  /** Gap between items in pixels (default: 8) */
  gap?: number;
  /** Approximate width of the overflow indicator (e.g., "+N" chip) in pixels (default: 60) */
  overflowIndicatorWidth?: number;
  /** Whether to enable overflow detection (default: true) */
  enabled?: boolean;
}

interface UseOverflowItemsReturn {
  /** Reference to attach to the container element */
  containerRef: React.RefObject<HTMLDivElement>;
  /** Function to get ref for each item */
  getItemRef: (index: number) => (el: HTMLDivElement | null) => void;
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
 *
 * @example
 * const { containerRef, getItemRef, visibleCount, hiddenCount, isReady } = useOverflowItems({
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
 *     {hiddenCount > 0 && <div>+{hiddenCount}</div>}
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
  const [visibleCount, setVisibleCount] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Function to get ref for each item
  const getItemRef = (index: number) => (el: HTMLDivElement | null) => {
    itemRefs.current[index] = el;
  };

  const calculateVisibleItems = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerWidth = container.offsetWidth;
    let totalWidth = 0;
    let visible = 0;

    for (let i = 0; i < itemRefs.current.length; i++) {
      const item = itemRefs.current[i];
      if (!item) continue;

      const itemWidth = item.offsetWidth;

      // If itemWidth is 0, measurement isn't ready yet
      if (itemWidth === 0) continue;

      const isLastItem = i === itemCount - 1;
      const requiredSpace = totalWidth + itemWidth + (isLastItem ? 0 : gap);

      // Check if we need space for the overflow indicator
      const needsOverflowIndicator = i < itemCount - 1;
      const spaceWithOverflow =
        requiredSpace +
        (needsOverflowIndicator ? gap + overflowIndicatorWidth : 0);

      if (spaceWithOverflow <= containerWidth) {
        totalWidth = requiredSpace;
        visible = i + 1;
      } else {
        break;
      }
    }

    // Only update if the count has changed to avoid unnecessary re-renders
    setVisibleCount((prev) => {
      if (prev !== visible && (visible > 0 || itemCount === 0)) {
        return visible;
      }
      return prev;
    });

    // Mark as ready after first calculation
    setIsReady(true);
  }, [itemCount, gap, overflowIndicatorWidth]);

  // Debounced version for resize events
  const debouncedCalculate = useCallback(debounce(calculateVisibleItems, 100), [
    calculateVisibleItems,
  ]);

  useLayoutEffect(() => {
    if (!enabled || !containerRef.current || itemCount === 0) {
      setIsReady(true);
      return;
    }

    // Initial calculation
    calculateVisibleItems();

    // Observe container size changes
    const resizeObserver = new ResizeObserver(debouncedCalculate);
    resizeObserver.observe(containerRef.current);

    return () => {
      debouncedCalculate.cancel();
      resizeObserver.disconnect();
    };
  }, [itemCount, enabled, calculateVisibleItems, debouncedCalculate]);

  const hiddenCount =
    visibleCount !== null && visibleCount < itemCount
      ? itemCount - visibleCount
      : 0;

  return {
    containerRef,
    getItemRef,
    visibleCount,
    hiddenCount,
    isReady,
  };
};
