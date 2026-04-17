import { getSurfaceBorder } from '@/theme/utils/getSurfaceBorder';
import type { SelectBaseProps, TData } from '../Select.types';
import type { PropsWithChildren } from 'react';
import { useCallback, useState } from 'react';
import {
  StyledSelect,
  StyledSelectorContainer,
  StyledSelectorContentContainer,
  StyledMenuItem,
  StyledMenuItemContentContainer,
} from '../Select.styles';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import CheckIcon from '@mui/icons-material/Check';
import type { SelectProps } from '@mui/material/Select';
import { SelectorLabel } from './SelectLabel';
import Fade from '@mui/material/Fade';

interface ExtendedSelectBaseProps<T extends TData>
  extends Omit<SelectBaseProps<T>, 'onChange'>, PropsWithChildren {
  multiple?: boolean;
  onChange: SelectProps['onChange'];
  selectorContent?: React.ReactNode;
}

export const SelectBase = <T extends TData>({
  children,
  options,
  value,
  disabled,
  selectorContent,
  menuPlacementX = 'left',
  menuSx,
  ...rest
}: ExtendedSelectBaseProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <StyledSelect
      {...rest}
      value={value}
      disabled={disabled}
      open={isOpen}
      onOpen={handleOpen}
      onClose={handleClose}
      renderValue={() => (
        <StyledSelectorContainer disabled={disabled}>
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
      IconComponent={() => null}
      autoWidth
      variant="standard"
      displayEmpty
      MenuProps={{
        sx: menuSx,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: menuPlacementX,
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: menuPlacementX,
        },
        disableScrollLock: true,
        autoFocus: false,
        slots: {
          transition: Fade,
        },
        slotProps: {
          root: {
            disableEnforceFocus: true,
            disableRestoreFocus: true,
          },
          list: {
            autoFocusItem: false,
          },
          paper: {
            sx: (theme) => ({
              backgroundColor: (theme.vars || theme).palette.surface1.main,
              border: getSurfaceBorder(theme, 'surface1'),
              borderRadius: `${theme.shape.cardBorderRadiusMedium}px`,
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
              marginTop: theme.spacing(1),
              '& .MuiList-root': {
                margin: theme.spacing(1),
                padding: 0,
                minWidth: '264px',
                maxHeight: '300px',
              },
            }),
          },
        },
      }}
    >
      {children}
      {options.map((option) => (
        <StyledMenuItem
          disableRipple
          key={option.value}
          value={option.value}
          sx={option.sx}
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
    </StyledSelect>
  );
};
