import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { NUMERIC_SX } from './constants';
import { BaseSurface1Skeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';

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
      minWidth: 0,
    }}
  >
    <Typography
      variant={strong ? 'bodySmallStrong' : 'bodySmall'}
      sx={{
        ...NUMERIC_SX,
        ...(muted && { color: 'text.disabled' }),
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        minWidth: 0,
      }}
    >
      {children}
    </Typography>
  </Box>
);

export const OrderCellSkeleton = ({
  width = '60%',
  align = 'left',
}: {
  width?: number | string;
  align?: 'left' | 'right';
}) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
    }}
  >
    <BaseSurface1Skeleton variant="rounded" sx={{ height: 16, width }} />
  </Box>
);
