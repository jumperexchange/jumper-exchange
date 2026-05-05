import type { ChangeEvent, FC } from 'react';
import { useState } from 'react';
import { z } from 'zod';
import { useField } from '../store';
import type { BaseFieldProps } from '../types';
import { Button } from '@/components/core/buttons/Button/Button';
import { Size, Variant } from '@/components/core/buttons/types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FieldWrapper, Label } from '../JumperWidget.style';
import { useTokenAmountInput } from '@/hooks/tokens/useTokenAmountInput';
import type { TFunction } from 'i18next';
import { FormInput } from '@/components/Form/FormInput/FormInput';

export interface NumericSelectSchemaOptions {
  /**
   * Minimum selectable value (inclusive). Defaults to 0.
   * Set to a positive number to prevent selection of zero or negative values.
   */
  min?: number;
  /**
   * Maximum selectable value (inclusive).
   * When provided, selecting a value above this limit fails validation.
   */
  max?: number;
  /**
   * Whether a selection is required.
   * When `true`, `undefined` / no selection is treated as invalid.
   * Defaults to `false` so the field can start in an empty state.
   */
  required?: boolean;
}

export const createNumericSelectSchema = (
  t: TFunction,
  options: NumericSelectSchemaOptions = {},
) => {
  const { min = 0, max, required = false } = options;

  let valueSchema = z
    .number()
    .min(min, t('jumperWidget.fieldErrors.numericSelect.min', { min }));

  if (max !== undefined) {
    valueSchema = valueSchema.max(
      max,
      t('jumperWidget.fieldErrors.numericSelect.max', { max }),
    );
  }

  const objectSchema = z.object({ value: valueSchema });

  return required ? objectSchema : objectSchema.optional();
};

export type NumericSelectValue = z.infer<
  ReturnType<typeof createNumericSelectSchema>
>;

export interface CustomInputConfig {
  /** Input id/name attribute; defaults to "numeric-select-custom" */
  id?: string;
  placeholder?: string;
  endAdornment?: React.ReactNode;
}

interface NumericSelectBaseProps {
  values: number[];
  /** The currently active preset value, or undefined when custom input is active */
  selectedValue?: number;
  onSelect: (value: number | undefined) => void;
  formatValue?: (value: number) => string;
  label?: string;
  customInput?: CustomInputConfig & {
    inputValue: string;
    onInputChange: (raw: string) => void;
  };
  errorMessage?: string;
}

export const NumericSelectBase: FC<NumericSelectBaseProps> = ({
  values,
  selectedValue,
  onSelect,
  formatValue,
  label,
  customInput,
  errorMessage,
}) => {
  const [isCustomInputSelected, setIsCustomInputSelected] = useState(false);
  const { toPriceDisplay } = useTokenAmountInput();

  const getFormattedValue = (value: number) =>
    formatValue ? formatValue(value) : `$${toPriceDisplay(value)}`;

  const itemCount = values.length + (customInput ? 1 : 0);
  const itemWidth = `${100 / itemCount}%`;

  const inputId = customInput?.id ?? 'numeric-select-custom';

  return (
    <FieldWrapper>
      {!!label && <Label>{label}</Label>}
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        {values.map((value) => {
          const isSelected = selectedValue === value && !isCustomInputSelected;
          return (
            <Button
              key={value}
              variant={isSelected ? Variant.AlphaDark : Variant.Borderless}
              size={Size.MD}
              onClick={() => {
                onSelect(value);
                setIsCustomInputSelected(false);
              }}
              sx={{ width: itemWidth }}
            >
              {getFormattedValue(value)}
            </Button>
          );
        })}
        {customInput && (
          <Box sx={{ width: itemWidth }}>
            <FormInput
              id={inputId}
              name={inputId}
              value={customInput.inputValue}
              placeholder={customInput.placeholder ?? ''}
              onFocus={() => {
                setIsCustomInputSelected(true);
              }}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                customInput.onInputChange(e.target.value);
              }}
              endAdornment={customInput.endAdornment}
              sx={{ maxHeight: 40 }}
            />
          </Box>
        )}
      </Box>
      {errorMessage && (
        <Typography
          variant="bodyXXSmallStrong"
          color="error"
          sx={{
            mt: 0.5,
          }}
        >
          {errorMessage}
        </Typography>
      )}
    </FieldWrapper>
  );
};

export interface NumericSelectFieldProps extends BaseFieldProps {
  values: number[];
  formatValue?: (value: number) => string;
  customInput?: CustomInputConfig;
}

export const NumericSelectField: FC<NumericSelectFieldProps> = ({
  fieldKey,
  values,
  label,
  formatValue,
  customInput,
}) => {
  const field = useField<NumericSelectValue>(fieldKey);
  const [customInputValue, setCustomInputValue] = useState('');

  const currentNumericValue = field.value?.value;
  const isPresetSelected =
    currentNumericValue !== undefined && values.includes(currentNumericValue);
  const selectedValue = isPresetSelected ? currentNumericValue : undefined;

  const handleSelect = (value: number | undefined) => {
    setCustomInputValue('');
    field.setValue(value !== undefined ? { value } : undefined!);
  };

  const handleCustomInputChange = (raw: string) => {
    setCustomInputValue(raw);
    const parsed = parseFloat(raw);
    if (!Number.isNaN(parsed)) {
      field.setValue({ value: parsed });
    }
  };

  return (
    <NumericSelectBase
      values={values}
      selectedValue={selectedValue}
      onSelect={handleSelect}
      formatValue={formatValue}
      label={label}
      customInput={
        customInput
          ? {
              ...customInput,
              id: customInput.id ?? `numeric-select-custom-${fieldKey}`,
              inputValue: customInputValue,
              onInputChange: handleCustomInputChange,
            }
          : undefined
      }
      errorMessage={
        field.isTouched && field.errors.length > 0 ? field.errors[0] : undefined
      }
    />
  );
};
