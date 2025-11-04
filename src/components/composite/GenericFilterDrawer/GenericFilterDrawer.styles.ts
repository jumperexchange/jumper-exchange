import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { ButtonPrimary, ButtonTransparent } from 'src/components/Button';

export const GenericFilterDrawerDivider = styled(Divider)(({ theme }) => ({
  borderColor: (theme.vars || theme).palette.alpha200.main,
}));

export const GenericFilterDrawerAlphaButton = styled(ButtonTransparent)(
  ({ theme }) => ({
    backgroundColor: (theme.vars || theme).palette.buttonAlphaLightBg,
    color: (theme.vars || theme).palette.buttonAlphaLightAction,
    '&:hover': {
      backgroundColor: (theme.vars || theme).palette.buttonActiveBg,
      color: (theme.vars || theme).palette.buttonActiveAction,
    },
    '&:disabled': {
      backgroundColor: (theme.vars || theme).palette.buttonDisabledBg,
      color: (theme.vars || theme).palette.buttonDisabledAction,
    },
  }),
);

export const GenericFilterDrawerPrimaryButton = styled(ButtonPrimary)(
  ({ theme }) => ({
    backgroundColor: (theme.vars || theme).palette.buttonPrimaryBg,
    color: (theme.vars || theme).palette.buttonPrimaryAction,
    '&:disabled': {
      backgroundColor: (theme.vars || theme).palette.buttonDisabledBg,
      color: (theme.vars || theme).palette.buttonDisabledAction,
    },
  }),
);

export const GenericFilterDrawerIconButton = styled(IconButton)(
  ({ theme }) => ({
    height: 40,
    minWidth: 40,
    width: 'fit-content',
    borderRadius: theme.shape.buttonBorderRadius,
    backgroundColor: (theme.vars || theme).palette.buttonAlphaDarkBg,
    color: (theme.vars || theme).palette.buttonAlphaLightAction,
    '&:hover': {
      backgroundColor: (theme.vars || theme).palette.buttonActiveBg,
      color: (theme.vars || theme).palette.buttonActiveAction,
    },
  }),
);
