import Stack from '@mui/material/Stack';
import CheckIcon from '@mui/icons-material/Check';
import type { SingleSelectLeafCategory } from '../MultiLayerDrawer.types';
import {
  StyledMenuItem,
  StyledMenuItemContentContainer,
} from 'src/components/core/form/Select/Select.styles';
import { SelectorLabel } from 'src/components/core/form/Select/components/SelectLabel';

export interface SingleSelectViewProps<TValue extends string | number> {
  category: SingleSelectLeafCategory<TValue>;
}

export const SingleSelectView = <TValue extends string | number>({
  category,
}: SingleSelectViewProps<TValue>) => {
  const value = category.value || '';
  const options = category.options || [];

  const handleSelect = (optionValue: TValue) => {
    if (!category.onChange) return;

    const newValue = value === optionValue ? '' : optionValue;
    category.onChange(newValue as TValue);
  };

  return (
    <Stack direction="column" spacing={2} sx={{ flex: 1, overflowY: 'auto' }}>
      {options.map((option) => {
        const isSelected = value === option.value;

        return (
          <StyledMenuItem
            size="medium"
            disableRipple
            key={option.value}
            value={option.value}
            sx={option.sx}
            onClick={() => handleSelect(option.value)}
            disabled={option.disabled}
          >
            <StyledMenuItemContentContainer size="medium">
              {option.icon}
              <SelectorLabel
                label={option.label}
                labelVariant="bodyMedium"
                size="medium"
              />
            </StyledMenuItemContentContainer>
            {isSelected && (
              <CheckIcon
                sx={{
                  marginLeft: 'auto',
                }}
              />
            )}
          </StyledMenuItem>
        );
      })}
    </Stack>
  );
};
