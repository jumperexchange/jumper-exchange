import { useCallback, useEffect, useRef, useState } from 'react';

export const MIN_SCALE = 1;
export const MAX_SCALE = 4;
const ZOOM_STEP = 0.25;

const clampScale = (next: number) =>
  Math.min(MAX_SCALE, Math.max(MIN_SCALE, next));

const getTouchDistance = (touches: React.TouchList) => {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

export const useLightbox = () => {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const offsetAtDragStart = useRef({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const lastTouchDistance = useRef<number | null>(null);
  const scaleAtTouchStart = useRef(1);

  const resetState = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const handleClose = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    resetState();
    setOpen(false);
  }, [resetState]);

  const handleOpen = useCallback(() => setOpen(true), []);

  const zoomIn = useCallback(() => {
    setScale((s) => clampScale(s + ZOOM_STEP));
    setOffset({ x: 0, y: 0 });
  }, []);

  const zoomOut = useCallback(() => {
    setScale((s) => clampScale(s - ZOOM_STEP));
    setOffset({ x: 0, y: 0 });
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
    setScale((s) => clampScale(s + delta));
    setOffset({ x: 0, y: 0 });
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (scale <= MIN_SCALE) {
        return;
      }
      isDragging.current = true;
      dragStart.current = { x: e.clientX, y: e.clientY };
      offsetAtDragStart.current = offset;
    },
    [scale, offset],
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) {
      return;
    }
    setOffset({
      x: offsetAtDragStart.current.x + (e.clientX - dragStart.current.x),
      y: offsetAtDragStart.current.y + (e.clientY - dragStart.current.y),
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        lastTouchDistance.current = getTouchDistance(e.touches);
        scaleAtTouchStart.current = scale;
      } else if (e.touches.length === 1 && scale > MIN_SCALE) {
        isDragging.current = true;
        dragStart.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
        offsetAtDragStart.current = offset;
      }
    },
    [scale, offset],
  );

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 2 && lastTouchDistance.current !== null) {
      const ratio = getTouchDistance(e.touches) / lastTouchDistance.current;
      setScale(clampScale(scaleAtTouchStart.current * ratio));
      setOffset({ x: 0, y: 0 });
    } else if (e.touches.length === 1 && isDragging.current) {
      setOffset({
        x:
          offsetAtDragStart.current.x +
          (e.touches[0].clientX - dragStart.current.x),
        y:
          offsetAtDragStart.current.y +
          (e.touches[0].clientY - dragStart.current.y),
      });
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      lastTouchDistance.current = null;
    }
    if (e.touches.length === 0) {
      isDragging.current = false;
    }
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const el = containerRef.current;
    if (!el) {
      return;
    }
    if (!document.fullscreenElement) {
      await el.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
      if (e.key === '+' || e.key === '=') {
        zoomIn();
      }
      if (e.key === '-') {
        zoomOut();
      }
      if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, handleClose, toggleFullscreen, zoomIn, zoomOut]);

  const supportsFullscreen =
    typeof document !== 'undefined' &&
    !!document.documentElement.requestFullscreen;

  return {
    open,
    scale,
    offset,
    isFullscreen,
    supportsFullscreen,
    containerRef,
    isDragging,
    handleOpen,
    handleClose,
    zoomIn,
    zoomOut,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    toggleFullscreen,
  };
};
