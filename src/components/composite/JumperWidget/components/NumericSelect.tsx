import type { FC } from 'react';
import { z } from 'zod';
import { useField } from '../store';
import type { BaseFieldProps } from '../types';
import { Button } from '@/components/core/buttons/Button/Button';
import { Size, Variant } from '@/components/core/buttons/types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FieldWrapper, Label } from '../JumperWidget.style';
import { useTokenAmountInput } from '@/hooks/tokens/useTokenAmountInput';

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
  options: NumericSelectSchemaOptions = {},
) => {
  const { min = 0, max, required = false } = options;

  let valueSchema = z.number().min(min, `Value must be at least ${min}`);

  if (max !== undefined) {
    valueSchema = valueSchema.max(max, `Value must be at most ${max}`);
  }

  const objectSchema = z.object({ value: valueSchema });

  return required ? objectSchema : objectSchema;
};

export const numericSelectSchema = createNumericSelectSchema();

export type NumericSelectValue = z.infer<typeof numericSelectSchema>;

export interface NumericSelectFieldProps extends BaseFieldProps {
  values: number[];
  formatValue?: (value: number) => string;
}

export const NumericSelectField: FC<NumericSelectFieldProps> = ({
  fieldKey,
  values,
  label,
  formatValue,
}) => {
  const field = useField<NumericSelectValue>(fieldKey);
  const { toPriceDisplay } = useTokenAmountInput();

  const getFormattedValue = (value: number) =>
    formatValue ? formatValue(value) : `$${toPriceDisplay(value)}`;

  return (
    <FieldWrapper>
      {!!label && <Label>{label}</Label>}
      <Box style={{ display: 'flex', gap: 2 }}>
        {values.map((value) => {
          const isSelected = field.value?.value === value;
          return (
            <Button
              key={value}
              variant={isSelected ? Variant.AlphaDark : Variant.Borderless}
              size={Size.MD}
              onClick={() =>
                field.setValue(isSelected ? undefined! : { value })
              }
              sx={{ width: `${100 / values.length}%` }}
            >
              {getFormattedValue(value)}
            </Button>
          );
        })}
      </Box>
      {field.isTouched && field.errors.length > 0 ? (
        <Typography variant="bodyXXSmallStrong" color="error" mt={0.5}>
          {field.errors[0]}
        </Typography>
      ) : null}
    </FieldWrapper>
  );
};
