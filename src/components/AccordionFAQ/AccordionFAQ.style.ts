import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import type { BoxProps } from '@mui/material';
import {
  Box,
  Divider,
  IconButton,
  Accordion as MuiAccordion,
  AccordionDetails as MuiAccordionDetails,
  AccordionSummary as MuiAccordionSummary,
  Typography,
  type Breakpoint,
} from '@mui/material';

import { alpha, keyframes, styled } from '@mui/material/styles';

export const AccordionBox = styled(Box)(({ theme }) => ({
  margin: 'auto',
  // marginTop: theme.spacing(4),
  // padding: theme.spacing(1, 2),
  borderRadius: '8px',
  position: 'relative',
  maxWidth: theme.breakpoints.values.md,
  width: '100% !important',
  // boxShadow:
  //   theme.palette.mode === 'dark'
  //     ? '0px 2px 4px rgba(0, 0, 0, 0.04), 0px 8px 16px rgba(0, 0, 0, 0.08)'
  //     : '0px 2px 4px rgba(0, 0, 0, 0.04), 0px 8px 16px rgba(0, 0, 0, 0.04)',

  [theme.breakpoints.up('sm' as Breakpoint)]: {
    width: theme.breakpoints.values.md,
    maxWidth: theme.breakpoints.values.md,
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      '0px 2px 4px rgba(0, 0, 0, 0.04), 0px 8px 16px rgba(0, 0, 0, 0.08)',
  }),
}));

interface FaqShowMoreArrowProps {
  arrowSize?: number;
}

export const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(180deg);
  }
`;

export const FaqShowMoreArrow = styled(ArrowForwardIosIcon, {
  shouldForwardProp: (prop) => prop !== 'arrowSize',
})<FaqShowMoreArrowProps>(({ arrowSize }) => ({
  width: arrowSize || 24,
  height: arrowSize || 24,
  transition: 'transform 0.3s ease',
  transform: 'rotate(90deg)',
}));

export interface AccordionItemWrapperProps extends BoxProps {
  show?: boolean;
}

export const AccordionItemWrapper = styled(Box)<AccordionItemWrapperProps>(
  ({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
  }),
);

export const Accordion = styled(MuiAccordion)(({ theme }) => ({
  fontFamily: 'inherit',
  borderRadius: '16px',
  padding: theme.spacing(2, 3),
  width: '100%',
  background: alpha(theme.palette.text.primary, 0.08),
  minHeight: 64,
  transition: 'background-color 300ms ease-in-out',
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: 0,
  },
  '&:last-of-type': {
    borderRadius: '16px',
  },

  '&:hover': {
    background: alpha(theme.palette.text.primary, 0.16),
  },
}));

export const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  '& > img': { width: '100%' },
  '&:before': {
    display: 'none',
  },
}));

export const AccordionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  margin: theme.spacing(2, 'auto'),
  marginBottom: theme.spacing(4),
  textAlign: 'center',
}));

export const AccordionToggleButton = styled(IconButton)(({ theme }) => ({
  background: alpha(theme.palette.text.primary, 0.08),
  color: theme.palette.text.primary,
  transition: 'background-color 300ms ease-in-out',
  width: 32,
  height: 32,
  backgroundColor: alpha(theme.palette.text.primary, 0.08),

  '&:hover': {
    color: theme.palette.text.primary,
    background: alpha(theme.palette.text.primary, 0.16),
  },
}));

export const AccordionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginLeft: theme.spacing(2),
}));

export const AccordionDivider = styled(Divider)(({ theme }) => ({
  borderColor: alpha(theme.palette.text.primary, 0.04),
  width: '100%',
}));

export const AccordionSummary = styled(MuiAccordionSummary)(({ theme }) => ({
  minHeight: 'inherit',
  '& .MuiAccordionSummary-content': {
    alignItems: 'center',
    gap: theme.spacing(1.5),
  },
}));

export const AccordionIndex = styled(Box)(({ theme }) => ({
  borderRadius: '16px',
  height: 32,
  width: 32,
  flexShrink: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: alpha(theme.palette.text.primary, 0.08),
}));
