'use client';
import { useActiveTabStore } from '@/stores/activeTab';
import { Tooltip, useMediaQuery } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import { useVerticalTabs } from './useVerticalTabs';
import { VerticalTab, VerticalTabsContainer } from './VerticalTabs.style';

export const VerticalTabs = () => {
  const { activeTab, setActiveTab } = useActiveTabStore();
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  const verticalTabs = useVerticalTabs();

  return (
    <VerticalTabsContainer
      value={!isDesktop ? false : activeTab}
      orientation="vertical"
      onChange={handleChange}
      aria-label="vertical-tabs"
    >
      {verticalTabs.map((el: any, index) => {
        const tab = (
          <VerticalTab
            key={`tab-key-${index}`}
            onClick={(event) => {
              el.onClick(event, el.value);
            }}
            icon={el.icon}
            id={`tab-key-${el.value}`}
            aria-controls={`simple-tabpanel-${index}`}
          />
        );
        return !!el.tooltip ? (
          <Tooltip
            title={el.tooltip}
            key={`tooltip-key-${index}`}
            enterTouchDelay={0}
            disableHoverListener={el.disabled}
            placement="left"
            arrow
            slotProps={{
              popper: { sx: { zIndex: 1700 } },
            }}
          >
            {tab}
          </Tooltip>
        ) : (
          tab
        );
      })}
    </VerticalTabsContainer>
  );
};
