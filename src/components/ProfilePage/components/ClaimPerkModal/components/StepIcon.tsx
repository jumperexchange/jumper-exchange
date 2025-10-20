import Box from '@mui/material/Box';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { FC } from 'react';

interface StepIconProps {
  active: boolean;
  completed: boolean;
}

export const StepIcon: FC<StepIconProps> = ({ active, completed }) => {
  return (
    <Box
      sx={(theme) => ({
        width: theme.spacing(3),
        height: theme.spacing(3),
        padding: theme.spacing(0.5),
        backgroundColor:
          completed || active
            ? (theme.vars || theme).palette.primary.main
            : (theme.vars || theme).palette.grey[100],
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      {completed ? (
        <CheckRoundedIcon
          sx={(theme) => ({
            width: '16px',
            height: '16px',
            fill: (theme.vars || theme).palette.iconPrimaryInverted,
          })}
        />
      ) : null}
    </Box>
  );
};
