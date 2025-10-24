import { FC, PropsWithChildren } from 'react';
import Box, { BoxProps } from '@mui/material/Box';

interface GridContainerProps extends PropsWithChildren {
  gridTemplateColumns?: string;
  gap?: number;
  'data-testid'?: string;
}

export const GridContainer: FC<GridContainerProps> = ({
  children,
  gridTemplateColumns = 'repeat(auto-fit, minmax(296px, 1fr))',
  gap = 4,
  'data-testid': dataTestId,
}) => {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'grid',
        gridTemplateColumns,
        gap,
      }}
      data-testid={dataTestId}
    >
      {children}
    </Box>
  );
};
