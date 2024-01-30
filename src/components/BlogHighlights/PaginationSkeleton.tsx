import { Box, useTheme } from '@mui/material';
import { SkeletonCircle } from '.';

export const PaginationSkeleton = () => {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex' }}>
      <SkeletonCircle
        variant="rounded"
        sx={{ backgroundColor: theme.palette.grey[800] }}
      />
      <SkeletonCircle variant="rounded" />
      <SkeletonCircle variant="rounded" />
      <SkeletonCircle variant="rounded" />
      <SkeletonCircle variant="rounded" />
    </Box>
  );
};
