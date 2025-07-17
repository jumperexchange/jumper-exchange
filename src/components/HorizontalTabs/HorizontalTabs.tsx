import { SxProps, Theme } from '@mui/material/styles';
import { ReactNode } from 'react';
import { HorizontalTab } from './HorizontalTab';
import {
  HorizontalTabsContainer,
  HorizontalTabSize,
} from './HorizontalTabs.style';
export interface HorizontalTabItem {
  value: string;
  label?: ReactNode;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  disabled?: boolean;
}

export interface HorizontalTabsProps {
  tabs: HorizontalTabItem[];
  onChange: (event: React.SyntheticEvent, newValue: string) => void;
  onTabClick: (
    value: string,
  ) => (event: React.MouseEvent<HTMLDivElement>) => void;
  value?: string;
  size?: HorizontalTabSize;
  sx?: SxProps<Theme>;
  tabSx?: SxProps<Theme>;
}

export const HorizontalTabs = ({
  tabs,
  onChange,
  onTabClick,
  value,
  size = HorizontalTabSize.LG,
  sx,
  tabSx,
}: HorizontalTabsProps) => {
  return (
    <HorizontalTabsContainer value={value} onChange={onChange} sx={sx}>
      {tabs.map((tab) => (
        <HorizontalTab
          key={tab.value}
          value={tab.value}
          startAdornment={tab.startAdornment}
          endAdornment={tab.endAdornment}
          label={tab.label}
          size={size}
          onClick={onTabClick(tab.value)}
          sx={tabSx}
          disabled={tab.disabled}
        />
      ))}
    </HorizontalTabsContainer>
  );
};
