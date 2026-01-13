import { Tooltip } from '@/components/core/Tooltip/Tooltip';
import type { ComponentType, FC } from 'react';
import { StyledIconButtonAlphaDark } from '../DeFiPositionCard.styles';
import { ICON_STYLES } from '../constants';
import type { SxProps, Theme } from '@mui/material/styles';

interface DeFiPositionOverviewButtonProps {
  tooltip: string;
  onClick: () => void;
  slots: {
    icon: ComponentType<{ sx?: SxProps<Theme> }>;
  };
}

export const DeFiPositionOverviewButton: FC<
  DeFiPositionOverviewButtonProps
> = ({ tooltip, onClick, slots }) => {
  const Icon = slots.icon;
  return (
    <Tooltip title={tooltip}>
      <StyledIconButtonAlphaDark size="small" onClick={onClick}>
        <Icon sx={ICON_STYLES} />
      </StyledIconButtonAlphaDark>
    </Tooltip>
  );
};
