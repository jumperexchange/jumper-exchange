import type { AccordionProps as MuiAccordionProps } from '@mui/material';
import {
  Container,
  Accordion as MuiAccordion,
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
    // transform: 'translate3d(0px, 20px, 0) scale(0.95)',
    filter: 'blur(20px)',
    opacity: 'var(0.7)',
    transition: 'opacity 0.3s',
  },
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    width: theme.breakpoints.values.md,
    maxWidth: theme.breakpoints.values.md,
  },
}));

export interface AccordionProps extends Omit<MuiAccordionProps, 'component'> {
  show?: boolean;
}

export const Accordion = styled(MuiAccordion, {
  shouldForwardProp: (prop) => prop !== 'backgroundImageUrl',
})<AccordionProps>(({ theme, show }) => ({
  background: 'transparent',
  visibility: show ? 'visible' : 'hidden',
  height: show ? 'auto' : 0,
  '&:last-of-type': {
    marginBottom: show ? theme.spacing(2) : 0,
  },
}));
