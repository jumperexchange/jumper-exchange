import { useMemo } from 'react';

export const useIsTouchEnabled = (): boolean => {
  const touchEnabled = useMemo(() => {
    let result = false;
    if (window.PointerEvent && 'maxTouchPoints' in navigator) {
      // if Pointer Events are supported, just check maxTouchPoints
      if (navigator.maxTouchPoints > 0) {
        result = true;
      }
    } else {
      // no Pointer Events...
      if (
        window.matchMedia &&
        window.matchMedia('(any-pointer:coarse)').matches
      ) {
        // check for any-pointer:coarse which mostly means touchscreen
        result = true;
      } else if (window.TouchEvent || 'ontouchstart' in window) {
        // last resort - check for exposed touch events API / event handler
        result = true;
      }
    }
    return result;
  }, []);
  return touchEnabled;
};
