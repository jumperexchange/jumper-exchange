import { useEffect } from 'react';

type UseIntersectionObserverOptions = {
  root?: Element | null;
  rootMargin?: number;
  threshold?: number | number[];
  onIntersect: () => void;
  enabled?: boolean;
};

export function useIntersectionObserver(
  targetRef: React.RefObject<Element | null>,
  {
    root = null,
    rootMargin = 0,
    threshold = 0.1,
    onIntersect,
    enabled = true,
  }: UseIntersectionObserverOptions,
) {
  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          onIntersect();
        }
      },
      {
        root,
        rootMargin: `${rootMargin}px`,
        threshold,
      },
    );

    const target = targetRef.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
      observer.disconnect();
    };
  }, [targetRef, root, rootMargin, threshold, onIntersect, enabled]);
}
