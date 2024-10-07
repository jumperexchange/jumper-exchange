import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { alpha, useTheme } from '@mui/material';
import { VoidQuestPageCardContainer } from './VoidQuestPageCard.style';

export const VoidQuestPageCard = () => {
  const theme = useTheme();
  return (
    <VoidQuestPageCardContainer>
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
    </VoidQuestPageCardContainer>
  );
};
