import {
  formatInputAmount,
  formatTokenPrice,
  priceToTokenAmount,
} from '@lifi/widget';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import type { FC, ReactNode } from 'react';
import { useMemo, useRef, useState } from 'react';
import { SelectCard } from 'src/components/Cards/SelectCard/SelectCard';
import {
  SelectCardDescription,
  SelectCardMode,
} from 'src/components/Cards/SelectCard/SelectCard.styles';
import {
  DescriptionWrapper,
  HintIcon,
  HintWrapper,
  WidgetFormHelperText,
} from './WithdrawWidget.style';
import { currencyFormatter, decimalFormatter } from 'src/utils/formatNumbers';
import { useTranslation } from 'react-i18next';
import { USD_DECIMALS } from './constants';

interface WithdrawInputProps {
  label?: string;
  value: string;
  onSetValue: (value: string) => void;
  priceUSD?: string;
  decimals?: number;
  symbol?: string;
  name: string;
  maxValue?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  hintEndAdornment?: string;
}

export enum InputMode {
  Amount = 'amount',
  Price = 'price',
}

export const WithdrawInput: FC<WithdrawInputProps> = ({
  label,
  priceUSD,
  name,
  decimals,
  symbol,
  value,
  onSetValue,
  maxValue,
  startAdornment,
  endAdornment,
  hintEndAdornment,
}) => {
  const { t } = useTranslation();
  const [inputMode, setInputMode] = useState<InputMode>(InputMode.Amount);
  const [formattedPriceInput, setFormattedPriceInput] = useState('');
  const isEditingRef = useRef(false);
  const placeholder = useMemo(() => {
    return inputMode === InputMode.Amount ? '0' : '$0';
  }, [inputMode]);
  const formattedErrorMessage = useMemo(() => {
    if (maxValue && (parseFloat(value) ?? 0) > parseFloat(maxValue)) {
      return `You have not enough tokens. Current balance: ${maxValue}.`;
    }

    return null;
  }, [value, maxValue]);

  const { displayValue, hintValue, hintSymbol } = useMemo(() => {
    const priceValue = formatTokenPrice(value, priceUSD);

    if (inputMode === InputMode.Price) {
      let displayVal = '';
      if (isEditingRef.current) {
        displayVal = formattedPriceInput;
      } else {
        const formattedDisplayValue = decimalFormatter('en-US', {
          notation: 'standard',
          useGrouping: false,
        })(priceValue);
        displayVal = formattedDisplayValue;
      }

      const formattedHint = decimalFormatter('en-US', {
        notation: 'standard',
        useGrouping: true,
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals,
      })(value);

      return {
        displayValue: displayVal ? `$${displayVal}` : '',
        hintValue: formattedHint,
        hintSymbol: symbol,
      };
    }

    const formattedHint = currencyFormatter('en-US', {
      notation: 'compact',
      currency: 'USD',
      useGrouping: true,
      minimumFractionDigits: USD_DECIMALS,
      maximumFractionDigits: USD_DECIMALS,
    })(priceValue);

    return {
      displayValue: value,
      hintValue: formattedHint,
      hintSymbol: '',
    };
  }, [inputMode, value, priceUSD, decimals, symbol, formattedPriceInput]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    isEditingRef.current = true;

    if (inputMode === InputMode.Amount) {
      const formattedValue = formatInputAmount(rawValue, decimals, true);
      onSetValue(formattedValue);
    } else {
      const cleanInputValue = rawValue.replace('$', '');
      const formattedValue = formatInputAmount(
        cleanInputValue,
        USD_DECIMALS,
        true,
      );
      setFormattedPriceInput(formattedValue);
      const tokenValue = priceToTokenAmount(formattedValue, priceUSD);
      onSetValue(tokenValue);
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    isEditingRef.current = false;

    if (inputMode === InputMode.Amount) {
      const formattedValue = formatInputAmount(rawValue, decimals);
      onSetValue(formattedValue);
    } else {
      const cleanInputValue = rawValue.replace('$', '');
      const formattedValue = formatInputAmount(cleanInputValue, USD_DECIMALS);
      const tokenValue = priceToTokenAmount(formattedValue, priceUSD);
      const formattedAmount = formatInputAmount(tokenValue, decimals);
      onSetValue(formattedAmount);
    }
  };

  const handleSwitch = () => {
    setInputMode((prev) =>
      prev === InputMode.Amount ? InputMode.Price : InputMode.Amount,
    );
  };

  return (
    <>
      <InputLabel htmlFor={name} sx={{ marginBottom: 2 }}>
        <Typography
          variant="titleSmall"
          sx={{
            whiteSpace: 'break-spaces',
          }}
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
        value={displayValue}
        label={t('widget.withdraw.amount')}
        description={
          <DescriptionWrapper>
            <HintWrapper>
              <SelectCardDescription variant="bodyXSmall" hideOverflow>
                {hintValue}
              </SelectCardDescription>
              {!!hintSymbol && (
                <SelectCardDescription
                  variant="bodyXSmall"
                  sx={{ flexShrink: 0, marginLeft: 0.25 }}
                >
                  {hintSymbol}
                </SelectCardDescription>
              )}
              <HintIcon onClick={handleSwitch} />
            </HintWrapper>
            <SelectCardDescription variant="bodyXSmall" sx={{ flexShrink: 0 }}>
              {hintEndAdornment}
            </SelectCardDescription>
          </DescriptionWrapper>
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
