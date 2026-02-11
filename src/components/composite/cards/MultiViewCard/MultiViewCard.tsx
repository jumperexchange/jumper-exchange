import type { ReactNode } from 'react';
import { useState, type FC } from 'react';
import type { HorizontalTabsProps } from '@/components/HorizontalTabs/HorizontalTabs';
import { HorizontalTabs } from '@/components/HorizontalTabs/HorizontalTabs';
import { mergeSx } from '@/utils/theme/mergeSx';
import {
  MultiViewCardContainer,
  MultiViewCardHeaderContainer,
} from './MultiViewCard.style';
import type { SxProps, Theme } from '@mui/material/styles';

interface MultiViewCardProps extends HorizontalTabsProps {
  tabsContainerSx?: SxProps<Theme>;
  renderHeader?: () => ReactNode;
}

export const MultiViewCard: FC<MultiViewCardProps> = ({
  sx,
  tabsContainerSx,
  renderContent,
  renderHeader,
  onChange,
  ...props
}) => {
  const initialTab = props.value ?? props.tabs[0]?.value ?? '';
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  return (
    <MultiViewCardContainer sx={sx}>
      <MultiViewCardHeaderContainer>
        <HorizontalTabs
          {...props}
          sx={mergeSx(tabsContainerSx, (theme) => ({
            '&.MuiTabs-root': {
              backgroundColor: 'transparent',
              minHeight: 'fit-content',
              padding: 0,
            },
            '& .MuiTabs-indicator': {
              backgroundColor: (theme.vars || theme).palette.buttonAlphaDarkBg,
              boxShadow: 'none',
            },
          }))}
          value={activeTab}
          onChange={(event, newValue) => {
            setActiveTab(newValue);
            onChange?.(event, newValue);
          }}
        />
        {renderHeader?.()}
      </MultiViewCardHeaderContainer>
      {renderContent?.(activeTab)}
    </MultiViewCardContainer>
  );
};
