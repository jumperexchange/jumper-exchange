import Box, { BoxProps } from '@mui/material/Box';
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

interface StyledBadgeProps extends BoxProps {
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
    pointerEvents: 'inherit',
    cursor: 'pointer',
    variants: [
      {
        props: ({ size }) => size === BadgeSize.SM,
        style: {
          height: 24,
          padding: theme.spacing(0.5, 1),
          '& > p': {
            fontSize: 10,
            lineHeight: '140%',
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
          padding: theme.spacing(1, 1),
          '& > p': {
            fontSize: theme.typography.bodyXSmall.fontSize,
            lineHeight: theme.typography.bodyXSmall.lineHeight,
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
          padding: theme.spacing(1.25, 1),
          '& > p': {
            fontSize: theme.typography.bodySmall.fontSize,
            lineHeight: theme.typography.bodySmall.lineHeight,
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
          padding: theme.spacing(1.75, 1),
          '& > p': {
            fontSize: theme.typography.bodyMedium.fontSize,
            lineHeight: theme.typography.bodyMedium.lineHeight,
          },
          '& > svg': {
            fontSize: 28,
          },
        },
      },
      {
        props: ({ variant }) => variant === BadgeVariant.Default,
        style: {
          pointerEvents: 'none',
          backgroundColor: (theme.vars || theme).palette.surface1.main,
          color: (theme.vars || theme).palette.alphaLight900.main,
          ...theme.applyStyles('light', {
            color: (theme.vars || theme).palette.alphaDark900.main,
          }),
        },
      },
      {
        props: ({ variant }) => variant === BadgeVariant.Success,
        style: {
          backgroundColor: (theme.vars || theme).palette.mint[500],
          color: (theme.vars || theme).palette.mint[100],
          ...theme.applyStyles('light', {
            backgroundColor: (theme.vars || theme).palette.mint[100],
            color: (theme.vars || theme).palette.mint[500],
          }),
        },
      },
      {
        props: ({ variant }) => variant === BadgeVariant.Error,
        style: {
          backgroundColor: (theme.vars || theme).palette.scarlet[500],
          color: (theme.vars || theme).palette.scarlet[100],
          ...theme.applyStyles('light', {
            backgroundColor: (theme.vars || theme).palette.scarlet[100],
            color: (theme.vars || theme).palette.scarlet[500],
          }),
        },
      },
      {
        props: ({ variant }) => variant === BadgeVariant.Warning,
        style: {
          backgroundColor: (theme.vars || theme).palette.amber[800],
          color: (theme.vars || theme).palette.amber[600],
          ...theme.applyStyles('light', {
            backgroundColor: (theme.vars || theme).palette.amber[100],
            color: (theme.vars || theme).palette.amber[500],
          }),
        },
      },
      {
        props: ({ variant }) => variant === BadgeVariant.Alpha,
        style: {
          backgroundColor: (theme.vars || theme).palette.alphaLight100.main,
          color: (theme.vars || theme).palette.alphaLight900.main,
          ...theme.applyStyles('light', {
            backgroundColor: (theme.vars || theme).palette.alphaDark100.main,
            color: (theme.vars || theme).palette.alphaDark900.main,
          }),
        },
      },
      {
        props: ({ variant }) => variant === BadgeVariant.Disabled,
        style: {
          cursor: 'default',
          backgroundColor: (theme.vars || theme).palette.alphaLight100.main,
          color: (theme.vars || theme).palette.alphaLight600.main,
          ...theme.applyStyles('light', {
            backgroundColor: (theme.vars || theme).palette.alphaDark100.main,
            color: (theme.vars || theme).palette.alphaDark600.main,
          }),
        },
      },
      {
        props: ({ variant }) => variant === BadgeVariant.Primary,
        style: {
          backgroundColor: (theme.vars || theme).palette.accent1Alt.main,
          color: (theme.vars || theme).palette.white.main,
        },
      },
      {
        props: ({ variant }) => variant === BadgeVariant.Secondary,
        style: {
          backgroundColor: (theme.vars || theme).palette.primary.main,
          color: (theme.vars || theme).palette.accent1Alt.main,
          ...theme.applyStyles('light', {
            backgroundColor: (theme.vars || theme).palette.lavenderLight[400],
            color: (theme.vars || theme).palette.lavenderDark[0],
          }),
        },
      },
      {
        props: ({ variant }) => variant === BadgeVariant.Tertiary,
        style: {
          backgroundColor: (theme.vars || theme).palette.accent2.main, //@TODO this needs to be updated in the designs
          color: (theme.vars || theme).palette.accent2.main,
          ...theme.applyStyles('light', {
            backgroundColor: (theme.vars || theme).palette.orchid[200],
            color: (theme.vars || theme).palette.orchid[800],
          }),
        },
      },
    ],
  };
});

export const StyledBadgeLabel = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightBold,
  padding: theme.spacing(0.1, 0.5),
}));
