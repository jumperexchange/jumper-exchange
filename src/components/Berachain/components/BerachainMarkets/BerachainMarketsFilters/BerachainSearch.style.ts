import { Autocomplete } from '@mui/material';
import type { Breakpoint } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

// outer container
export const BerachainSearchAutocomplete = styled(Autocomplete)(
  ({ theme }) => ({
    height: 48,
    width: 280,
    padding: 0,
    alignSelf: 'flex-end',
    '.MuiOutlinedInput-root': {
      height: 48,
      padding: theme.spacing(1, 2),
      borderRadius: '8px',
    },
    [theme.breakpoints.down('md' as Breakpoint)]: {
      display: 'none',
    },
  }),
);
