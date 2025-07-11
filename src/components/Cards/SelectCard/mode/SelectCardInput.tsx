import { FC } from 'react';
import {
  SelectCardContainer,
  SelectCardLabel,
  SelectCardContentContainer,
  SelectCardValueContainer,
  SelectCardInputField,
  SelectCardDescription,
} from '../SelectCard.styles';
import { SelectCardInputProps } from '../SelectCard.types';

export const SelectCardInput: FC<SelectCardInputProps> = ({
  id,
  name,
  label,
  value,
  description,
  placeholder,
  startAdornment,
  endAdornment,
  isAmount,
  onChange,
  onFocus,
  onBlur,
}) => {
  return (
    <SelectCardContainer>
      {label && <SelectCardLabel htmlFor={id}>{label}</SelectCardLabel>}
      <SelectCardContentContainer>
        {startAdornment}
        <SelectCardValueContainer>
          <SelectCardInputField
            id={id}
            name={name}
            value={value}
            placeholder={placeholder}
            type="text"
            autoComplete="off"
            fullWidth
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            isAmount={isAmount}
          />
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
