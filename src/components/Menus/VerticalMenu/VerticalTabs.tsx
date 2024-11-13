'use client';
import { useActiveTabStore } from '@/stores/activeTab';
import { useAccount } from '@lifi/wallet-management';
import { Tooltip, useMediaQuery } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import { useGetNFT } from '../../../wash/hooks/useGetNFT';
import { useVerticalTabs } from './useVerticalTabs';
import { VerticalTab, VerticalTabsContainer } from './VerticalTabs.style';

export const VerticalTabs = () => {
  const { activeTab, setActiveTab } = useActiveTabStore();
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  const verticalTabs = useVerticalTabs();
  const data = useGetNFT();
  const { account } = useAccount();

  return (
    <VerticalTabsContainer
      value={!isDesktop ? false : activeTab}
      sx={{ ...(data.hasNFT && account?.address && { marginTop: '140px' }) }}
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
    </VerticalTabsContainer>
  );
};
