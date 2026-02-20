import { useMemo } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import type { Theme, SxProps } from '@mui/material/styles';
import { useOverflowItems } from 'src/hooks/useOverflowItems';
import { calcPercentage } from '@/providers/PortfolioProvider/utils';
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
  T extends { amountUSD?: number; totalUsd?: number },
> {
  items: T[];
  gap?: number;
}

interface UseAssetOverflowReturn {
  containerRef: React.RefObject<HTMLDivElement>;
  getItemRef: (index: number) => (el: HTMLDivElement | null) => void;
  overflowIndicatorRef: React.RefObject<HTMLDivElement>;
  isReady: boolean;
  totalPrice: number;
  overflowInfo: OverflowInfo | null;
  isItemVisible: (index: number) => boolean;
  getItemSx: (index: number) => SxProps<Theme>;
}

const getItemUsd = <T extends { amountUSD?: number; totalUsd?: number }>(
  item: T,
): number => item.amountUSD ?? item.totalUsd ?? 0;

export const useAssetOverflow = <
  T extends { amountUSD?: number; totalUsd?: number },
>({
  items,
  gap = 8,
}: UseAssetOverflowOptions<T>): UseAssetOverflowReturn => {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm'),
  );
  const maxDisplayCount = isMobile
    ? MAX_DISPLAY_ASSETS_COUNT_MOBILE
    : MAX_DISPLAY_ASSETS_COUNT;

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + getItemUsd(item), 0),
    [items],
  );

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
    const overflowPrice = hiddenItems.reduce(
      (sum, item) => sum + getItemUsd(item),
      0,
    );
    return {
      count: effectiveHiddenCount,
      price: overflowPrice,
      percentage: calcPercentage(overflowPrice, totalPrice),
    };
  }, [items, effectiveVisibleCount, totalPrice]);

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
    totalPrice,
    overflowInfo,
    isItemVisible,
    getItemSx,
  };
};
