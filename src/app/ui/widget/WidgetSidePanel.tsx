import Box from '@mui/material/Box';
import type { ReactNode } from 'react';

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
        zIndex: 1,
      }}
    >
      {children}
    </Box>
  );
};
