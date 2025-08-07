import { FC, PropsWithChildren } from 'react';
import Box from '@mui/material/Box';

interface MainWidgetContainerProps extends PropsWithChildren {}

export const MainWidgetContainer: FC<MainWidgetContainerProps> = ({
  children,
}) => {
  return (
    <Box
      sx={{
        paddingX: { xs: 2, sm: 0 },
        marginBottom: { xs: 12, md: 0 },
      }}
    >
      {children}
    </Box>
  );
};
