import { FC, PropsWithChildren } from 'react';
import Box from '@mui/material/Box';

export const MissionsPageContentContainer: FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(296px, 1fr))',
        gap: 4,
      }}
    >
      {children}
    </Box>
  );
};
