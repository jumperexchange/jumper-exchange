import type { BoxProps } from '@mui/material/Box';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import type { ButtonProps } from 'src/components/Button';
import { ButtonTransparent } from 'src/components/Button';

export const WithdrawButtonContentWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
}));

interface WithdrawButtonLabelWrapperProps extends BoxProps {
  size: ButtonProps['size'];
}

export const WithdrawButtonLabelWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'size',
})<WithdrawButtonLabelWrapperProps>(({ theme }) => ({
  variants: [
    {
      props: ({ size }) => size === 'small',
      style: {
        padding: theme.spacing(0.25, 0.5),
        fontSize: theme.typography.bodyXSmallStrong.fontSize,
        lineHeight: theme.typography.bodyXSmallStrong.lineHeight,
      },
    },
    {
      props: ({ size }) => size === 'medium',
      style: {
        padding: theme.spacing(0.5, 1),
        fontSize: theme.typography.bodySmallStrong.fontSize,
        lineHeight: theme.typography.bodySmallStrong.lineHeight,
      },
    },
    {
      props: ({ size }) => size === 'large',
      style: {
        padding: theme.spacing(0.5, 1.5),
        fontSize: theme.typography.bodyMediumStrong.fontSize,
        lineHeight: theme.typography.bodyMediumStrong.lineHeight,
      },
    },
  ],
}));

export const WithdrawButtonPrimary = styled(ButtonTransparent)(({ theme }) => ({
  minWidth: 'auto',
  height: 'fit-content',
  flexShrink: 0,
  borderRadius: theme.shape.buttonBorderRadius,
  '&.MuiButtonBase-root': {
    '&:disabled': {
      color: (theme.vars || theme).palette.buttonDisabledAction,
      backgroundColor: (theme.vars || theme).palette.buttonDisabledBg,
    },
    color: (theme.vars || theme).palette.buttonAlphaDarkAction,
    backgroundColor: (theme.vars || theme).palette.buttonAlphaDarkBg,
  },
  variants: [
    {
      props: ({ size }) => size === 'small',
      style: {
        padding: theme.spacing(0.5),
        '& > .MuiBox-root': {
          padding: theme.spacing(0.25, 0),
          height: 24,
        },
      },
    },
    {
      props: ({ size }) => size === 'medium',
      style: {
        padding: theme.spacing(0.75),
        '& > .MuiBox-root': {
          padding: theme.spacing(0.125, 0.25),
          height: 28,
        },
      },
    },
    {
      props: ({ size }) => size === 'large',
      style: {
        padding: theme.spacing(1),
        '& > .MuiBox-root': {
          padding: theme.spacing(0.25),
          height: 32,
        },
      },
    },
  ],
}));
