import Typography from '@mui/material/Typography';
import type { FC, ReactNode } from 'react';
import {
  PassStatChipContainer,
  PassStatChipText,
} from './JumperPassCard.styles';

interface PassStatChipProps {
  icon: ReactNode;
  value: ReactNode;
  caption: ReactNode;
}

export const PassStatChip: FC<PassStatChipProps> = ({
  icon,
  value,
  caption,
}) => {
  return (
    <PassStatChipContainer>
      {icon}
      <PassStatChipText>
        <Typography variant="bodyMediumStrong" color="textPrimary" noWrap>
          {value}
        </Typography>
        <Typography variant="bodyXSmall" color="textSecondary" noWrap>
          {caption}
        </Typography>
      </PassStatChipText>
    </PassStatChipContainer>
  );
};
