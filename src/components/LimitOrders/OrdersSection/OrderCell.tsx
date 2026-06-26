import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { NUMERIC_SX } from './constants';

export const OrderCell = ({
  children,
  align = 'left',
  strong,
  muted,
}: {
  children: ReactNode;
  align?: 'left' | 'right';
  strong?: boolean;
  muted?: boolean;
}) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      width: '100%',
    }}
  >
    <Typography
      variant={strong ? 'bodySmallStrong' : 'bodySmall'}
      sx={{
        ...NUMERIC_SX,
        ...(muted && { color: 'text.disabled' }),
      }}
    >
      {children}
    </Typography>
  </Box>
);
