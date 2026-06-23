import type { ReactNode } from 'react';
import Box from '@mui/material/Box';

interface WidgetSidePanelProps {
  children: ReactNode;
}

export const WidgetSidePanel = ({ children }: WidgetSidePanelProps) => {
  return (
    <Box
      data-testid="widget-side-panel"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      {children}
    </Box>
  );
};
