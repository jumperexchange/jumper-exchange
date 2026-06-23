import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import type { FC } from 'react';

interface ProgressRingProps extends BoxProps {
  // 0..1 fill of the ring.
  progress: number;
  // Diameter in px.
  size?: number;
  thickness?: number;
}

/**
 * Circular progress ring on a faint track. The arc is drawn with
 * `currentColor`, so theme it by setting `color` on the ring (via sx) or
 * letting it cascade from a parent.
 */
export const ProgressRing: FC<ProgressRingProps> = ({
  progress,
  size = 24,
  thickness = 5,
  sx,
  ...boxProps
}) => (
  <Box
    sx={[
      { position: 'relative', display: 'inline-flex', flexShrink: 0 },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
    {...boxProps}
  >
    <CircularProgress
      variant="determinate"
      value={100}
      size={size}
      thickness={thickness}
      sx={(theme) => ({
        color: (theme.vars || theme).palette.alpha200.main,
      })}
    />
    <CircularProgress
      variant="determinate"
      value={Math.round(Math.min(Math.max(progress, 0), 1) * 100)}
      size={size}
      thickness={thickness}
      sx={{
        color: 'currentColor',
        position: 'absolute',
        left: 0,
      }}
    />
  </Box>
);
