import Stack from '@mui/material/Stack';
import CheckIcon from '@mui/icons-material/Check';
import { LeafCategory } from '../../MultiLayerDrawer.types';
import {
  StyledMenuItem,
  StyledMenuItemContentContainer,
} from 'src/components/core/form/Select/Select.styles';
import { SelectorLabel } from 'src/components/core/form/Select/components/SelectLabel';

export interface SingleSelectViewProps {
  category: LeafCategory<string>;
}

/**
 * SingleSelectView - Renders a single-select list with radio-like behavior
 *
 * Features:
 * - Only one option can be selected at a time
 * - Checkmark indicates selected option
 */
export const SingleSelectView: React.FC<SingleSelectViewProps> = ({
  category,
}) => {
  const value = category.value || '';
  const options = category.options || [];

  const handleSelect = (optionValue: string) => {
    if (!category.onChange) return;

    // Toggle selection - deselect if clicking the same option
    const newValue = value === optionValue ? '' : optionValue;
    category.onChange(newValue);
  };

  return (
    <Stack direction="column" spacing={1} sx={{ flex: 1, overflowY: 'auto' }}>
      {options.map((option) => {
        const isSelected = value === option.value;

        return (
          <StyledMenuItem
            disableRipple
            key={option.value}
            value={option.value}
            sx={option.sx}
            onClick={() => handleSelect(option.value)}
            disabled={option.disabled}
          >
            <StyledMenuItemContentContainer>
              {option.icon}
              <SelectorLabel label={option.label} />
            </StyledMenuItemContentContainer>
            {isSelected && (
              <CheckIcon
                sx={{
                  marginLeft: 'auto',
                  height: 16,
                  width: 16,
                }}
              />
            )}
          </StyledMenuItem>
        );
      })}
    </Stack>
  );
};
