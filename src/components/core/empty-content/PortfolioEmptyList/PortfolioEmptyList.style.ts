import { getSurfaceBorder } from '@/theme/utils/getSurfaceBorder';
import type { Theme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import { ButtonBase, ButtonPrimary } from '@/components/Button/Button.style';

export const PortfolioEmptyListContainer = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
}));

export const PortfolioEmptyListContentContainer = styled(Stack)(
  ({ theme }) => ({
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(4),
    marginBottom: theme.spacing(6.5),
    width: '100%',
    position: 'relative',
    zIndex: 1,
    '&:before': {
      content: '""',
      zIndex: -1,
      position: 'absolute',
      top: theme.spacing(-2),
      left: '50%',
      width: '90%',
      height: `calc(100% + ${theme.spacing(2)})`,
      transform: 'translateX(-50%)',
      backgroundColor: (theme.vars || theme).palette.surface2.main,
      border: getSurfaceBorder(theme, 'surface2'),
      filter: 'blur(32px)',
    },
  }),
);

export const PortfolioEmptyListDescriptionContainer = styled(Stack)(
  ({ theme }) => ({
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1),
  }),
);

export const PortfolioEmptyListButtonsContainer = styled(Stack)(
  ({ theme }) => ({
    width: '100%',
    gap: theme.spacing(2),
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
    },
  }),
);

const getButtonStyles = (theme: Theme) => ({
  height: 'auto',
  padding: theme.spacing(1.75, 2.75),
  ...theme.typography.bodyMediumStrong,
});

export const PortfolioEmptyListPrimaryButton = styled(ButtonPrimary)(
  ({ theme }) => ({
    ...getButtonStyles(theme),
  }),
);

export const PortfolioEmptyListSecondaryButton = styled(ButtonBase)(
  ({ theme }) => ({
    ...getButtonStyles(theme),
    color: (theme.vars || theme).palette.buttonLightAction,
    backgroundColor: (theme.vars || theme).palette.buttonLightBg,
    '&:hover': {
      color: (theme.vars || theme).palette.buttonAlphaDarkAction,
      backgroundColor: (theme.vars || theme).palette.buttonAlphaDarkBg,
    },
  }),
);
