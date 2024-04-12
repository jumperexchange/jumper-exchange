import { Box } from '@mui/material';
import { Skeleton, WidgetSkeletonContainer } from './WidgetView.style';

export const WidgetSkeleton = () => {
  return (
    <WidgetSkeletonContainer>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'flex-start',
        }}
      >
        <Skeleton variant="rounded" width={115} height={24} />
      </Box>
      <Skeleton variant="rounded" width={368} height={104} />
      <Skeleton variant="rounded" width={368} height={104} />
      <Skeleton variant="rounded" width={368} height={104} />
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Skeleton variant="rounded" width={308} height={48} />
        <Skeleton variant="rounded" width={48} height={48} />
      </Box>
    </WidgetSkeletonContainer>
  );
};
