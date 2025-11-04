import { alpha, ButtonBase, Divider, styled } from '@mui/material';
import { ButtonPrimary, ButtonTransparent } from 'src/components/Button';

export const MultiLayerDrawerIconButton = styled(ButtonBase)(({ theme }) => ({
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
  borderColor: alpha(theme.palette.white.main, 0.12),
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
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.white.main, 0.08),
  border: `1px solid ${alpha(theme.palette.white.main, 0.12)}`,
  transition: 'background-color 0.2s',
  '&:hover': {
    backgroundColor: alpha(theme.palette.white.main, 0.12),
  },
  '&:active': {
    backgroundColor: alpha(theme.palette.white.main, 0.16),
  },
}));

export const CategoryListItemContent = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  flex: 1,
}));

export const CategoryListItemLabel = styled('span')(({ theme }) => ({
  ...theme.typography.bodyMedium,
  color: theme.palette.text.primary,
  textAlign: 'left',
}));

export const CategoryListItemBadge = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 20,
  height: 20,
  padding: theme.spacing(0, 0.75),
  borderRadius: 10,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontSize: '12px',
  fontWeight: 700,
  lineHeight: '20px',
}));
