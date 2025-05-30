import { Tooltip } from '@mui/material';
import type { PropsWithChildren } from 'react';
import { XPIcon } from 'src/components/illustrations/XPIcon';
import { XPDisplayBox, XPDisplayBoxLabel } from './QuestCard.style';

interface XPRewardsInfoProps {
  label: string;
  tooltip?: string;
  variant: 'apy' | 'xp' | 'completed' | 'variableWeeklyAPY';
}

export const XPRewardsInfo: React.FC<PropsWithChildren<XPRewardsInfoProps>> = ({
  label,
  tooltip,
  children,
  variant,
}) => {
  return (
    <Tooltip title={tooltip} placement="top" enterTouchDelay={0} arrow>
      <XPDisplayBox variant={variant}>
        <XPDisplayBoxLabel variant="bodySmallStrong">{label}</XPDisplayBoxLabel>
        {children ? children : <XPIcon color={'inherit'} />}
      </XPDisplayBox>
    </Tooltip>
  );
};
