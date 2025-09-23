import { SelectBaseProps, TData } from '../Select.types';
import { PropsWithChildren, useCallback, useState } from 'react';
import {
  StyledSelect,
  StyledSelectorContainer,
  StyledSelectorContentContainer,
  StyledSelectorLabelContainer,
  StyledMenuItem,
  StyledMenuItemLabelContainer,
  StyledMenuItemContentContainer,
} from '../Select.styles';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import CheckIcon from '@mui/icons-material/Check';
import { SelectProps } from '@mui/material/Select';

interface ExtendedSelectBaseProps<T extends TData>
  extends Omit<SelectBaseProps<T>, 'onChange'>,
    PropsWithChildren {
  multiple?: boolean;
  onChange: SelectProps['onChange'];
  selectorPrepend?: React.ReactNode;
}

export const SelectBase = <T extends TData>({
  children,
  options,
  label,
  value,
  selectorPrepend,
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
      open={isOpen}
      onOpen={handleOpen}
      onClose={handleClose}
      renderValue={() => (
        <StyledSelectorContainer>
          <StyledSelectorContentContainer>
            <StyledSelectorLabelContainer>
              <Typography variant="bodySmallStrong">{label}</Typography>
            </StyledSelectorLabelContainer>
            {selectorPrepend}
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
          horizontal: 'left',
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'left',
        },
        PaperProps: {
          sx: (theme) => ({
            backgroundColor: (theme.vars || theme).palette.surface1.main,
            borderRadius: theme.spacing(3),
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
            marginTop: theme.spacing(1),
            '&.MuiPaper-root': {
              left: '0px !important',
              transform: 'none !important',
              transformOrigin: '0px 0px !important',
            },
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
        <StyledMenuItem disableRipple key={option.value} value={option.value}>
          <StyledMenuItemContentContainer>
            {option.icon}
            <StyledMenuItemLabelContainer>
              <Typography variant="bodySmallStrong">{option.label}</Typography>
            </StyledMenuItemLabelContainer>
          </StyledMenuItemContentContainer>
          {((Array.isArray(value) && value.includes(option.value)) ||
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
