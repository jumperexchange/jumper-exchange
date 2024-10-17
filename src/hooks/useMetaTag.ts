import { useRef, useSyncExternalStore } from 'react';

export function useMetaTag(metaName: string) {
  const metaElementRef = useRef<HTMLMetaElement | null>(null);

  const getSnapshot = () => {
    if (typeof window === 'undefined') {
      return null;
    }
    const metaElement = document.querySelector(`meta[name="${metaName}"]`);
    metaElementRef.current = metaElement as HTMLMetaElement | null;
    const content = metaElement?.getAttribute('content');
    return content;
  };

  const subscribe = (callback: () => void) => {
    if (typeof window === 'undefined') {
      return () => {};
    }

    let attributeObserver: MutationObserver | null = null;

    const observeMetaTag = () => {
      const metaElement = document.querySelector(`meta[name="${metaName}"]`);
      metaElementRef.current = metaElement as HTMLMetaElement | null;

      if (metaElement && !attributeObserver) {
        attributeObserver = new MutationObserver(() => {
          callback();
        });

        attributeObserver.observe(metaElement, {
          attributes: true,
          attributeFilter: ['content'],
        });
      }
    };

    const parentNode = document.head || document;
    const parentObserver = new MutationObserver((mutations) => {
      let shouldUpdate = false;

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (
            node.nodeType === Node.ELEMENT_NODE &&
            (node as Element).matches(`meta[name="${metaName}"]`)
          ) {
            observeMetaTag();
            shouldUpdate = true;
          }
        });

        mutation.removedNodes.forEach((node) => {
          if (
            node.nodeType === Node.ELEMENT_NODE &&
            (node as Element).matches(`meta[name="${metaName}"]`)
          ) {
            if (attributeObserver) {
              attributeObserver.disconnect();
              attributeObserver = null;
            }
            shouldUpdate = true;
          }
        });
      });

      if (shouldUpdate) {
        callback();
      }
    });

    parentObserver.observe(parentNode, {
      childList: true,
      subtree: true,
    });

    observeMetaTag();
    return () => {
      if (attributeObserver) {
        attributeObserver.disconnect();
      }
      parentObserver.disconnect();
    };
  };

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
