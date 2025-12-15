import type { FC } from 'react';
import {
  SelectCardContainer,
  SelectCardLabel,
  SelectCardContentContainer,
  SelectCardValueContainer,
  SelectCardDisplayValue,
  SelectCardDescription,
} from '../SelectCard.styles';
import type { SelectCardDisplayProps } from '../SelectCard.types';

export const SelectCardDisplay: FC<SelectCardDisplayProps> = ({
  label,
  labelVariant,
  value,
  valueVariant,
  placeholder,
  placeholderVariant,
  description,
  startAdornment,
  endAdornment,
  onClick,
  isClickable = true,
  sx,
}) => {
  return (
    <SelectCardContainer onClick={onClick} isClickable={isClickable} sx={sx}>
      {label && (
        <SelectCardLabel textVariant={labelVariant}>{label}</SelectCardLabel>
      )}
      <SelectCardContentContainer>
        {startAdornment}
        <SelectCardValueContainer>
          <SelectCardDisplayValue
            showPlaceholder={!!placeholder && !value}
            textVariant={valueVariant}
            placeholderVariant={placeholderVariant}
          >
            {value ?? placeholder}
          </SelectCardDisplayValue>
          {description &&
            (typeof description === 'string' ? (
              <SelectCardDescription variant="bodyXSmall">
                {description}
              </SelectCardDescription>
            ) : (
              description
            ))}
        </SelectCardValueContainer>
        {endAdornment}
      </SelectCardContentContainer>
    </SelectCardContainer>
  );
};
