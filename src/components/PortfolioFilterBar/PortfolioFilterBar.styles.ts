import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';

export const PortfolioFilterBarContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  gap: theme.spacing(2),
}));

export const PortfolioFilterBarClearFiltersButton = styled(IconButton)(
  ({ theme }) => ({
    height: 40,
    width: 40,
    backgroundColor: (theme.vars || theme).palette.buttonAlphaDarkBg,
    color: (theme.vars || theme).palette.buttonAlphaLightAction,
    '&:hover': {
      backgroundColor: (theme.vars || theme).palette.buttonActiveBg,
      color: (theme.vars || theme).palette.buttonActiveAction,
    },
  }),
);
