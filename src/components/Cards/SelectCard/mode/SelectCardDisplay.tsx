import { FC } from 'react';
import {
  SelectCardContainer,
  SelectCardLabel,
  SelectCardContentContainer,
  SelectCardValueContainer,
  SelectCardDisplayValue,
  SelectCardDescription,
} from '../SelectCard.styles';
import { SelectCardDisplayProps } from '../SelectCard.types';

export const SelectCardDisplay: FC<SelectCardDisplayProps> = ({
  label,
  value,
  placeholder,
  description,
  startAdornment,
  endAdornment,
  onClick,
}) => {
  return (
    <SelectCardContainer onClick={onClick} isClickable>
      {label && <SelectCardLabel>{label}</SelectCardLabel>}
      <SelectCardContentContainer>
        {startAdornment}
        <SelectCardValueContainer>
          <SelectCardDisplayValue showPlaceholder={!!placeholder && !value}>
            {value ?? placeholder}
          </SelectCardDisplayValue>
          {description && (
            <SelectCardDescription variant="bodyXSmall">
              {description}
            </SelectCardDescription>
          )}
        </SelectCardValueContainer>
        {endAdornment}
      </SelectCardContentContainer>
    </SelectCardContainer>
  );
};
