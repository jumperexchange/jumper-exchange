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
  borderRadius: theme.shape.cardBorderRadius,
  backgroundColor: theme.palette.surface1.main,
  boxShadow: theme.shadows[2],
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
  paddingX: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    width: 'fit-content',
  },
}));
