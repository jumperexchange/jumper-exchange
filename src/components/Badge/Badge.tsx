import { FC } from 'react';
import {
  BadgeSize,
  BadgeVariant,
  StyledBadge,
  StyledBadgeLabel,
} from './Badge.styles';

export interface BadgeProps {
  startIcon?: React.ReactElement;
  endIcon?: React.ReactElement;
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  onClick?: () => void;
}

export const Badge: FC<BadgeProps> = ({
  label,
  startIcon,
  endIcon,
  variant,
  size,
  onClick,
}) => {
  return (
    <StyledBadge
      variant={variant}
      size={size}
      onClick={variant !== 'disabled' ? onClick : undefined}
    >
      {startIcon && <>{startIcon}</>}
      <StyledBadgeLabel>{label}</StyledBadgeLabel>
      {endIcon && <>{endIcon}</>}
    </StyledBadge>
  );
};
