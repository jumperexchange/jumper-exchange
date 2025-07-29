import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const NoDataPlaceholderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

export const NoDataPlaceholderDescriptionContainer = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  }),
);
