import { getSurfaceBorder } from '@/theme/utils/getSurfaceBorder';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

export const WalletBalanceCardContainer = styled(Box)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.surface1.main,
  border: getSurfaceBorder(theme, 'surface1'),
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.cardBorderRadius,
  padding: theme.spacing(2),
}));

export const WalletBalanceCardContentContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

export const WalletBalanceSharedContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
}));

export const WalletTotalBalanceValue = styled(Typography)(({ theme }) => ({
  ...theme.typography.headerLarge,
  color: (theme.vars || theme).palette.text.primary,
  textOverflow: 'ellipsis',
  userSelect: 'none',
  '& .ticker-view > :not(.ticker-column-container)': {
    marginLeft: `${theme.spacing(-0.25)} !important`,
    marginRight: `${theme.spacing(-0.25)} !important`,
  },
}));

export const BaseSkeleton = styled(Skeleton)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.surface2.main,
  border: getSurfaceBorder(theme, 'surface2'),
  transform: 'none',
}));

export const BaseIconButton = styled(IconButton)(({ theme }) => ({
  boxShadow: theme.shadows[2],
  padding: theme.spacing(0.75),
}));

export const LightIconButton = styled(BaseIconButton)(({ theme }) => ({
  color: (theme.vars || theme).palette.buttonLightAction,
  backgroundColor: (theme.vars || theme).palette.buttonLightBg,
}));

export const DarkIconButton = styled(BaseIconButton)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.buttonAlphaDarkBg,
  color: (theme.vars || theme).palette.buttonAlphaDarkAction,
  ...theme.applyStyles('light', {
    backgroundColor: (theme.vars || theme).palette.buttonAlphaDarkBg,
    color: (theme.vars || theme).palette.buttonAlphaDarkAction,
  }),

  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.buttonActiveBg,
    color: (theme.vars || theme).palette.buttonActiveAction,
  },
}));

export const SecondaryIconButton = styled(BaseIconButton)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.buttonSecondaryBg,
  color: (theme.vars || theme).palette.buttonSecondaryAction,
}));

export const WalletInfoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

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

export const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
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
    '&:hover': {
      cursor: 'default',
    },
  },
}));

export const StyledAccordionDetails = styled(AccordionDetails)({
  padding: 0,
  margin: 0,
});
