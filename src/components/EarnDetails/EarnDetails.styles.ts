import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

import type { ButtonProps } from '../Button';
import { ButtonPrimary, ButtonTransparent } from '../Button';

export const EarnDetailsSectionContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(3),
  borderRadius: theme.shape.cardBorderRadius,
  boxShadow: theme.shadows[2],
  backgroundColor: (theme.vars || theme).palette.surface1.main,
  ...theme.applyStyles('dark', {
    backgroundColor: (theme.vars || theme).palette.surface2.main,
  }),
}));

export const EarnDetailsAnalyticsContainer = styled(
  EarnDetailsSectionContainer,
)(({ theme }) => ({
  gap: theme.spacing(3),
}));

export const EarnDetailsRisksContainer = styled(EarnDetailsSectionContainer)(
  ({ theme }) => ({
    gap: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  }),
);

interface EarnDetailsRisksNavButtonProps extends ButtonProps {
  isActive: boolean;
}

export const EarnDetailsRisksNavButton = styled(ButtonTransparent, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<EarnDetailsRisksNavButtonProps>(({ theme }) => ({
  ...theme.applyStyles('light', {
    backgroundColor: 'transparent',
  }),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  height: theme.spacing(5),
  fontSize: theme.typography.body2.fontSize,
  '&:not(:first-of-type)': {
    marginLeft: theme.spacing(1),
  },
  variants: [
    {
      props: ({ isActive }) => isActive,
      style: {
        ...theme.applyStyles('light', {
          backgroundColor: theme.palette.alpha100.main,
        }),
      },
    },
  ],
}));

export const EarnRiskTagsContainer = styled(Stack)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.alpha100.main,
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    flex: 1,
  },
}));

export const EarnRiskMissingWarning = styled('span')(({ theme }) => ({
  color: theme.palette.error.main,
}));

export const EarnDetailsAnalyticsHeaderContainer = styled(Stack)(
  ({ theme }) => ({
    gap: theme.spacing(2),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  }),
);

export const EarnDetailsAnalyticsButtonsContainer = styled(Stack)(
  ({ theme }) => ({
    gap: theme.spacing(1),
    flexWrap: 'wrap',
  }),
);

interface EarnDetailsAnalyticsButtonProps extends Omit<ButtonProps, 'variant'> {
  isActive: boolean;
}

export const EarnDetailsAnalyticsButton = styled(ButtonPrimary, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<EarnDetailsAnalyticsButtonProps>(({ theme }) => ({
  ...theme.typography.bodyXSmallStrong,
  padding: theme.spacing(1),
  width: 'fit-content',
  minWidth: 'fit-content',
  variants: [
    {
      props: { isActive: false },
      style: {
        backgroundColor: (theme.vars || theme).palette.buttonLightBg,
        color: (theme.vars || theme).palette.buttonLightAction,
        '&:hover': {
          backgroundColor: (theme.vars || theme).palette.buttonPrimaryBg,
          color: (theme.vars || theme).palette.buttonPrimaryAction,
        },
      },
    },
    {
      props: { isActive: true },
      style: {
        cursor: 'default',
        pointerEvents: 'none',
      },
    },
  ],
}));

export const EarnDetailsAnalyticsLineChartContainer = styled(Box)(
  ({ theme }) => ({
    height: 234,
  }),
);

export const BaseSkeletonBox = styled(Skeleton)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.surface2.main,
  borderRadius: theme.shape.buttonBorderRadius,
  transform: 'none',
  ...theme.applyStyles('dark', {
    backgroundColor: (theme.vars || theme).palette.surface1.main,
  }),
}));

export const EarnDetailsFlexContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  columnGap: theme.spacing(3),
  rowGap: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    flexWrap: 'wrap',
  },
}));

export const EarnDetailsRowFlexContainer = styled(EarnDetailsFlexContainer)(
  ({ theme }) => ({
    flex: '1',
    flexDirection: 'row',
  }),
);

export const EarnDetailsColumnFlexContainer = styled(EarnDetailsFlexContainer)(
  ({ theme }) => ({
    flex: '1 0 fit-content',
    flexDirection: 'column',
    justifyContent: 'space-between',
  }),
);

export const EarnDetailsActionsContainer = styled(EarnDetailsSectionContainer)(
  ({ theme }) => ({
    gap: theme.spacing(2),
  }),
);

export const ManagePositionsButton = styled(ButtonTransparent)(({ theme }) => ({
  padding: theme.spacing(1),
  background: (theme.vars || theme.palette).palette.buttonLightBg,
  color: (theme.vars || theme.palette).palette.buttonLightAction,
  '&:hover': {
    background: (theme.vars || theme.palette).palette.buttonPrimaryBg,
    color: (theme.vars || theme.palette).palette.buttonPrimaryAction,
  },
  '&.MuiButtonBase-root.Mui-disabled, &.MuiButtonBase-root:disabled': {
    background: (theme.vars || theme.palette).palette.buttonDisabledBg,
    color: (theme.vars || theme.palette).palette.buttonDisabledAction,
  },
}));
