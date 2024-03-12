import { Box, Skeleton, alpha, useTheme } from '@mui/material';

export const QuestCardSkeleton = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor:
          theme.palette.mode === 'light'
            ? '#f5f5f5'
            : alpha(theme.palette.white.main, 0.08),
        height: '426px',
        width: '272px',
        borderRadius: '20px',
        border: 16,
        borderColor:
          theme.palette.mode === 'light'
            ? '#ffffff'
            : alpha(theme.palette.white.main, 0.08),
      }}
    >
      <Skeleton
        variant="rectangular"
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: '4px',
          transform: 'unset',
          aspectRatio: 550 / 300,
        }}
      />
    </Box>
  );
};
