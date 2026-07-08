'use client';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export const ScanPageSkeleton = () => {
  return (
    <Box
      sx={{
        p: 4,
        paddingBottom: {
          xs: 12,
          md: 8,
        },
      }}
    >
      <Skeleton
        variant="rounded"
        sx={{
          width: '100%',
          minHeight: 600,
          borderRadius: 3,
        }}
      />
    </Box>
  );
};
