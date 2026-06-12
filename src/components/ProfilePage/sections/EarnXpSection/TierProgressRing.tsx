import type { FC } from 'react';
import { Tooltip } from '@/components/core/Tooltip/Tooltip';
import { ProgressRing } from '@/components/core/ProgressRing/ProgressRing';

interface TierProgressRingProps {
  // 0..1 fill of the ring.
  progress: number;
  // Tooltip explaining what is needed to reach the next tier.
  label: string;
}

export const TierProgressRing: FC<TierProgressRingProps> = ({
  progress,
  label,
}) => (
  <Tooltip title={label} arrow placement="top">
    <ProgressRing
      progress={progress}
      sx={(theme) => ({
        color: (theme.vars || theme).palette.statusSuccessFg,
      })}
    />
  </Tooltip>
);
