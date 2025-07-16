import { SxProps, Theme } from '@mui/material/styles';
import React from 'react';
import { HorizontalTabItem } from './HorizontalTabs';
import { HorizontalTabSize, StyledHorizontalTab } from './HorizontalTabs.style';

interface HorizontalTabProps extends HorizontalTabItem {
  size: HorizontalTabSize;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  sx?: SxProps<Theme>;
}

export const HorizontalTab = ({
  label,
  startAdornment,
  endAdornment,
  disabled = false,
  size = HorizontalTabSize.MD,
  value,
  onClick,
  sx,
}: HorizontalTabProps) => {
  const formattedLabel = (
    <>
      {!!startAdornment && startAdornment}
      {!!label && label}
      {!!endAdornment && endAdornment}
    </>
  ); //@todo: check if icons show correct
  return (
    <StyledHorizontalTab
      size={size}
      onClick={onClick}
      disabled={disabled}
      label={formattedLabel}
      value={value}
      disableRipple
      sx={sx}
    />
  );
};
