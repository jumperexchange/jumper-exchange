import { DrawerSelectProps, TData } from '../Select.types';
import { PropsWithChildren, useCallback } from 'react';
import {
  StyledMenuItem,
  StyledMenuItemContentContainer,
  StyledSelectorContainer,
  StyledSelectorContentContainer,
} from '../Select.styles';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { SelectProps, SelectChangeEvent } from '@mui/material/Select';
import { SelectorLabel } from '../components/SelectLabel';
import CheckIcon from '@mui/icons-material/Check';
import { FullScreenDrawer } from 'src/components/core/FullScreenDrawer/FullScreenDrawer';
import { useFullScreenDrawer } from 'src/components/core/FullScreenDrawer/hooks';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

export interface DrawerDisplayModeProps<T extends TData>
  extends Omit<DrawerSelectProps<T>, 'onChange' | 'displayMode'>,
    PropsWithChildren {
  onChange: SelectProps['onChange'];
  selectorContent?: React.ReactNode;
  multiple?: boolean;
  title: string;
}

const createSelectChangeEvent = <T extends TData>(
  newValue: T,
): SelectChangeEvent => {
  const event = new Event('change', { bubbles: true });
  Object.defineProperty(event, 'target', {
    value: { value: newValue, name: '' },
    enumerable: true,
  });
  return event as SelectChangeEvent;
};

export const DrawerDisplayMode = <T extends TData>({
  children,
  options,
  value,
  title,
  selectorContent,
  showTrigger = true,
  open: externalOpen,
  onOpen,
  onClose,
  onBack,
  onChange,
  multiple,
}: DrawerDisplayModeProps<T>) => {
  const { isOpen, open, close } = useFullScreenDrawer(
    externalOpen,
    onOpen,
    onClose,
  );

  const handleItemClick = useCallback(
    (selectedValue: string | number) => {
      let newValue: unknown;

      if (multiple) {
        const currentValues = value as (string | number)[];
        const isSelected = currentValues.includes(selectedValue);
        newValue = isSelected
          ? currentValues.filter((v) => v !== selectedValue)
          : [...currentValues, selectedValue];
      } else {
        newValue = value === selectedValue ? '' : selectedValue;
      }

      const event = createSelectChangeEvent(newValue as T);
      onChange?.(event, null);
    },
    [onChange, value, multiple],
  );

  return (
    <>
      {showTrigger && (
        <StyledSelectorContainer onClick={open} sx={{ width: 'fit-content' }}>
          <StyledSelectorContentContainer>
            {selectorContent}
            <KeyboardArrowDownRoundedIcon
              sx={{
                height: 22,
                width: 22,
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease-in-out',
              }}
            />
          </StyledSelectorContentContainer>
        </StyledSelectorContainer>
      )}
      <FullScreenDrawer
        isOpen={isOpen}
        onOpen={open}
        onClose={close}
        onBack={onBack}
        title={title}
        showBackButton={!showTrigger}
      >
        <Box>
          {children}
          <Stack
            direction="column"
            spacing={1}
            sx={{ flex: 1, overflowY: 'auto' }}
          >
            {options.map((option) => (
              <StyledMenuItem
                disableRipple
                key={option.value}
                value={option.value}
                sx={option.sx}
                onClick={() => handleItemClick(option.value)}
              >
                <StyledMenuItemContentContainer>
                  {option.icon}
                  <SelectorLabel label={option.label} />
                </StyledMenuItemContentContainer>
                {((Array.isArray(value) &&
                  (value as (string | number)[]).includes(option.value)) ||
                  (!Array.isArray(value) && value === option.value)) && (
                  <CheckIcon
                    sx={{
                      marginLeft: 'auto',
                      height: 16,
                      width: 16,
                    }}
                  />
                )}
              </StyledMenuItem>
            ))}
          </Stack>
        </Box>
      </FullScreenDrawer>
    </>
  );
};
