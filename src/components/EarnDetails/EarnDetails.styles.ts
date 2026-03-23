import { getSurfaceBorder } from '@/theme/utils/getSurfaceBorder';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import type { ButtonProps } from '../Button';
import { ButtonPrimary } from '../Button';

export const EarnDetailsSectionContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(3),
  borderRadius: theme.shape.cardBorderRadius,
  boxShadow: theme.shadows[2],
  backgroundColor: (theme.vars || theme).palette.surface1.main,
  border: getSurfaceBorder(theme, 'surface1'),
}));

export const EarnDetailsAnalyticsContainer = styled(
  EarnDetailsSectionContainer,
)(({ theme }) => ({
  gap: theme.spacing(3),
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
  isDisabled?: boolean;
}

export const EarnDetailsAnalyticsButton = styled(ButtonPrimary, {
  shouldForwardProp: (prop) => prop !== 'isActive' && prop !== 'isDisabled',
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
    {
      props: { isDisabled: true },
      style: {
        opacity: 0.5,
        cursor: 'not-allowed',
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

export const EarnDetailsActionsHeaderContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

export const EarnDetailsActionsButtonsContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
  },
}));

export const EarnDetailsActionsButtonsFallbackContainer = styled(Box)(
  ({ theme }) => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    gap: theme.spacing(0.5),
    maxWidth: '100%',
    [theme.breakpoints.up('md')]: {
      maxWidth: 360,
    },
  }),
);
