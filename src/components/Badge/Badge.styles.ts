import { CSSObject, styled } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';
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
})<StyledBadgeProps>(({
  theme,
  variant = BadgeVariant.Default,
  size = BadgeSize.SM,
  onClick,
}) => {
  const variantStyles: Record<BadgeVariant, CSSObject> = {
    default: {
      backgroundColor: (theme.vars || theme).palette.surface1.main,
      color: (theme.vars || theme).palette.alphaLight900.main,
      ...theme.applyStyles('light', {
        color: (theme.vars || theme).palette.alphaDark900.main,
      }),
    },
    success: {
      backgroundColor: (theme.vars || theme).palette.mint[500],
      color: (theme.vars || theme).palette.mint[100],
      ...theme.applyStyles('light', {
        backgroundColor: (theme.vars || theme).palette.mint[100],
        color: (theme.vars || theme).palette.mint[500],
      }),
    },
    error: {
      backgroundColor: (theme.vars || theme).palette.scarlet[500],
      color: (theme.vars || theme).palette.scarlet[100],
      ...theme.applyStyles('light', {
        backgroundColor: (theme.vars || theme).palette.scarlet[100],
        color: (theme.vars || theme).palette.scarlet[500],
      }),
    },
    warning: {
      backgroundColor: (theme.vars || theme).palette.amber[800],
      color: (theme.vars || theme).palette.amber[600],
      ...theme.applyStyles('light', {
        backgroundColor: (theme.vars || theme).palette.amber[100],
        color: (theme.vars || theme).palette.amber[500],
      }),
    },
    alpha: {
      backgroundColor: (theme.vars || theme).palette.alphaLight100.main,
      color: (theme.vars || theme).palette.alphaLight900.main,
      ...theme.applyStyles('light', {
        backgroundColor: (theme.vars || theme).palette.alphaDark100.main,
        color: (theme.vars || theme).palette.alphaDark900.main,
      }),
    },
    disabled: {
      backgroundColor: (theme.vars || theme).palette.alphaLight100.main,
      color: (theme.vars || theme).palette.alphaLight600.main,
      ...theme.applyStyles('light', {
        backgroundColor: (theme.vars || theme).palette.alphaDark100.main,
        color: (theme.vars || theme).palette.alphaDark600.main,
      }),
    },
    primary: {
      backgroundColor: (theme.vars || theme).palette.accent1Alt.main,
      color: (theme.vars || theme).palette.white.main,
    },
    secondary: {
      backgroundColor: (theme.vars || theme).palette.primary.main,
      color: (theme.vars || theme).palette.accent1Alt.main,
      ...theme.applyStyles('light', {
        backgroundColor: '#F0E5FF', //@TODO this needs to be aligned based on the lavender color
        color: '#30007A', //@TODO this needs to be aligned based on the lavender color
      }),
    },
    tertiary: {
      backgroundColor: (theme.vars || theme).palette.accent2.main, //@TODO this needs to be updated in the designs
      color: (theme.vars || theme).palette.accent2.main,
      ...theme.applyStyles('light', {
        backgroundColor: (theme.vars || theme).palette.orchid[200],
        color: (theme.vars || theme).palette.orchid[800],
      }),
    },
  };

  const sizeStyles: Record<BadgeSize, CSSObject> = {
    sm: {
      padding: theme.spacing(0.5, 1),
      '& > p': {
        fontSize: 10,
        lineHeight: '140%',
      },
      '& > svg': {
        fontSize: 12,
      },
    },
    md: {
      padding: theme.spacing(1, 1),
      '& > p': {
        fontSize: theme.typography.bodyXSmall.fontSize,
        lineHeight: theme.typography.bodyXSmall.lineHeight,
      },
      '& > svg': {
        fontSize: 16,
      },
    },
    lg: {
      padding: theme.spacing(1.25, 1),
      '& > p': {
        fontSize: theme.typography.bodySmall.fontSize,
        lineHeight: theme.typography.bodySmall.lineHeight,
      },
      '& > svg': {
        fontSize: 20,
      },
    },
    xl: {
      padding: theme.spacing(1.75, 1),
      '& > p': {
        fontSize: theme.typography.bodyMedium.fontSize,
        lineHeight: theme.typography.bodyMedium.lineHeight,
      },
      '& > svg': {
        fontSize: 28,
      },
    },
  };

  return {
    borderRadius: theme.shape.buttonBorderRadius,
    width: 'fit-content',
    display: 'flex',
    alignItems: 'center',
    pointerEvents: variant === 'disabled' ? 'none' : 'inherit',
    cursor: !!onClick && variant !== 'disabled' ? 'pointer' : 'default',
    ...variantStyles[variant],
    ...sizeStyles[size],
  };
});

export const StyledBadgeLabel = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightBold,
  padding: theme.spacing(0.1, 0.5),
}));
