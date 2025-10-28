import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
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
