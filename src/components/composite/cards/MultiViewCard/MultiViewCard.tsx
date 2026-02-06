import type { FC } from 'react';
import type { HorizontalTabsProps } from '@/components/HorizontalTabs/HorizontalTabs';
import { HorizontalTabs } from '@/components/HorizontalTabs/HorizontalTabs';
import { mergeSx } from '@/utils/theme/mergeSx';
import { MultiViewCardContainer } from './MultiViewCard.style';
import type { SxProps, Theme } from '@mui/material/styles';

interface MultiViewCardProps extends HorizontalTabsProps {
  tabsContainerSx?: SxProps<Theme>;
}

export const MultiViewCard: FC<MultiViewCardProps> = ({
  sx,
  tabsContainerSx,
  ...props
}) => {
  return (
    <MultiViewCardContainer sx={sx}>
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
      />
    </MultiViewCardContainer>
  );
};
