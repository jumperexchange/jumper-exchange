import { DrawerSelectProps, TData } from '../Select.types';
import { PropsWithChildren, useCallback, useState } from 'react';
import {
  StyledDrawerHeader,
  StyledMenuItem,
  StyledMenuItemContentContainer,
  StyledSelectorContainer,
  StyledSelectorContentContainer,
} from '../Select.styles';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { SelectProps, SelectChangeEvent } from '@mui/material/Select';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { SelectorLabel } from '../components/SelectLabel';
import CheckIcon from '@mui/icons-material/Check';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import BackIcon from '@mui/icons-material/ArrowBack';

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
  onChange,
  multiple,
}: DrawerDisplayModeProps<T>) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;

  const handleOpen = useCallback(() => {
    setInternalOpen(true);
    onOpen?.();
  }, [onOpen]);

  const handleClose = useCallback(() => {
    setInternalOpen(false);
    onClose?.();
  }, [onClose]);

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
        <StyledSelectorContainer onClick={handleOpen}>
          <StyledSelectorContentContainer
            sx={{ justifyContent: 'space-between' }}
          >
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

      <Drawer
        anchor={showTrigger ? 'bottom' : 'right'}
        open={isOpen}
        onClose={handleClose}
        hideBackdrop
        slotProps={{
          paper: {
            sx: (theme) => ({
              height: '100dvh',
              maxHeight: '100dvh',
              overflow: 'auto',
            }),
          },
        }}
      >
        <Box sx={(theme) => ({ padding: theme.spacing(1.5, 2) })}>
          <StyledDrawerHeader>
            {!showTrigger && (
              <IconButton onClick={handleClose} sx={{ float: 'left' }}>
                <BackIcon />
              </IconButton>
            )}

            <IconButton onClick={handleClose} sx={{ float: 'right' }}>
              <CloseIcon />
            </IconButton>

            <Typography
              variant="titleXSmall"
              sx={{
                display: 'block',
                textAlign: 'center',
                lineHeight: '40px',
              }}
            >
              {title}
            </Typography>
          </StyledDrawerHeader>

          {children}

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
        </Box>
      </Drawer>
    </>
  );
};
