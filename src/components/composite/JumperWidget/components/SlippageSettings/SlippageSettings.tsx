import WarningRounded from '@mui/icons-material/WarningRounded';
import { Typography } from '@mui/material';
import { formatInputAmount, formatSlippage } from '@jumperexchange/widget';
import type { ChangeEventHandler, FocusEventHandler, FC } from 'react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SettingsCustomInput,
  SettingsDefaultButton,
  SettingsFieldSet,
  SlippageLimitsWarningContainer,
} from './SlippageSettings.style';
import { SettingCardExpandable } from '../Shared';
import Percent from '@mui/icons-material/Percent';
import { Badge } from '@/components/Badge/Badge';
import { BadgeVariant } from '@/components/Badge/Badge.styles';

const MAX_SLIPPAGE_RECOMMENDED = 0.05;
const MIN_SLIPPAGE_RECOMMENDED = 0.005;
const MAX_FRACTION_DIGITS = 5;

interface SlippageSettingsProps {
  value: number;
  defaultValue: number;
  onChange: (value: number) => void;
  showWarning?: boolean;
}

export const SlippageSettings: FC<SlippageSettingsProps> = ({
  value,
  defaultValue,
  onChange,
  showWarning,
}) => {
  const { t } = useTranslation();

  const isSlippageOutsideRecommendedLimits = value > MAX_SLIPPAGE_RECOMMENDED;
  const isSlippageUnderRecommendedLimits = value < MIN_SLIPPAGE_RECOMMENDED;
  const isSlippageNotRecommended =
    isSlippageOutsideRecommendedLimits || isSlippageUnderRecommendedLimits;

  const defaultPercentStr = String(defaultValue * 100);

  const defaultValueRef = useRef(defaultPercentStr);
  const [focused, setFocused] = useState<'input' | 'button'>();

  const customInputValue =
    !value || value === defaultValue ? defaultPercentStr : String(value * 100);

  const [inputValue, setInputValue] = useState(customInputValue);

  const handleDefaultClick = () => {
    onChange(defaultValue);
  };

  const formatAndSetSlippage = (raw: string, returnInitial = false) => {
    const formattedSlippage = formatSlippage(
      raw,
      defaultValueRef.current,
      returnInitial,
    );
    const formattedValue =
      Number(formattedSlippage) === 0 && !returnInitial
        ? '0'
        : formatInputAmount(
            formattedSlippage,
            MAX_FRACTION_DIGITS,
            returnInitial,
          );
    const maxLength =
      Number(formattedValue) < 10
        ? MAX_FRACTION_DIGITS + 2
        : MAX_FRACTION_DIGITS + 3;
    const slicedValue = formattedValue.slice(0, maxLength);

    setInputValue(slicedValue);
    onChange(slicedValue.length ? parseFloat(slicedValue) / 100 : defaultValue);
  };

  const handleInputUpdate: ChangeEventHandler<HTMLInputElement> = (event) => {
    formatAndSetSlippage(event.target.value, true);
  };

  const handleInputFocus: FocusEventHandler<HTMLInputElement> = (event) => {
    setFocused('input');
    formatAndSetSlippage(event.target.value);
  };

  const handleInputBlur: FocusEventHandler<HTMLInputElement> = (event) => {
    setFocused(undefined);
    formatAndSetSlippage(event.target.value);
  };

  const slippageWarningText = isSlippageOutsideRecommendedLimits
    ? t('jumperWidget.settings.slippageHighWarning')
    : isSlippageUnderRecommendedLimits
      ? t('jumperWidget.settings.slippageLowWarning')
      : '';

  return (
    <SettingCardExpandable
      value={
        <Badge
          variant={BadgeVariant.Alpha}
          label={
            value !== defaultValue
              ? `${customInputValue}%`
              : t('jumperWidget.settings.auto')
          }
        />
      }
      icon={<Percent />}
      title={t('jumperWidget.settings.slippage')}
    >
      <SettingsFieldSet>
        <SettingsDefaultButton
          selected={value === defaultValue && focused !== 'input'}
          onFocus={() => setFocused('button')}
          onBlur={() => setFocused(undefined)}
          onClick={handleDefaultClick}
          disableRipple
        >
          {t('jumperWidget.settings.auto')}
        </SettingsDefaultButton>
        <SettingsCustomInput
          selected={value !== defaultValue && focused !== 'button'}
          placeholder={
            focused === 'input' ? '' : t('jumperWidget.settings.slippageCustom')
          }
          inputProps={{ inputMode: 'decimal' }}
          onChange={handleInputUpdate}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          value={inputValue}
          autoComplete="off"
        />
      </SettingsFieldSet>
      {isSlippageNotRecommended && showWarning && (
        <SlippageLimitsWarningContainer>
          <WarningRounded color="warning" />
          <Typography sx={{ fontSize: 13, fontWeight: 400 }}>
            {slippageWarningText}
          </Typography>
        </SlippageLimitsWarningContainer>
      )}
    </SettingCardExpandable>
  );
};
