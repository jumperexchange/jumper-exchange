import type { FC } from 'react';
import { z } from 'zod';
import { useField } from '../store';
import type { BaseFieldProps } from '../types';
import { Button } from '@/components/core/buttons/Button/Button';
import { Size, Variant } from '@/components/core/buttons/types';
import Box from '@mui/material/Box';
import { FieldWrapper, Label } from '../JumperWidget.style';
import { useTokenAmountInput } from '@/hooks/tokens/useTokenAmountInput';

export const numericSelectSchema = z.object({
  value: z.number().min(0),
});

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

  const getFormattedValue = (value: number) => {
    if (!formatValue) {
      return `$${toPriceDisplay(value)}`;
    }

    return formatValue(value);
  };

  return (
    <FieldWrapper>
      {!!label && <Label>{label}</Label>}
      <Box style={{ display: 'flex', gap: 2 }}>
        {values.map((value) => {
          const isSelected = field.value?.value === value;
          return (
            <Button
              variant={isSelected ? Variant.AlphaDark : Variant.Borderless}
              size={Size.MD}
              onClick={() =>
                field.setValue(isSelected ? undefined! : { value: value })
              }
              sx={{ width: `${100 / values.length}%` }}
            >
              {getFormattedValue(value)}
            </Button>
          );
        })}
      </Box>
    </FieldWrapper>
  );
};
