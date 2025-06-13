import { FC } from 'react';
import { StyledBadge, StyledBadgeLabel } from './Badge.styled';

export interface BadgeProps {
  startIcon?: React.ReactElement;
  endIcon?: React.ReactElement;
  label: string;
}

export const Badge: FC<BadgeProps> = ({ label, startIcon, endIcon }) => {
  return (
    <StyledBadge>
      {startIcon && <>{startIcon}</>}
      <StyledBadgeLabel>{label}</StyledBadgeLabel>
      {endIcon && <>{endIcon}</>}
    </StyledBadge>
  );
};
