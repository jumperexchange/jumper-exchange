import { PopperProps } from '@mui/material/Popper';
import Tooltip from '@mui/material/Tooltip';
import { FC, ReactNode } from 'react';
import { Badge } from 'src/components/Badge/Badge';
import { BadgeVariant, BadgeSize } from 'src/components/Badge/Badge.styles';

interface TooltipBadgeProps {
  title: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  startIcon?: React.ReactElement;
  endIcon?: React.ReactElement;
  label?: ReactNode;
  placement?: PopperProps['placement'];
}

export const ListItemTooltipBadge: FC<TooltipBadgeProps> = ({
  title,
  variant = BadgeVariant.Default,
  size = BadgeSize.MD,
  startIcon,
  endIcon,
  label,
  placement = 'top',
}) => {
  return (
    <Tooltip title={title} placement={placement} enterTouchDelay={0} arrow>
      <Badge
        variant={variant}
        size={size}
        startIcon={startIcon}
        endIcon={endIcon}
        label={label}
        sx={{ pointerEvents: 'auto' }}
      />
    </Tooltip>
  );
};
