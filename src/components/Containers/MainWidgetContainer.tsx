import { FC, PropsWithChildren } from 'react';
import Box from '@mui/material/Box';

interface MainWidgetContainerProps extends PropsWithChildren {}

export const MainWidgetContainer: FC<MainWidgetContainerProps> = ({
  children,
}) => {
  return (
    <Box
      id="main-widget-container"
      sx={{
        paddingX: { xs: 2, sm: 0 },
      }}
    >
      {children}
    </Box>
  );
};
