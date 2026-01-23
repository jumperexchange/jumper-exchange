import { Skeleton } from '@mui/material';

export const LeaderboardSkeleton = ({ length }: { length: number }) => {
  return (
    <Skeleton
      variant="rectangular"
      sx={(theme) => ({
        height: `${length * 44}px`,
        width: '288px',
        textAlign: 'center',
        borderRadius: theme.shape.radius8,
      })}
    />
  );
};
