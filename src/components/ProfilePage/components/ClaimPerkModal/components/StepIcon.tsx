import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { FC } from 'react';
import { StyledStepIconBox } from '../ClaimPerkModal.styles';

interface StepIconProps {
  active: boolean;
  completed: boolean;
}

export const StepIcon: FC<StepIconProps> = ({ completed }) => {
  return (
    <StyledStepIconBox>
      {completed ? (
        <CheckRoundedIcon
          sx={(theme) => ({
            width: '16px',
            height: '16px',
            fill: (theme.vars || theme).palette.iconPrimaryInverted,
          })}
        />
      ) : null}
    </StyledStepIconBox>
  );
};
