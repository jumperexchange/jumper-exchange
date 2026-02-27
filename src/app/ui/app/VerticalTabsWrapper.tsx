import { VerticalTabs } from '@/components/Menus/VerticalMenu';
import Box from '@mui/material/Box';
import type { FC } from 'react';

interface VerticalTabsWrapperProps {
  marginTop: number;
}

export const VerticalTabsWrapper: FC<VerticalTabsWrapperProps> = ({
  marginTop,
}) => (
  <Box
    sx={{
      marginTop: `${marginTop}px`,
      transition: 'margin-top 0.3s ease-in-out',
    }}
  >
    <VerticalTabs />
  </Box>
);
