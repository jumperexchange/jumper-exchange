import type { FC } from 'react';
import { z } from 'zod';
import { useField } from '../store';
import type { BaseFieldProps } from '../types';
import { Button } from '@/components/core/buttons/Button/Button';
import { Size, Variant } from '@/components/core/buttons/types';
import Box from '@mui/material/Box';
import { FieldWrapper, Label } from '../JumperWidget.style';

export const amountThresholdSchema = z.object({
  amount: z.number().min(0),
});

export type AmountThresholdValue = z.infer<typeof amountThresholdSchema>;

export interface AmountThresholdFieldProps extends BaseFieldProps {
  thresholds: number[];
  formatValue?: (value: number) => string;
}

const defaultFormat = (v: number) => `$${v.toLocaleString()}`;

export const AmountThresholdField: FC<AmountThresholdFieldProps> = ({
  fieldKey,
  thresholds,
  label,
  formatValue = defaultFormat,
}) => {
  const field = useField<AmountThresholdValue>(fieldKey);

  return (
    <FieldWrapper>
      {!!label && <Label>{label}</Label>}
      <Box style={{ display: 'flex', gap: 2 }}>
        {thresholds.map((threshold) => {
          const isSelected = field.value?.amount === threshold;
          return (
            <Button
              variant={isSelected ? Variant.AlphaDark : Variant.Borderless}
              size={Size.MD}
              onClick={() =>
                field.setValue(isSelected ? undefined! : { amount: threshold })
              }
              sx={{ width: '25%' }}
            >
              {formatValue(threshold)}
            </Button>
          );
        })}
      </Box>
    </FieldWrapper>
  );
};
