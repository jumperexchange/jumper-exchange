import { Box, Skeleton } from '@mui/material';

export const QuestCardSkeleton = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#f5f5f5',
        height: '392px',
        width: '272px',
        borderRadius: '24px',
        border: 16,
        borderColor: '#FFFFFF',
      }}
    >
      <Skeleton
        variant="rectangular"
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: '12px',
          transform: 'unset',
          aspectRatio: 550 / 300,
        }}
      />
    </Box>
  );
};
