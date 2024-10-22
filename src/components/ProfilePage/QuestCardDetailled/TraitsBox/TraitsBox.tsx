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
      title={
        'A trait for users of perps protocols (hyperliquid, dydx, gmxv2, vertex, intentx, aark) before October 1st 2024.'
      }
      placement="top"
      enterTouchDelay={0}
      componentsProps={{
        popper: { sx: { zIndex: 2000 } },
      }}
      arrow
    >
      <AbsoluteCenterTraitsBox>
        <Typography
          sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '12px' }}
        >
          {trait}
        </Typography>
      </AbsoluteCenterTraitsBox>
    </Tooltip>
  );
};
