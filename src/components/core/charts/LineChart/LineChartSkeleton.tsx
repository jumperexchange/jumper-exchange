import { area, curveCardinal } from 'd3-shape';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

export interface LineChartSkeletonProps {
  height?: number;
  width?: number | string;
}

export const LineChartSkeleton = ({
  height = 400,
  width = '100%',
}: LineChartSkeletonProps) => {
  const theme = useTheme();

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(400);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const mockData = [
    { x: 0, y: 15 },
    { x: 1, y: 30 },
    { x: 2, y: 25 },
    { x: 3, y: 40 },
    { x: 4, y: 60 },
    { x: 5, y: 45 },
    { x: 6, y: 40 },
    { x: 7, y: 50 },
    { x: 8, y: 40 },
    { x: 9, y: 70 },
    { x: 10, y: 70 },
    { x: 11, y: 70 },
    { x: 12, y: 55 },
  ];

  const xScale = (value: number) => (value / mockData.length) * containerWidth;
  const yScale = (value: number) => height - 40 - (value / 100) * (height - 80);

  const generator = area<any>()
    .x((d: any) => xScale(d.x) as number)
    .y0(height - 20)
    .y1((d: any) => yScale(d.y) as number)
    .curve(curveCardinal);

  return (
    <Box ref={containerRef} sx={{ height, width, position: 'relative' }}>
      <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
        <g>
          <path
            d={generator(mockData) || ''}
            fill={(theme.vars || theme).palette.surface2.main}
          />
          <path
            d={generator(mockData) || ''}
            fill="rgba(255,255,255,0.3)"
            style={{
              animation: 'skeleton-pulse 2s ease-in-out infinite',
            }}
          />
        </g>
        <style jsx>{`
          @keyframes skeleton-pulse {
            0%,
            100% {
              opacity: 0.6;
            }
            50% {
              opacity: 0.3;
            }
          }
        `}</style>
      </svg>
    </Box>
  );
};
