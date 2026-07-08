import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import type { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import AccordionSummary from '@mui/material/AccordionSummary';
import type { StackProps } from '@mui/material/Stack';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

interface UseDefaultCursor {
  useDefaultCursor: boolean;
}

export const StyledAccordion = styled(Accordion)(({}) => ({
  background: 'transparent',
  border: 0,
  boxShadow: 'none',
  width: '100%',
  padding: 0,
  '&.MuiAccordion-root::before': {
    display: 'none',
  },
}));

type StyledAccordionSummaryProps = AccordionSummaryProps & UseDefaultCursor;

export const StyledAccordionSummary = styled(AccordionSummary, {
  shouldForwardProp: (prop) => prop !== 'useDefaultCursor',
})<StyledAccordionSummaryProps>(({ theme, useDefaultCursor }) => ({
  ...(useDefaultCursor
    ? {
        cursor: 'default',
        '&:hover:not(.Mui-disabled)': {
          cursor: 'default',
        },
      }
    : {
        cursor: 'pointer',
      }),
  padding: theme.spacing(2, 1.5),
  '& .MuiAccordionSummary-content': {
    width: '100%',
  },
  '& .MuiAccordionSummary-content, & .MuiAccordionSummary-content.Mui-expanded':
    {
      padding: 0,
      margin: 0,
    },
  '&.MuiAccordionSummary-root, &.MuiAccordionSummary-root.Mui-expanded': {
    minHeight: 'auto',
  },
  '& .MuiAccordionSummary-expandIconWrapper': {
    height: 40,
    width: 40,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
    color: (theme.vars || theme).palette.buttonAlphaDarkAction,
  },
}));

export const StyledAccordionDetails = styled(AccordionDetails)({
  padding: 0,
  margin: 0,
});

type StyledContentProps = StackProps & UseDefaultCursor;

export const StyledContent = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'useDefaultCursor',
})<StyledContentProps>(({ theme, useDefaultCursor }) => ({
  padding: theme.spacing(1.5),
  width: '100%',
  overflow: 'hidden',
  cursor: useDefaultCursor ? 'default' : 'pointer',
  borderRadius: theme.shape.borderRadius,
  transition: 'background-color 300ms ease-in-out',
  '&:not(:has([data-hint-hover-active]))': {
    '&:hover, &:focus-visible, &:focus': {
      backgroundColor: (theme.vars || theme).palette.alpha100.main,
    },
  },
}));
