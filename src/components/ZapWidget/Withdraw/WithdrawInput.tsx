import { formatInputAmount } from '@lifi/widget';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import { FC, useState, useMemo, ReactNode } from 'react';
import { SelectCard } from 'src/components/Cards/SelectCard/SelectCard';
import { SelectCardMode } from 'src/components/Cards/SelectCard/SelectCard.styles';
import { WidgetFormHelperText } from '../WidgetLikeField/WidgetLikeField.style';
import WidgetFieldEndAdornment from '../WidgetLikeField/WidgetEndAdornment';

interface WithdrawInputProps {
  label?: string;
  value: string;
  onSetValue: (value: string) => void;
  priceUSD?: string;
  placeholder: string;
  name: string;
  errorMessage?: string;
  maxValue?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
}

const NUM_DECIMALS = 1;

export const WithdrawInput: FC<WithdrawInputProps> = ({
  label,
  priceUSD,
  placeholder,
  name,
  errorMessage,
  value,
  onSetValue,
  maxValue,
  startAdornment,
  endAdornment,
}) => {
  const formattedErrorMessage = useMemo(() => {
    if (maxValue && (parseFloat(value) ?? 0) > parseFloat(maxValue)) {
      return `You have not enough tokens. Current balance: ${maxValue}.`;
    }

    if (errorMessage) {
      return `An error occurred during the execution: ${errorMessage}. Please check your wallet.`;
    }

    return null;
  }, [value, maxValue, errorMessage]);

  const valueUSD = useMemo(() => {
    if (!value || !priceUSD) {
      return '0';
    }
    return (parseFloat(priceUSD) * parseFloat(value)).toString();
  }, [priceUSD, value]);

  const hint = useMemo(() => {
    return valueUSD
      ? Intl.NumberFormat('en-US', {
          style: 'currency',
          notation: 'compact',
          currency: 'USD',
          useGrouping: true,
          minimumFractionDigits: 2,
          maximumFractionDigits: parseFloat(valueUSD) > 2 ? 2 : 4,
        }).format(parseFloat(valueUSD))
      : 'NA';
  }, [valueUSD]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatInputAmount(rawValue, NUM_DECIMALS, true);
    onSetValue(formattedValue);
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatInputAmount(rawValue, NUM_DECIMALS);
    onSetValue(formattedValue);
  };

  return (
    <>
      <InputLabel htmlFor={name} sx={{ marginBottom: 2 }}>
        <Typography
          variant="titleSmall"
          sx={(theme) => ({
            color: (theme.vars || theme).palette.text.primary,
          })}
        >
          {label}
        </Typography>
      </InputLabel>
      <SelectCard
        id={name}
        name={name}
        mode={SelectCardMode.Input}
        placeholder={placeholder}
        value={value}
        description={hint}
        startAdornment={startAdornment}
        endAdornment={endAdornment}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
      />
      {formattedErrorMessage && (
        <WidgetFormHelperText>{formattedErrorMessage}</WidgetFormHelperText>
      )}
    </>
  );
};
