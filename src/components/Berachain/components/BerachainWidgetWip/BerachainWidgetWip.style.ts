import {
  Box,
  Button,
  Card,
  Divider,
  Skeleton,
  Typography,
  Accordion,
} from '@mui/material';
import { alpha, darken, styled } from '@mui/material/styles';
import { urbanist } from 'src/fonts/fonts';

export const BerachainActionBerachainWidgetWrapper = styled(Box)(
  ({ theme }) => ({
    minWidth: 416,
    height: 'fit-content',
    borderRadius: '24px',
    boxShadow: '0px 4px 24px 0px rgba(126, 88, 88, 0.08)',
  }),
);

export const BerachainWidgetHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  color: theme.palette.text.primary,
  justifyContent: 'space-between',
  alignItems: 'center',
}));

export const BerachainWidgetSelection = styled(Box)(({ theme }) => ({
  display: 'flex',
  color: theme.palette.text.primary,
  justifyContent: 'space-between',
  flexDirection: 'column',
  backgroundColor: '#1E1D1C',
  borderRadius: '16px',
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  border: `1px solid ${alpha(theme.palette.white.main, 0.08)}`,
  gap: '8px',
}));

export const BerachainDetailsDropdown = styled(Box)(({ theme }) => ({
  display: 'flex',
  color: theme.palette.text.primary,
  justifyContent: 'space-between',
  backgroundColor: '#1E1D1C',
  borderRadius: '16px',
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  border: `1px solid ${alpha(theme.palette.white.main, 0.08)}`,
  cursor: 'pointer',
}));

export const BerachainDetailsAccordion = styled(Accordion)<{
  isExpanded?: boolean;
}>(({ theme, isExpanded }) => ({
  background: 'transparent',
  border: `1px solid ${alpha(theme.palette.white.main, 0.08)}`,
  cursor: 'pointer',
  boxShadow: 'none',
  width: '100%',
  marginTop: theme.spacing(2),
  backgroundColor: '#1E1D1C',
  borderRadius: '16px 16px 16px 16px',
}));

export const BerachainWidgetSelectionBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexGrow: 1,
  justifyContent: 'flex-start',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

export const BerachainWidgetSelectionCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'inherit',
  backgroundColor: 'transparent',
  borderRadius: '16px',
  padding: theme.spacing(2, 0),
  boxShadow: 'unset',
}));

export const BerachainWidgetDivider = styled(Divider)(({ theme }) => ({
  borderColor: alpha(theme.palette.white.main, 0.08),
}));

export const BerachainBadgeAvatar = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  overflow: 'visible',
  position: 'relative',
}));

export const BerachainWidgetSelectionTokenLogoSkeleton = styled(Skeleton)(
  ({ theme }) => ({
    width: 40,
    height: 40,
    border: `2px solid ${theme.palette.white.main}`,
  }),
);

export const BerachainWidgetSelectionChainLogoSkeleton = styled(Skeleton)(
  ({ theme }) => ({
    width: 15,
    height: 15,
    border: `2px solid ${theme.palette.white.main}`,
    position: 'absolute',
    right: -6,
    bottom: -2,
    zIndex: 10,
  }),
);

export const BerachainWidgetSelectionRewards = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'stretch',
  gap: theme.spacing(2),
}));

export const BerachainActionPledgeButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#F47226',
  color: theme.palette.white.main,
  marginTop: theme.spacing(2),
  width: '100%',
  '&:hover': {
    backgroundColor: darken('#F47226', 0.08),
  },
}));

export const BerachainWidgetPledgedBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  color: theme.palette.text.primary,
  height: 44,
  width: '100%',
  borderRadius: '12px',
  justifyContent: 'space-between',
  backgroundColor: '#1E1D1C',
  marginTop: theme.spacing(2),
  alignItems: 'center',
  padding: theme.spacing(1.5, 2),
}));

export const BerachainWidgetPledgedBoxLabel = styled(Typography)(
  ({ theme }) => ({
    fontFamily: urbanist.style.fontFamily,
  }),
);

export const BerachainActionBerachainWidget = styled(Box)(({ theme }) => ({
  width: 416,
  // height: 522,
  backgroundColor: '#121214',
  padding: theme.spacing(3),
  borderRadius: '24px',
  boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.08)',
}));
