import type { FC } from 'react';
import {
  SelectCardContainer,
  SelectCardLabel,
  SelectCardContentContainer,
  SelectCardValueContainer,
  SelectCardInputField,
  SelectCardDescription,
} from '../SelectCard.styles';
import type { SelectCardInputProps } from '../SelectCard.types';

export const SelectCardInput: FC<SelectCardInputProps> = ({
  id,
  name,
  label,
  labelVariant,
  value,
  valueVariant,
  description,
  placeholder,
  placeholderVariant,
  startAdornment,
  endAdornment,
  isAmount,
  onChange,
  onFocus,
  onBlur,
  sx,
}) => {
  return (
    <SelectCardContainer sx={sx}>
      {label && (
        <SelectCardLabel htmlFor={id} textVariant={labelVariant}>
          {label}
        </SelectCardLabel>
      )}
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
            placeholderVariant={placeholderVariant}
            valueVariant={valueVariant}
          />
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
