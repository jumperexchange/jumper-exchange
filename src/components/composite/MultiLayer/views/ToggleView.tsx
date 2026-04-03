import type { ChangeEvent } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type {
  RendererSlotProps,
  ToggleLeafCategory,
} from '../MultiLayer.types';
import { mergeSx } from '@/utils/theme/mergeSx';
import { StyledSwitch } from '@/components/core/form/Select/Select.styles';

export interface ToggleViewProps {
  category: ToggleLeafCategory;
  slotProps?: RendererSlotProps;
}

export const ToggleView = ({ category, slotProps }: ToggleViewProps) => {
  const checked = category.value ?? false;

  const handleChange = (
    _event: ChangeEvent<HTMLInputElement>,
    next: boolean,
  ) => {
    category.onChange?.(next);
  };

  const switchTestId = category.testId
    ? `${category.testId}-switch`
    : undefined;

  return (
    <Stack
      direction="column"
      spacing={1}
      sx={mergeSx({ flex: 1 }, slotProps?.listSx)}
    >
      <FormControlLabel
        control={
          <StyledSwitch
            checked={checked}
            onChange={handleChange}
            disableRipple
            slotProps={{
              input: {
                ...(switchTestId ? { 'data-testid': switchTestId } : {}),
                'aria-label': category.label,
              },
            }}
          />
        }
        labelPlacement="top"
        label={
          <Typography variant="bodyMedium">
            {category.description ?? category.label}
          </Typography>
        }
        sx={(theme) => ({
          alignItems: 'start',
          gap: theme.spacing(2),
          mx: 0,
        })}
      />
    </Stack>
  );
};
