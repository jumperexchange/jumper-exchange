import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { Box, alpha, styled } from '@mui/material';

export const VoidQuestCardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor:
    theme.palette.mode === 'light'
      ? '#FFFFFF'
      : alpha(theme.palette.white.main, 0.08),
  height: 440,
  width: 288,
  borderRadius: '24px',
  border: 16,
  borderColor:
    theme.palette.mode === 'light'
      ? theme.palette.white.main
      : alpha(theme.palette.white.main, 0.08),
}));

export const VoidQuestCardIcon = styled(QuestionMarkIcon)(({ theme }) => ({
  height: '96px',
  width: '96px',
  color:
    theme.palette.mode === 'light'
      ? theme.palette.grey[400]
      : alpha(theme.palette.grey[400], 0.08),
}));
