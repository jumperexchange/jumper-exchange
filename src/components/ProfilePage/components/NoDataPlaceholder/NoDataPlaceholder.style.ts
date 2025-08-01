import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { ButtonPrimary } from 'src/components/Button';

export const NoDataPlaceholderCard = styled(Box)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(4),
  padding: theme.spacing(3),
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.cardBorderRadius,
  backgroundColor: (theme.vars || theme).palette.alpha100.main,
  ...theme.applyStyles('light', {
    backgroundColor: (theme.vars || theme).palette.surface1.main,
  }),
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
  },
}));

export const NoDataPlaceholderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
}));

export const NoDataPlaceholderDescriptionContainer = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  }),
);

export const NoDataPlaceholderCta = styled(ButtonPrimary)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1.75, 2.75),
  [theme.breakpoints.up('md')]: {
    width: 'fit-content',
  },
}));
