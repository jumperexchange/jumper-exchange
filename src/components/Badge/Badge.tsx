import { FC, ReactNode } from 'react';
import {
  BadgeSize,
  BadgeVariant,
  StyledBadge,
  StyledBadgeLabel,
} from './Badge.styles';

export interface BadgeProps {
  startIcon?: React.ReactElement;
  endIcon?: React.ReactElement;
  label: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

export const Badge: FC<BadgeProps> = ({
  label,
  startIcon,
  endIcon,
  variant = BadgeVariant.Default,
  size = BadgeSize.SM,
  onClick,
}) => {
  return (
    <StyledBadge
      className="badge-container"
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
