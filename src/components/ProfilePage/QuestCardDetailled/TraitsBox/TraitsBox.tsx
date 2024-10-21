import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { alpha, Box, Tooltip, Typography, useTheme } from '@mui/material';
import { AbsoluteCenterTraitsBox } from '../QuestCard.style';

interface TraitsBoxProps {
  trait: string; // Define the type for the title prop
}

export const TraitsBox = ({ trait }: TraitsBoxProps) => {
  const theme = useTheme();
  return (
    <Tooltip
      title={'explanation of the perpoors traits'}
      placement="top"
      enterTouchDelay={0}
      componentsProps={{
        popper: { sx: { zIndex: 2000 } },
      }}
      arrow
      sx={{
        zIndex: 2500,
      }}
    >
      <AbsoluteCenterTraitsBox>
        <Typography sx={{ color: '#FFFFFF', fontWeight: 600 }}>
          {trait}
        </Typography>
      </AbsoluteCenterTraitsBox>
    </Tooltip>
  );
};
