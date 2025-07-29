import { FC, PropsWithChildren } from 'react';
import Box from '@mui/material/Box';

interface GridContainerProps extends PropsWithChildren {
  gridTemplateColumns?: string;
}

export const GridContainer: FC<GridContainerProps> = ({
  children,
  gridTemplateColumns = 'repeat(auto-fit, minmax(296px, 1fr))',
}) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns,
        gap: 4,
      }}
    >
      {children}
    </Box>
  );
};
