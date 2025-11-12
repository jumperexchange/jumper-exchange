import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import {
  ButtonPrimary,
  ButtonTransparent,
} from 'src/components/Button/Button.style';

export const StyledAccordion = styled(Accordion)(({ theme }) => ({
  background: 'transparent',
  border: 0,
  boxShadow: 'none',
  width: '100%',
  padding: 0,
  '&.MuiAccordion-root::before': {
    display: 'none',
  },
  '&:not(:last-child)': {
    paddingBottom: theme.spacing(3),
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

export const StyledPositionActions = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(2),
  alignItems: 'center',
  height: 'auto',
  width: '100%',
  [theme.breakpoints.up('md')]: {
    height: '100%',
    width: 'auto',
    justifyContent: 'flex-end',
  },
}));

export const StyledSummaryContent = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(2),
  justifyContent: 'space-between',
  width: '100%',
  cursor: 'pointer',
  flexDirection: 'column',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
  },
}));

export const StyledTagsRow = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
  alignItems: 'center',
}));

export const StyledDetailsContainer = styled(Stack)(({ theme }) => ({
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

export const StyledSectionDivider = styled(Divider)(({ theme }) => ({
  borderColor: (theme.vars || theme).palette.alpha100.main,
}));

export const StyledSectionContent = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(3),
  flexDirection: 'column',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
  },
}));

export const StyledOverviewColumn = styled(Stack)(({ theme }) => ({
  maxWidth: '100%',
  width: '100%',
  gap: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    maxWidth: 168,
  },
}));

export const StyledTablesColumn = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(2),
  width: '100%',
}));

export const StyledButtonAlphaDark = styled(ButtonTransparent)(({ theme }) => ({
  '&.MuiButton-root.MuiButtonBase-root': {
    height: 'auto',
    padding: theme.spacing(1.5, 2),
    ...theme.typography.bodySmallStrong,
    backgroundColor: theme.palette.buttonAlphaDarkBg,
    color: theme.palette.buttonAlphaDarkAction,
  },
}));

export const StyledButtonPrimary = styled(ButtonPrimary)(({ theme }) => ({
  height: 'auto',
  padding: theme.spacing(1.5, 2),
  ...theme.typography.bodySmallStrong,
}));
