'use client';
import type { SxProps, Theme } from '@mui/material';
import { Tooltip } from '@mui/material';
import { Tab, TabsContainer } from './Tabs.style';

export interface TabProps {
  label?: string;
  tooltip?: string;
  value: number;
  icon?: JSX.Element;
  onClick: (event: React.MouseEvent<HTMLDivElement>, index: number) => void;
  disabled?: boolean;
}

type Orientation = 'horizontal' | 'vertical';

interface TabsProps {
  data: TabProps[];
  value: number | boolean;
  onChange?: (event: React.SyntheticEvent, value: number) => void;
  orientation?: Orientation;
  ariaLabel: string;
  containerStyles?: SxProps<Theme>;
  tabStyles?: SxProps<Theme>;
}

export const Tabs = ({
  data,
  value,
  onChange,
  orientation,
  ariaLabel,
  containerStyles,
  tabStyles,
}: TabsProps) => {
  return data ? (
    <TabsContainer
      value={value}
      orientation={orientation ?? 'horizontal'}
      onChange={onChange}
      aria-label={ariaLabel}
      sx={containerStyles}
    >
      {data.map((el, index) => {
        const keys = a11yProps(ariaLabel, index);
        const tab = (
          <Tab
            key={`${keys.id}-${index}`}
            onClick={(event) => {
              el.onClick(event, el.value);
            }}
            icon={el.icon}
            label={el.label}
            aria-label={el.label}
            {...a11yProps(ariaLabel, el.value)}
            sx={tabStyles}
          />
        );
        return !!el.tooltip ? (
          <Tooltip
            title={el.tooltip}
            key={`tooltip-${el.label}-${index}`}
            enterTouchDelay={0}
            disableHoverListener={el.disabled}
            componentsProps={{
              popper: { sx: { zIndex: 1700 } },
            }}
            arrow
          >
            {tab}
          </Tooltip>
        ) : (
          tab
        );
      })}
    </TabsContainer>
  ) : null;
};

export function a11yProps(ariaLabel: string, index: number) {
  return {
    id: `${ariaLabel}-${index}`,
    'aria-controls': `${ariaLabel}panel-${index}`,
  };
}
