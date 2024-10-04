import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { alpha, useTheme } from '@mui/material';
import { VoidQuestCardCompletedContainer } from './VoidQuestCardCompleted.style';

interface VoidQuestCardCompletedProps {
  connected: boolean;
}

export const VoidQuestCardCompleted = ({
  connected,
}: VoidQuestCardCompletedProps) => {
  const theme = useTheme();
  return (
    <VoidQuestCardCompletedContainer>
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
    </VoidQuestCardCompletedContainer>
  );
};
