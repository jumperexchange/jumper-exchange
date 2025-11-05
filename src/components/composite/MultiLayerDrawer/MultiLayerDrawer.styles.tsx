import ButtonBase from '@mui/material/ButtonBase';
import Box from '@mui/system/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { ButtonPrimary, ButtonTransparent } from 'src/components/Button';
import { SelectBadge } from 'src/components/core/form/Select/components/SelectBadge';

export const MultiLayerDrawerIconButton = styled(IconButton)(({ theme }) => ({
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
}));

export const MultiLayerDrawerDivider = styled(Divider)(({ theme }) => ({
  borderColor: (theme.vars || theme).palette.alpha200.main,
}));

export const MultiLayerDrawerPrimaryButton = styled(ButtonPrimary)(
  ({ theme }) => ({
    backgroundColor: (theme.vars || theme).palette.buttonPrimaryBg,
    color: (theme.vars || theme).palette.buttonPrimaryAction,
    '&:disabled': {
      backgroundColor: (theme.vars || theme).palette.buttonDisabledBg,
      color: (theme.vars || theme).palette.buttonDisabledAction,
    },
  }),
);

export const MultiLayerDrawerAlphaButton = styled(ButtonTransparent)(
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

export const CategoryListItemContainer = styled(ButtonBase)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(0.5, 0),
}));

export const CategoryListItemContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  flex: 1,
}));

export const MultiLayerDrawerFilterBadge = styled(SelectBadge)(
  ({ theme }) => ({}),
);
