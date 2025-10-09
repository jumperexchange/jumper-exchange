import { FC, PropsWithChildren } from 'react';
import Box from '@mui/material/Box';

interface GridContainerProps extends PropsWithChildren {
  gridTemplateColumns?: string;
  gap?: number;
}

export const GridContainer: FC<GridContainerProps> = ({
  children,
  gridTemplateColumns = 'repeat(auto-fit, minmax(296px, 1fr))',
  gap = 4,
}) => {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'grid',
        gridTemplateColumns,
        gap,
      }}
    >
      {children}
    </Box>
  );
};
