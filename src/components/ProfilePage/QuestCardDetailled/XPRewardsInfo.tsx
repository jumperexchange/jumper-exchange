import { Tooltip } from '@mui/material';
import type { PropsWithChildren } from 'react';
import { XPIcon } from 'src/components/illustrations/XPIcon';
import { XPDisplayBox, XPDisplayBoxLabel } from '../QuestCard/QuestCard.style';

interface XPRewardsInfoProps {
  bgColor?: string;
  points: string;
  tooltip?: string;
  active?: boolean;
  completed?: boolean;
}

export const XPRewardsInfo: React.FC<PropsWithChildren<XPRewardsInfoProps>> = ({
  bgColor,
  points,
  tooltip,
  active,
  children,
  completed,
}) => {
  return (
    <Tooltip title={tooltip} placement="top" enterTouchDelay={0} arrow>
      <XPDisplayBox
        active={active}
        completed={completed}
        bgcolor={bgColor}
        gap={0.5}
        sx={{ ...(tooltip && { cursor: 'help' }) }}
      >
        <XPDisplayBoxLabel variant="bodySmallStrong" completed={completed}>
          {points}
        </XPDisplayBoxLabel>
        {children ? (
          children
        ) : (
          <XPIcon size={20} variant={completed ? 'completed' : 'secondary'} />
        )}
      </XPDisplayBox>
    </Tooltip>
  );
};
