import Box, { BoxProps } from '@mui/material/Box';
import Skeleton, { SkeletonProps } from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

export enum BadgeVariant {
  Default = 'default',
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
  Alpha = 'alpha',
  Disabled = 'disabled',
  Primary = 'primary',
  Secondary = 'secondary',
  Tertiary = 'tertiary',
}

export enum BadgeSize {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
}

export interface StyledBadgeProps extends BoxProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

export const StyledBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'variant' && prop !== 'size',
})<StyledBadgeProps>(({ theme, onClick }) => {
  return {
    borderRadius: theme.shape.buttonBorderRadius,
    width: 'fit-content',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    pointerEvents: 'inherit',
    cursor: onClick ? 'pointer' : 'default',
    variants: [
      {
        props: ({ size }) => size === BadgeSize.SM,
        style: {
          height: 24,
          minWidth: 24,
          padding: theme.spacing(0.5),
          '& > p': {
            fontSize: theme.typography.bodyXXSmallStrong.fontSize,
            lineHeight: theme.typography.bodyXXSmallStrong.lineHeight,
            padding: theme.spacing(0.1, 0.5),
          },
          '& > svg': {
            fontSize: 12,
          },
        },
      },
      {
        props: ({ size }) => size === BadgeSize.MD,
        style: {
          height: 32,
          minWidth: 32,
          padding: theme.spacing(0.5, 0.75),
          '& > p': {
            fontSize: theme.typography.bodyXSmallStrong.fontSize,
            lineHeight: theme.typography.bodyXSmallStrong.lineHeight,
            padding: theme.spacing(0.5),
          },
          '& > svg': {
            fontSize: 16,
          },
        },
      },
      {
        props: ({ size }) => size === BadgeSize.LG,
        style: {
          height: 40,
          minWidth: 40,
          padding: theme.spacing(0.5, 1),
          '& > p': {
            fontSize: theme.typography.bodySmallStrong.fontSize,
            lineHeight: theme.typography.bodySmallStrong.lineHeight,
            padding: theme.spacing(0.875, 0.75),
          },
          '& > svg': {
            fontSize: 20,
          },
        },
      },
      {
        props: ({ size }) => size === BadgeSize.XL,
        style: {
          height: 48,
          minWidth: 48,
          padding: theme.spacing(0.5, 1),
          '& > p': {
            fontSize: theme.typography.bodyMediumStrong.fontSize,
            lineHeight: theme.typography.bodyMediumStrong.lineHeight,
            padding: theme.spacing(1.25, 1),
          },
          '& > svg': {
            fontSize: 24,
          },
        },
      },
      {
        props: ({ variant }) => variant === BadgeVariant.Default,
        style: {
          pointerEvents: 'none',
          backgroundColor: (theme.vars || theme).palette.badgeDefaultBg,
          color: (theme.vars || theme).palette.badgeDefaultFg,
        },
      },
      {
        props: ({ variant }) => variant === BadgeVariant.Success,
        style: {
          backgroundColor: (theme.vars || theme).palette.statusSuccessBg,
          color: (theme.vars || theme).palette.statusSuccessFg,
        },
      },
      {
        props: ({ variant }) => variant === BadgeVariant.Error,
        style: {
          backgroundColor: (theme.vars || theme).palette.statusErrorBg,
          color: (theme.vars || theme).palette.statusErrorFg,
        },
      },
      {
        props: ({ variant }) => variant === BadgeVariant.Warning,
        style: {
          backgroundColor: (theme.vars || theme).palette.statusWarningBg,
          color: (theme.vars || theme).palette.statusWarningFg,
        },
      },
      {
        props: ({ variant }) => variant === BadgeVariant.Alpha,
        style: {
          backgroundColor: (theme.vars || theme).palette.badgeAlphaBg,
          color: (theme.vars || theme).palette.badgeAlphaFg,
        },
      },
      {
        props: ({ variant }) => variant === BadgeVariant.Disabled,
        style: {
          cursor: 'default',
          backgroundColor: (theme.vars || theme).palette.badgeDisabledBg,
          color: (theme.vars || theme).palette.badgeDisabledFg,
        },
      },
      {
        props: ({ variant }) => variant === BadgeVariant.Primary,
        style: {
          backgroundColor: (theme.vars || theme).palette.badgeAccent1Bg,
          color: (theme.vars || theme).palette.badgeAccent1Fg,
        },
      },
      {
        props: ({ variant }) => variant === BadgeVariant.Secondary,
        style: {
          backgroundColor: (theme.vars || theme).palette.badgeAccent1MutedBg,
          color: (theme.vars || theme).palette.badgeAccent1MutedFg,
        },
      },
      {
        props: ({ variant }) => variant === BadgeVariant.Tertiary,
        style: {
          backgroundColor: (theme.vars || theme).palette.surfaceAccent2Bg,
          color: (theme.vars || theme).palette.surfaceAccent2Fg,
        },
      },
    ],
  };
});

export const StyledBadgeLabel = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightBold,
}));

interface BaseSkeletonProps extends SkeletonProps {
  size?: BadgeSize;
  color?: 'default' | 'grey';
}

export const BaseSkeleton = styled(Skeleton, {
  shouldForwardProp: (prop) => prop !== 'size',
})<BaseSkeletonProps>(({ theme, color = 'default' }) => ({
  transform: 'none',
  borderRadius: theme.shape.buttonBorderRadius,
  backgroundColor:
    color === 'default'
      ? (theme.vars || theme).palette.surface1.main
      : (theme.vars || theme).palette.grey[100],
  ...theme.applyStyles('light', {
    backgroundColor:
      color === 'default'
        ? (theme.vars || theme).palette.surface2.main
        : (theme.vars || theme).palette.grey[100],
  }),
  variants: [
    {
      props: ({ size }) => size === BadgeSize.SM,
      style: {
        height: 24,
        width: 48,
      },
    },
    {
      props: ({ size }) => size === BadgeSize.MD,
      style: {
        height: 32,
        width: 56,
      },
    },
    {
      props: ({ size }) => size === BadgeSize.LG,
      style: {
        height: 40,
        width: 64,
      },
    },
    {
      props: ({ size }) => size === BadgeSize.XL,
      style: {
        height: 48,
        width: 72,
      },
    },
  ],
}));
