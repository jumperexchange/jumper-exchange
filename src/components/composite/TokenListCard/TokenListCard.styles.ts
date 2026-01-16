import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import type { StackProps } from '@mui/material/Stack';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

export const StyledAccordion = styled(Accordion)(({ theme }) => ({
  background: 'transparent',
  border: 0,
  boxShadow: 'none',
  width: '100%',
  padding: 0,
  '&.MuiAccordion-root::before': {
    display: 'none',
  },
}));

export const StyledAccordionSummary = styled(AccordionSummary)({
  '& .MuiAccordionSummary-content': {
    width: '100%',
  },
  '&, & .MuiAccordionSummary-content, & .MuiAccordionSummary-content.Mui-expanded':
    {
      padding: 0,
      margin: 0,
    },
  '&.MuiAccordionSummary-root, &.MuiAccordionSummary-root.Mui-expanded': {
    minHeight: 'auto',
  },
});

export const StyledAccordionDetails = styled(AccordionDetails)({
  padding: 0,
  margin: 0,
});

interface StyledContentProps extends StackProps {
  hideCursor: boolean;
}

export const StyledContent = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'hideCursor',
})<StyledContentProps>(({ theme, hideCursor }) => ({
  width: '100%',
  overflow: 'hidden',
  cursor: hideCursor ? 'default' : 'pointer',
  borderRadius: theme.shape.borderRadius,
  transition: 'background-color 300ms ease-in-out',
  '&:not(:has([data-hint-hover-active]))': {
    '&:hover, &:focus-visible, &:focus': {
      backgroundColor: (theme.vars || theme).palette.alpha100.main,
    },
  },
}));
