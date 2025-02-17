import { Tooltip } from '@mui/material';
import type { PropsWithChildren } from 'react';
import { XPIcon } from 'src/components/illustrations/XPIcon';
import { XPDisplayBox, XPDisplayBoxLabel } from './QuestCard.style';

interface XPRewardsInfoProps {
  bgColor?: string;
  points: string;
  tooltip?: string;
  active?: boolean;
  completed?: boolean;
  color?: string;
}

export const XPRewardsInfo: React.FC<PropsWithChildren<XPRewardsInfoProps>> = ({
  bgColor,
  points,
  tooltip,
  active,
  children,
  completed,
  color,
}) => {
  return (
    <Tooltip title={tooltip} placement="top" enterTouchDelay={0} arrow>
      <XPDisplayBox
        active={active}
        completed={completed}
        bgcolor={bgColor}
        sx={{ ...(tooltip && { cursor: 'help' }) }}
      >
        <XPDisplayBoxLabel variant="bodySmallStrong">
          {points}
        </XPDisplayBoxLabel>
        {children ? children : <XPIcon color={color} />}
      </XPDisplayBox>
    </Tooltip>
  );
};
