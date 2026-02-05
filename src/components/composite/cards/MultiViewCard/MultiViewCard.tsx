import type { FC } from 'react';
import type { HorizontalTabsProps } from '@/components/HorizontalTabs/HorizontalTabs';
import { HorizontalTabs } from '@/components/HorizontalTabs/HorizontalTabs';
import { mergeSx } from '@/utils/theme/mergeSx';
import { getSurfaceBorder } from '@/theme/utils/getSurfaceBorder';
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
