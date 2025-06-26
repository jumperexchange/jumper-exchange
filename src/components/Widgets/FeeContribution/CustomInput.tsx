import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import { ContributionCustomInput } from './FeeContribution.style';
import { USD_CURRENCY_SYMBOL } from './constants';
import { formatInputAmount } from './utils';
import { NUM_DECIMAL_PLACES } from './constants';
import { ContributionBaseProps } from './FeeContribution.types';

interface CustomInputProps extends ContributionBaseProps {
  maxValue: number;
  placeholder: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  currentValue,
  isDisabled,
  maxValue,
  placeholder,
  isManualValue,
  setCurrentValue,
  setIsManualValue,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isDisabled) return;

    if (!isManualValue) {
      setIsManualValue(true);
    }

    const rawValue = event.target.value;
    const formattedValue = formatInputAmount(rawValue, NUM_DECIMAL_PLACES);
    const numericValue = Number(formattedValue);

    const shouldLimitToMax =
      formattedValue && maxValue && numericValue >= maxValue;
    const finalValue = shouldLimitToMax
      ? maxValue.toFixed(NUM_DECIMAL_PLACES)
      : formattedValue;

    setCurrentValue(finalValue);
  };

  const handleClick = () => {
    if (isDisabled) return;

    if (!isManualValue) {
      setIsManualValue(true);
    }
  };

  return (
    <Grid size={3}>
      <ContributionCustomInput
        value={currentValue}
        aria-autocomplete="none"
        onChange={handleChange}
        onClick={handleClick}
        placeholder={placeholder}
        isFieldActive={isManualValue}
        slotProps={{
          input: {
            startAdornment:
              isManualValue || currentValue ? (
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
