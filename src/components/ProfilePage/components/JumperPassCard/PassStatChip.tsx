import type { TypographyProps } from '@mui/material/Typography';
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
  valueVariant?: TypographyProps['variant'];
  captionVariant?: TypographyProps['variant'];
}

export const PassStatChip: FC<PassStatChipProps> = ({
  icon,
  value,
  caption,
  valueVariant = 'bodyMediumStrong',
  captionVariant = 'bodyXSmall',
}) => {
  return (
    <PassStatChipContainer>
      {icon}
      <PassStatChipText>
        <Typography variant={valueVariant} color="textPrimary" noWrap>
          {value}
        </Typography>
        <Typography variant={captionVariant} color="textSecondary" noWrap>
          {caption}
        </Typography>
      </PassStatChipText>
    </PassStatChipContainer>
  );
};
