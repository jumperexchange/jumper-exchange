import { Skeleton } from '@mui/material';

export const LeaderboardSkeleton = () => {
  return (
      <Skeleton
        variant="rectangular"
        sx={{
          height: '24px',
          width: '288px',
          textAlign: 'center',
          borderRadius: '8px',
        }}
      />
  );
};
