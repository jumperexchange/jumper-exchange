import type { FC, ReactNode } from 'react';
import {
  PassStatChipCaption,
  PassStatChipContainer,
  PassStatChipText,
  PassStatChipValue,
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
        <PassStatChipValue>{value}</PassStatChipValue>
        <PassStatChipCaption>{caption}</PassStatChipCaption>
      </PassStatChipText>
    </PassStatChipContainer>
  );
};
