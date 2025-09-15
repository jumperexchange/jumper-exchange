import { LineCustomSvgLayerProps, LineSeries } from '@nivo/line';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface CustomFollowingPointLayerProps<T extends LineSeries>
  extends LineCustomSvgLayerProps<T> {
  customPointColor?: string;
}

export const CustomFollowingPointLayer = <T extends LineSeries>({
  customPointColor,
  currentSlice,
}: CustomFollowingPointLayerProps<T>) => {
  const [lastPosition, setLastPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (!currentSlice) return;
    setLastPosition({
      x: currentSlice.points[0]?.x ?? 0,
      y: currentSlice.points[0]?.y ?? 0,
    });
  }, [currentSlice]);

  return (
    <g style={{ pointerEvents: 'none' }}>
      <motion.circle
        r={4}
        fill={customPointColor}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: currentSlice ? 1 : 0,
          scale: currentSlice ? 1 : 0,
          x: currentSlice?.points[0]?.x ?? lastPosition.x,
          y: currentSlice?.points[0]?.y ?? lastPosition.y,
        }}
        transition={{
          opacity: { duration: 0.15, ease: 'easeInOut' },
          scale: { duration: 0.15, ease: 'easeInOut' },
          x: { type: 'tween', duration: 0.08, ease: 'easeOut' },
          y: { type: 'tween', duration: 0.08, ease: 'easeOut' },
        }}
        style={{ pointerEvents: 'none' }}
      />
    </g>
  );
};
