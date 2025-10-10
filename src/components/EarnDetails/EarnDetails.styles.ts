import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { ButtonPrimary, ButtonProps } from '../Button';
import Skeleton from '@mui/material/Skeleton';

export const EarnDetailsAnalyticsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  padding: theme.spacing(3),
  borderRadius: theme.shape.cardBorderRadius,
  boxShadow: `0px 4px 24px 0px rgba(0, 0, 0, 0.08)`,
  backgroundColor: (theme.vars || theme).palette.surface1.main,
  ...theme.applyStyles('dark', {
    backgroundColor: (theme.vars || theme).palette.surface2.main,
  }),
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
