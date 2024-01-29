import type { MouseEventHandler, TouchEvent } from 'react';
import { useRef, useState } from 'react';
import { useIsTouchEnabled } from '.';

interface SwipeInput {
  onSwipedLeft: () => void;
  onSwipedRight: () => void;
  onSwipe?: (input: SwipeDirection) => void;
  onClick?: () => void;
}

interface SwipeDirection {
  isLeftSwipe: boolean;
  isRightSwipe: boolean;
}

interface SwipeListener extends SwipeDirection {
  distance: number;
  activeTouch: boolean;
}

interface SwipeHandlers {
  onTouchStart: (e: TouchEvent) => void;
  onTouchMove: (e: TouchEvent) => void;
  onClick: MouseEventHandler<HTMLDivElement>;
  onTouchEnd: () => void;
  onMouseDown: MouseEventHandler<HTMLDivElement>;
  onMouseMove: MouseEventHandler<HTMLDivElement>;
  onMouseUp: () => void;
  onMouseLeave: () => void;
}

export interface SwipeOutput {
  swipeHandlers: SwipeHandlers;
  swipeListener: SwipeListener;
}
export const useSwipe = (input: SwipeInput): SwipeOutput => {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [activeTouch, setActiveTouch] = useState(false);
  const touchEnabled = useIsTouchEnabled();
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const minSwipeDistance = 50;
  const distance = touchStart - touchEnd;
  const isLeftSwipe = distance > minSwipeDistance;
  const isRightSwipe = distance < -minSwipeDistance;

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX); // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX);
    setActiveTouch(true);
    console.log('touch start', e.targetTouches[0].clientX);
  };

  const onMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
    timeoutId.current = setTimeout(() => {
      setActiveTouch(true);
    }, 100);
    setTouchStart(e.clientX);
    input.onSwipe && input.onSwipe({ isLeftSwipe, isRightSwipe });
    setTouchEnd(e.clientX);
    console.log('MOUSEDOWN', {
      touchStart: touchStart,
      clientX: e.clientX,
      touchEnd: touchEnd,
    });
  };

  const onTouchMove = (e: TouchEvent) => {
    if (activeTouch) {
      setTouchEnd(e.targetTouches[0].clientX);
      input.onSwipe && input.onSwipe({ isLeftSwipe, isRightSwipe });
    }
  };

  const onMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    if (activeTouch) {
      setTouchEnd(e.clientX);
      input.onSwipe && input.onSwipe({ isLeftSwipe, isRightSwipe });
    }
  };

  const touchEndHelper = () => {
    if (!touchStart || !touchEnd) {
      return;
    }
    if (isLeftSwipe) {
      input.onSwipedLeft();
    }
    if (isRightSwipe) {
      input.onSwipedRight();
    }
  };

  const onMouseUp = () => {
    !activeTouch && typeof input.onClick === 'function' && input.onClick();
    setActiveTouch(false);
    return touchEndHelper();
  };

  const onMouseLeave = () => {
    setActiveTouch(false);
  };

  const onTouchEnd = () => {
    setActiveTouch(false);
    return touchEndHelper();
  };

  const onClick = () =>
    typeof input.onClick === 'function' &&
    !activeTouch &&
    touchEnabled &&
    input.onClick();

  return {
    swipeHandlers: {
      onClick,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onMouseUp,
      onMouseDown,
      onMouseMove,
      onMouseLeave,
    },
    swipeListener: { isLeftSwipe, isRightSwipe, distance, activeTouch },
  };
};
