import { Container, type Breakpoint } from '@mui/material';

import { styled } from '@mui/material/styles';

export const AccordionContainer = styled(Container)(({ theme }) => ({
  flexShrink: 0,
  width: '100%',
  border: 'unset',
  padding: theme.spacing(1),
  borderRadius: '24px',
  background: 'transparent',
  transition: 'background-color 250ms',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    minWidth: 250,
    width: 420,
  },
  '&:hover': {
    cursor: 'pointer',
    background:
      theme.palette.mode === 'light'
        ? theme.palette.alphaDark100.main
        : theme.palette.alphaLight400.main,
  },
}));
