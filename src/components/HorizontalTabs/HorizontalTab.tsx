import { SxProps, Theme } from '@mui/material/styles';
import React from 'react';
import { HorizontalTabItem } from './HorizontalTabs';
import {
  HorizontalTabContainer,
  HorizontalTabSize,
} from './HorizontalTabs.style';

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
  return (
    <HorizontalTabContainer
      size={size}
      onClick={onClick}
      disabled={disabled}
      value={value}
      disableRipple
      sx={sx}
      label={
        <>
          {startAdornment}
          {label}
          {endAdornment}
        </>
      }
    />
  );
};
