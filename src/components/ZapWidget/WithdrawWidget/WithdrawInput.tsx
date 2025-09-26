import { formatInputAmount } from '@lifi/widget';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import { FC, useMemo, ReactNode } from 'react';
import { SelectCard } from 'src/components/Cards/SelectCard/SelectCard';
import {
  SelectCardDescription,
  SelectCardMode,
} from 'src/components/Cards/SelectCard/SelectCard.styles';
import { WidgetFormHelperText } from './WithdrawWidget.style';
import { currencyFormatter } from 'src/utils/formatNumbers';
import Box from '@mui/material/Box';

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
  hintEndAdornment?: string;
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
  hintEndAdornment,
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
      ? currencyFormatter('en-US', {
          notation: 'compact',
          currency: 'USD',
          useGrouping: true,
          minimumFractionDigits: 2,
          maximumFractionDigits: parseFloat(valueUSD) > 2 ? 2 : 4,
        })(parseFloat(valueUSD))
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
            whiteSpace: 'break-spaces',
          })}
        >
          {label}
        </Typography>
      </InputLabel>
      <SelectCard
        id={name}
        name={name}
        isAmount
        mode={SelectCardMode.Input}
        placeholder={placeholder}
        value={value}
        label="Amount"
        description={
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 1,
            }}
          >
            <SelectCardDescription variant="bodyXSmall">
              {hint}
            </SelectCardDescription>
            <SelectCardDescription variant="bodyXSmall">
              {hintEndAdornment}
            </SelectCardDescription>
          </Box>
        }
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
