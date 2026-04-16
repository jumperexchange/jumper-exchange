import MenuList from '@mui/material/MenuList';
import CheckIcon from '@mui/icons-material/Check';
import type {
  RendererSlotProps,
  SingleSelectLeafCategory,
} from '../MultiLayer.types';
import {
  StyledMenuItem,
  StyledMenuItemContentContainer,
} from 'src/components/core/form/Select/Select.styles';
import { SelectorLabel } from 'src/components/core/form/Select/components/SelectLabel';
import { mergeSx } from '@/utils/theme/mergeSx';

export interface SingleSelectViewProps<TValue extends string | number> {
  category: SingleSelectLeafCategory<TValue>;
  slotProps?: RendererSlotProps;
}

export const SingleSelectView = <TValue extends string | number>({
  category,
  slotProps,
}: SingleSelectViewProps<TValue>) => {
  const value = category.value || '';
  const options = category.options || [];

  const listSpacing = slotProps?.listSpacing ?? 2;

  const handleSelect = (optionValue: TValue) => {
    if (!category.onChange) {
      return;
    }

    const newValue = value === optionValue ? '' : optionValue;
    category.onChange(newValue as TValue);
  };

  return (
    <MenuList
      disablePadding
      sx={mergeSx(
        {
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: listSpacing,
        },
        slotProps?.listSx,
      )}
    >
      {options.map((option) => {
        const isSelected = value === option.value;

        return (
          <StyledMenuItem
            size="medium"
            disableRipple
            key={option.value}
            value={option.value}
            sx={mergeSx(option.sx, slotProps?.itemSx)}
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
    </MenuList>
  );
};
