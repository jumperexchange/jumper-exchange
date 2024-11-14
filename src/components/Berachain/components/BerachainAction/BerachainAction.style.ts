import {
  Box,
  Button,
  Card,
  Divider,
  Skeleton,
  Typography,
} from '@mui/material';
import { alpha, darken, styled } from '@mui/material/styles';
import { urbanist } from 'src/fonts/fonts';

export const BerachainActionBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(20),
  color: theme.palette.text.primary,
  display: 'flex',
  gap: 62,
}));

export const BerachainActionContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
}));

export const BerachainActionTitle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
}));

export const BerachainActionSubtitle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
}));

export const BerachainActionLearnMoreCTA = styled(Button)(({ theme }) => ({
  height: 40,
  backgroundColor: theme.palette.white.main,
  boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.04)',
  color: theme.palette.black.main,
  width: 120,
  marginTop: theme.spacing(5),
  '&:hover': {
    backgroundColor: darken(theme.palette.white.main, 0.08),
  },
}));

export const BerachainActionExamplesBox = styled(Box)(({ theme }) => ({
  width: 372,
  padding: theme.spacing(2, 3),
  marginTop: theme.spacing(10),
  backgroundColor: theme.palette.surface1.main,
  border: alpha(theme.palette.black.main, 0.08),
  borderRadius: '16px',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export const BerachainActionExamplesContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  margin: theme.spacing(2, 0),
}));

export const BerachainActionExamplesIcons = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
}));

export const BerachainActionBerachainWidgetWrapper = styled(Box)(
  ({ theme }) => ({
    minWidth: 416,
    width: '35%',
    // height: 522,
    backgroundColor: theme.palette.surface1.main,
    borderRadius: '24px',
    boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.08)',
  }),
);

export const BerachainActionBerachainWidget = styled(Box)(({ theme }) => ({
  width: 416,
  // height: 522,
  backgroundColor: theme.palette.surface1.main,
  padding: theme.spacing(3),
  borderRadius: '24px',
  boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.08)',
}));

export const BerachainWidgetHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

export const BerachainWidgetSelection = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column',
  backgroundColor: theme.palette.surface2.main,
  borderRadius: '16px',
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  border: `1px solid ${alpha(theme.palette.white.main, 0.08)}`,
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
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
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
  height: 44,
  width: '100%',
  borderRadius: '12px',
  justifyContent: 'space-between',
  backgroundColor: alpha('#835FB8', 0.24),
  marginTop: theme.spacing(2),
  alignItems: 'center',
  padding: theme.spacing(1.5, 2),
}));

export const BerachainWidgetPledgedBoxLabel = styled(Typography)(
  ({ theme }) => ({
    fontFamily: urbanist.style.fontFamily,
  }),
);
