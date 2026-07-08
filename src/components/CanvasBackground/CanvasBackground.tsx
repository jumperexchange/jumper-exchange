'use client';

import { getCanvasBackgroundRegistration } from '@/components/CanvasBackground/canvasBackgroundRegistry';
import type { CanvasBackgroundHandle } from '@/components/CanvasBackground/types';
import { Box } from '@mui/material';
import { useEffect, useMemo, useRef } from 'react';

export interface CanvasBackgroundProps {
  id: string;
  options: Record<string, unknown>;
}

const getStructuralOptionsKey = (
  id: string,
  options: Record<string, unknown>,
): string => {
  const registration = getCanvasBackgroundRegistration(id);
  if (!registration) {
    return id;
  }

  const structuralValues = Object.fromEntries(
    registration.structuralOptionKeys.map((key) => [key, options[key]]),
  );

  return `${id}:${JSON.stringify(structuralValues)}`;
};

export const CanvasBackground = ({ id, options }: CanvasBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<CanvasBackgroundHandle | null>(null);
  const structuralKey = useMemo(
    () => getStructuralOptionsKey(id, options),
    [id, options],
  );
  const bgColor = typeof options.bg === 'string' ? options.bg : '#120B1E';

  useEffect(() => {
    const canvas = canvasRef.current;
    const registration = getCanvasBackgroundRegistration(id);
    if (!canvas || !registration) {
      return;
    }

    let cancelled = false;

    const boot = async () => {
      const init = await registration.loadInit();
      if (cancelled) {
        return;
      }

      handleRef.current?.dispose();
      handleRef.current = init(canvas, options);
    };

    const ric = typeof window !== 'undefined' && window.requestIdleCallback;
    const handle = ric
      ? window.requestIdleCallback(
          () => {
            void boot();
          },
          { timeout: 1500 },
        )
      : window.setTimeout(() => {
          void boot();
        }, 200);

    return () => {
      cancelled = true;
      if (ric && window.cancelIdleCallback) {
        window.cancelIdleCallback(handle as number);
      } else {
        window.clearTimeout(handle as number);
      }
      handleRef.current?.dispose();
      handleRef.current = null;
    };
  }, [id, structuralKey]);

  useEffect(() => {
    handleRef.current?.set(options);
  }, [options]);

  return (
    <Box
      component="canvas"
      ref={canvasRef}
      aria-hidden="true"
      sx={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        zIndex: 0,
        pointerEvents: 'none',
        background: bgColor,
      }}
    />
  );
};
