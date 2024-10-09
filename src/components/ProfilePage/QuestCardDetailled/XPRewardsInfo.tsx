import { Tooltip, Typography } from '@mui/material';
import type { PropsWithChildren } from 'react';
import { XPDisplayBox } from './QuestCard.style';

interface XPRewardsInfoProps {
  bgColor: string;
  label: string;
  tooltip?: string;
  active?: boolean;
}

export const XPRewardsInfo: React.FC<PropsWithChildren<XPRewardsInfoProps>> = ({
  bgColor,
  label,
  tooltip,
  active,
  children,
}) => {
  return (
    <Tooltip title={tooltip} placement="top" enterTouchDelay={0} arrow>
      <XPDisplayBox
        active={active}
        bgcolor={bgColor}
        gap={0.5}
        sx={{ ...(tooltip && { cursor: 'help' }) }}
      >
        <Typography
          fontSize="14px"
          fontWeight={700}
          lineHeight="18px"
          color={'#ffffff'}
        >
          {label}
        </Typography>
        {children}
      </XPDisplayBox>
    </Tooltip>
  );
};
