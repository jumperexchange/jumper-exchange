import { useMemo } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import type { Theme, SxProps } from '@mui/material/styles';
import { useOverflowItems } from '@/hooks/useOverflowItems';
import { calculateAssetPercentage, calculateTotalValueUSD } from './utils';
import {
  MAX_DISPLAY_ASSETS_COUNT,
  MAX_DISPLAY_ASSETS_COUNT_MOBILE,
} from './constants';

interface OverflowInfo {
  count: number;
  price: number;
  percentage: number;
}

interface UseAssetOverflowOptions<
  T extends { totalValueUSD: number; percentageOfTotalValueUSD: number },
> {
  items: T[];
  gap?: number;
  overallTotalValueUSD: number;
}

interface UseAssetOverflowReturn {
  containerRef: React.RefObject<HTMLDivElement>;
  getItemRef: (index: number) => (el: HTMLDivElement | null) => void;
  overflowIndicatorRef: React.RefObject<HTMLDivElement>;
  isReady: boolean;
  overflowInfo: OverflowInfo | null;
  isItemVisible: (index: number) => boolean;
  getItemSx: (index: number) => SxProps<Theme>;
}

export const useAssetOverflow = <
  T extends { totalValueUSD: number; percentageOfTotalValueUSD: number },
>({
  items,
  overallTotalValueUSD,
  gap = 8,
}: UseAssetOverflowOptions<T>): UseAssetOverflowReturn => {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm'),
  );
  const maxDisplayCount = isMobile
    ? MAX_DISPLAY_ASSETS_COUNT_MOBILE
    : MAX_DISPLAY_ASSETS_COUNT;

  const {
    containerRef,
    getItemRef,
    overflowIndicatorRef,
    visibleCount,
    isReady,
  } = useOverflowItems({
    itemCount: items.length,
    gap,
  });

  const effectiveVisibleCount = useMemo(() => {
    if (visibleCount === null) {
      return null;
    }
    return Math.min(visibleCount, maxDisplayCount);
  }, [visibleCount, maxDisplayCount]);

  const overflowInfo = useMemo(() => {
    if (effectiveVisibleCount === null) {
      return null;
    }
    const effectiveHiddenCount = items.length - effectiveVisibleCount;
    if (effectiveHiddenCount <= 0) {
      return null;
    }
    const hiddenItems = items.slice(effectiveVisibleCount);
    const overflowPrice = calculateTotalValueUSD(hiddenItems);
    const overflowPercentage = calculateAssetPercentage(hiddenItems);
    return {
      count: effectiveHiddenCount,
      price: overflowPrice,
      percentage: overflowPercentage,
    };
  }, [items, effectiveVisibleCount]);

  const isItemVisible = (index: number): boolean => {
    return effectiveVisibleCount === null || index < effectiveVisibleCount;
  };

  const getItemSx = (index: number): SxProps<Theme> => {
    const isVisible = isItemVisible(index);
    return {
      visibility: isVisible ? 'visible' : 'hidden',
      position: isVisible ? 'relative' : 'absolute',
      pointerEvents: isVisible ? 'auto' : 'none',
    };
  };

  return {
    containerRef,
    getItemRef,
    overflowIndicatorRef,
    isReady,
    overflowInfo,
    isItemVisible,
    getItemSx,
  };
};
