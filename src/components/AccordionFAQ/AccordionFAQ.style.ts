import type { AccordionProps as MuiAccordionProps } from '@mui/material';
import {
  Box,
  Container,
  Divider,
  IconButton,
  Accordion as MuiAccordion,
  AccordionDetails as MuiAccordionDetails,
  type Breakpoint,
} from '@mui/material';

import { styled } from '@mui/material/styles';

export const AccordionContainer = styled(Container)(({ theme }) => ({
  margin: 'auto',
  marginTop: theme.spacing(4),
  padding: theme.spacing(1, 2),
  borderRadius: '8px',
  background: theme.palette.surface1.main,
  position: 'relative',
  maxWidth: theme.breakpoints.values.md,
  width: '100% !important',
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0px 2px 4px rgba(0, 0, 0, 0.04), 0px 8px 16px rgba(0, 0, 0, 0.08)'
      : '0px 2px 4px rgba(0, 0, 0, 0.04), 0px 8px 16px rgba(0, 0, 0, 0.04)',

  '&:before': {
    content: '" "',
    zIndex: '-1',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: 'linear-gradient(to top left, #fff 0%, #fff 100% )',
    filter: 'blur(20px)',
    opacity: 'var(0.7)',
    transition: 'opacity 0.3s',
  },
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    width: theme.breakpoints.values.md,
    maxWidth: theme.breakpoints.values.md,
  },
}));

export interface AccordionProps extends MuiAccordionProps {
  show?: boolean;
}

export const Accordion = styled(MuiAccordion, {
  shouldForwardProp: (prop) => prop !== 'show',
})<AccordionProps>(({ theme, show }) => ({
  background: 'transparent',
  visibility: show ? 'visible' : 'hidden',
  height: show ? 'auto' : 0,
  '&:last-of-type': {
    marginBottom: show ? theme.spacing(2) : 0,
  },
}));

export const AccordionDetails = styled(MuiAccordionDetails)(() => ({
  '& > img': { width: '100%' },
}));

export const AccordionToggleButton = styled(IconButton)(({ theme }) => ({
  width: 42,
  height: 42,
  color:
    theme.palette.mode === 'dark' ? theme.palette.white.main : 'currentColor',
}));

export const AccordionHeader = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export const AccordionDivider = styled(Divider)(({ theme }) => ({
  ...(theme.palette.mode === 'dark' && {
    borderColor: theme.palette.grey[200],
  }),
}));
