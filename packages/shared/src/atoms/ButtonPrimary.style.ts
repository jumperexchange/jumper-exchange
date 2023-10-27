import type { ButtonProps } from '@mui/material';
import type { CSSObject } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { ButtonBase } from './ButtonBase.style';

export interface ButtonPrimaryProps extends Omit<ButtonProps, 'component'> {
  styles?: CSSObject;
}

export const ButtonPrimary = styled(ButtonBase)<ButtonPrimaryProps>(
  ({ theme, styles }) => ({
    color: theme.palette.white.main,
    backgroundColor:
      theme.palette.mode === 'dark'
        ? theme.palette.primary.main
        : theme.palette.accent1.main,
    ':hover': {
      backgroundColor:
        theme.palette.mode === 'dark' ? 'rgb(80, 47, 130)' : 'rgb(39, 0, 97)',
    },
    ...styles,
  }),
);
