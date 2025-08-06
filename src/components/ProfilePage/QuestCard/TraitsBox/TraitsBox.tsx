import { Tooltip, Typography } from '@mui/material';
import { AbsoluteCenterTraitsBox } from '../QuestCard.style';

interface TraitsBoxProps {
  trait: string; // Define the type for the title prop
}

export const TraitsBox = ({ trait }: TraitsBoxProps) => {
  return (
    <Tooltip
      title={
        'A trait for users of perps protocols (hyperliquid, dydx, gmxv2, vertex, intentx, aark) before October 1st 2024.'
      }
      placement="top"
      enterTouchDelay={0}
      arrow
      slotProps={{
        popper: { sx: { zIndex: 2000 } },
      }}
    >
      <AbsoluteCenterTraitsBox>
        <Typography
          sx={(theme) => ({
            color: theme.palette.white.main,
            fontWeight: 700,
            fontSize: '12px',
          })}
        >
          {trait}
        </Typography>
      </AbsoluteCenterTraitsBox>
    </Tooltip>
  );
};
