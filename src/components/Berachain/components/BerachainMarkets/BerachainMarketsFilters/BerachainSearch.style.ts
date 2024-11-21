import { Autocomplete } from '@mui/material';
import type { Breakpoint } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

// outer container
export const BerachainSearchAutocomplete = styled(Autocomplete)(
  ({ theme }) => ({
    height: 48,
    width: '280px',
    padding: 0,
    alignSelf: 'flex-end',
    '.MuiOutlinedInput-root': {
      height: 48,
      padding: '9px 16px',
      '&:hover': {
        // '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        //   border: '1px solid red', //#554F4E
        // },
      },
    },
    [theme.breakpoints.down('md' as Breakpoint)]: {
      display: 'none',
    },
  }),
);
