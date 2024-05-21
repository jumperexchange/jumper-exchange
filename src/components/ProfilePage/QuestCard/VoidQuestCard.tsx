import { Box, alpha, useTheme } from '@mui/material';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

interface VoidQuestCardProps {
  connected: boolean;
}

export const VoidQuestCard = ({ connected }: VoidQuestCardProps) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : alpha(theme.palette.grey[100], 0.08),
        height: '416px',
        width: '272px',
        borderRadius: '24px',
        border: 16,
        borderColor:
          theme.palette.mode === 'light'
            ? theme.palette.white.main
            : alpha(theme.palette.white.main, 0.08),
      }}
    >
      <QuestionMarkIcon
        sx={{
          height: '96px',
          width: '96px',
          color:
            theme.palette.mode === 'light'
              ? theme.palette.grey[400]
              : alpha(theme.palette.grey[400], 0.08),
        }}
      />
    </Box>
  );
};
