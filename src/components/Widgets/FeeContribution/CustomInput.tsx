import { formatInputAmount } from '@lifi/widget';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import { useState } from 'react';
import { NUM_DECIMAL_PLACES, USD_CURRENCY_SYMBOL } from './constants';
import { ContributionCustomInput } from './FeeContribution.style';
import { FeeContributionBaseProps } from './FeeContribution.types';

interface CustomInputProps extends FeeContributionBaseProps {
  maxValue: number;
  placeholder: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  currentValue,
  isDisabled,
  maxValue,
  placeholder,
  isManualValueSelected,
  setCurrentValue,
  setIsManualValueSelected,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isDisabled) return;
    if (!isManualValueSelected) {
      setIsManualValueSelected(true);
    }
    const rawValue = event.target.value;
    const formattedValue = formatInputAmount(
      rawValue,
      NUM_DECIMAL_PLACES,
      true,
    );
    const numericValue = Number(formattedValue);
    const shouldLimitToMax =
      formattedValue && maxValue && numericValue > maxValue;
    const finalValue = shouldLimitToMax
      ? maxValue.toFixed(NUM_DECIMAL_PLACES)
      : formattedValue;

    setCurrentValue(finalValue);
  };

  const handleClick = () => {
    if (isDisabled) return;

    if (!isFocused) {
      setIsFocused(true);
    }

    if (!isManualValueSelected) {
      setIsManualValueSelected(true);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (isFocused) {
      setIsFocused(false);
    }

    const { value } = event.target;
    const formattedAmount = formatInputAmount(value, NUM_DECIMAL_PLACES);
    setCurrentValue(formattedAmount);
  };

  return (
    <Grid size={{ xs: 4, sm: 3 }}>
      <ContributionCustomInput
        value={currentValue}
        aria-autocomplete="none"
        onChange={handleChange}
        onClick={handleClick}
        onBlur={handleBlur}
        placeholder={!isFocused ? placeholder : ''}
        isFieldActive={isFocused}
        slotProps={{
          input: {
            startAdornment:
              isFocused || currentValue ? (
                <InputAdornment position="start" disableTypography>
                  {USD_CURRENCY_SYMBOL}
                </InputAdornment>
              ) : null,
          },
        }}
      />
    </Grid>
  );
};
