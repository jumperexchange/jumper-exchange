import { Box, alpha, useTheme } from '@mui/material';

export const VoidQuestCard = () => {
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
        borderRadius: '24px',
        border: 16,
        borderColor:
          theme.palette.mode === 'light'
            ? '#ffffff'
            : alpha(theme.palette.white.main, 0.08),
      }}
    />
  );
};
