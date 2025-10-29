import { FC, ReactNode } from 'react';
import {
  BadgeSize,
  BadgeVariant,
  StyledBadge,
  StyledBadgeLabel,
  StyledBadgeProps,
} from './Badge.styles';

export interface BadgeProps extends StyledBadgeProps {
  startIcon?: React.ReactElement;
  endIcon?: React.ReactElement;
  label?: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  'data-testid'?: string;
}

export const Badge: FC<BadgeProps> = ({
  label,
  startIcon,
  endIcon,
  variant = BadgeVariant.Default,
  size = BadgeSize.SM,
  onClick,
  'data-testid': dataTestId,
  ...rest
}) => {
  return (
    <StyledBadge
      className="badge-container"
      variant={variant}
      size={size}
      onClick={variant !== 'disabled' ? onClick : undefined}
      {...rest}
    >
      {startIcon && <>{startIcon}</>}
      {label && <StyledBadgeLabel data-testid={dataTestId}>{label}</StyledBadgeLabel>}
      {endIcon && <>{endIcon}</>}
    </StyledBadge>
  );
};
