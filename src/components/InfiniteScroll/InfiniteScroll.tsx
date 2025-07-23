'use client';

import { FC, PropsWithChildren, ReactNode, useRef } from 'react';
import { useIntersectionObserver } from 'src/hooks/useIntersectionObserver';

interface InfiniteScrollProps extends PropsWithChildren {
  hasMore?: boolean;
  loader: ReactNode;
  isLoading: boolean;
  loadMore: () => void;
  triggerMargin?: number;
}

/**
 * If we'll need to cover more complex use cases, we should switch to useVirtualizer from @tanstack/react-virtual
 */
export const InfiniteScroll: FC<InfiniteScrollProps> = ({
  children,
  hasMore,
  loadMore,
  isLoading,
  loader,
  triggerMargin = 100,
}) => {
  const observerRef = useRef<HTMLDivElement>(null);

  useIntersectionObserver(observerRef, {
    onIntersect: loadMore,
    enabled: hasMore && !isLoading,
    rootMargin: triggerMargin,
  });

  return (
    <>
      {children}
      {hasMore && (
        <div
          ref={observerRef}
          style={{
            width: 1,
            height: 1,
            overflow: 'hidden',
            opacity: 0,
            position: 'absolute',
            bottom: 0,
            left: 0,
            pointerEvents: 'none',
          }}
        />
      )}
      {isLoading && loader}
    </>
  );
};
