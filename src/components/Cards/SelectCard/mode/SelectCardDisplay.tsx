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
  icon,
  onClick,
}) => {
  return (
    <SelectCardContainer onClick={onClick} isClickable>
      {label && <SelectCardLabel>{label}</SelectCardLabel>}
      <SelectCardContentContainer>
        {icon}
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
      </SelectCardContentContainer>
    </SelectCardContainer>
  );
};
