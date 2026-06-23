import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import type { FC } from 'react';
import { Tooltip } from '@/components/core/Tooltip/Tooltip';

interface TierProgressRingProps {
  // 0..1 fill of the ring.
  progress: number;
  // Tooltip explaining what is needed to reach the next tier.
  label: string;
}

const RING_SIZE = 24;
const RING_THICKNESS = 5;

export const TierProgressRing: FC<TierProgressRingProps> = ({
  progress,
  label,
}) => (
  <Tooltip title={label} arrow placement="top">
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        flexShrink: 0,
      }}
    >
      <CircularProgress
        variant="determinate"
        value={100}
        size={RING_SIZE}
        thickness={RING_THICKNESS}
        sx={(theme) => ({
          color: (theme.vars || theme).palette.alpha200.main,
        })}
      />
      <CircularProgress
        variant="determinate"
        value={Math.round(progress * 100)}
        size={RING_SIZE}
        thickness={RING_THICKNESS}
        sx={(theme) => ({
          color: (theme.vars || theme).palette.statusSuccessFg,
          position: 'absolute',
          left: 0,
        })}
      />
    </Box>
  </Tooltip>
);
