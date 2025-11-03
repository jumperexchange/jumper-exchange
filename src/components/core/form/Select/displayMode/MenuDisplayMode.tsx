import { MenuSelectProps, TData } from '../Select.types';
import { PropsWithChildren, useCallback, useState } from 'react';
import {
  StyledMenuItem,
  StyledMenuItemContentContainer,
  StyledSelect,
  StyledSelectorContainer,
  StyledSelectorContentContainer,
} from '../Select.styles';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { SelectProps } from '@mui/material/Select';
import Fade from '@mui/material/Fade';
import { SelectorLabel } from '../components/SelectLabel';
import CheckIcon from '@mui/icons-material/Check';

export interface MenuDisplayModeProps<T extends TData>
  extends Omit<MenuSelectProps<T>, 'onChange' | 'displayMode'>,
    PropsWithChildren {
  multiple?: boolean;
  onChange: SelectProps['onChange'];
  selectorContent?: React.ReactNode;
}

export const MenuDisplayMode = <T extends TData>({
  children,
  options,
  value,
  selectorContent,
  menuPlacementX = 'left',
  ...rest
}: MenuDisplayModeProps<T>) => {
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
      open={isOpen}
      onOpen={handleOpen}
      onClose={handleClose}
      renderValue={() => (
        <StyledSelectorContainer>
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
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: menuPlacementX,
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: menuPlacementX,
        },
        disableScrollLock: true,
        slots: {
          transition: Fade,
        },
        PaperProps: {
          sx: (theme) => ({
            backgroundColor: (theme.vars || theme).palette.surface1.main,
            borderRadius: theme.spacing(3),
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
