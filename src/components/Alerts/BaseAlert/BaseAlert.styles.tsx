import { CSSObject, styled } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export type BaseAlertVariant =
  | 'default'
  | 'info'
  | 'warning'
  | 'error'
  | 'hint';

interface StyledBaseAlertProps extends BoxProps {
  variant?: BaseAlertVariant;
}

export const StyledBaseAlert = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'variant',
})<StyledBaseAlertProps>(({ theme, variant = 'default' }) => {
  const variantStyles: Record<BaseAlertVariant, CSSObject> = {
    default: {
      padding: theme.spacing(2),
      backgroundColor: (theme.vars || theme).palette.azure[800],
      color: (theme.vars || theme).palette.azure[400],
      ...theme.applyStyles('light', {
        backgroundColor: (theme.vars || theme).palette.azure[100],
        color: (theme.vars || theme).palette.azure[500],
      }),
    },
    info: {
      padding: theme.spacing(2),
      backgroundColor: (theme.vars || theme).palette.alphaLight100.main,
      color: (theme.vars || theme).palette.text.primary,
      ...theme.applyStyles('light', {
        backgroundColor: (theme.vars || theme).palette.alphaDark100.main,
      }),
    },
    error: {
      padding: theme.spacing(2),
      backgroundColor: (theme.vars || theme).palette.scarlet[500],
      color: (theme.vars || theme).palette.scarlet[100],
      ...theme.applyStyles('light', {
        backgroundColor: (theme.vars || theme).palette.scarlet[100],
        color: (theme.vars || theme).palette.scarlet[500],
      }),
    },
    warning: {
      padding: theme.spacing(2),
      backgroundColor: (theme.vars || theme).palette.amber[800],
      color: (theme.vars || theme).palette.amber[600],
      ...theme.applyStyles('light', {
        backgroundColor: (theme.vars || theme).palette.amber[100],
        color: (theme.vars || theme).palette.amber[500],
      }),
    },
    hint: {
      color: (theme.vars || theme).palette.alphaLight800.main,
      ...theme.applyStyles('light', {
        color: (theme.vars || theme).palette.alphaDark800.main,
      }),
    },
  };

  return {
    borderRadius: theme.shape.borderRadius,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    ...variantStyles[variant],
  };
});

export const StyledBaseAlertHeader = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
}));

export const StyledBaseAlertTitle = styled(Typography)(({ theme }) => ({
  width: '100%',
  ...theme.typography.title2XSmall,
}));

export const StyledBaseAlertDescription = styled(Typography)(({ theme }) => ({
  width: '100%',
  ...theme.typography.bodySmall,
  color: (theme.vars || theme).palette.alphaLight900.main,
  ...theme.applyStyles('light', {
    color: (theme.vars || theme).palette.alphaDark900.main,
  }),
}));
