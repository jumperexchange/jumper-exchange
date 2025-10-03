import Box, { BoxProps } from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { ButtonProps } from 'src/components/Button';
import { ButtonPrimary } from 'src/components/Button';

interface DepositButtonIconWrapperProps extends BoxProps {
  size: ButtonProps['size'];
}

export const DepositButtonIconWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'size',
})<DepositButtonIconWrapperProps>(({ size }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  variants: [
    {
      props: ({ size }) => size === 'small',
      style: {
        height: 20,
        width: 20,
        '& svg': { width: 16, height: 16 },
      },
    },
    {
      props: ({ size }) => size === 'medium',
      style: {
        height: 24,
        width: 24,
        '& svg': { width: 22, height: 22 },
      },
    },
    {
      props: ({ size }) => size === 'large',
      style: {
        height: 28,
        width: 28,
        '& svg': { width: 28, height: 28 },
      },
    },
  ],
}));

export const DepositButtonContentWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
}));

interface DepositButtonLabelWrapperProps extends BoxProps {
  size: ButtonProps['size'];
}

export const DepositButtonLabelWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'size',
})<DepositButtonLabelWrapperProps>(({ theme }) => ({
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

export const DepositButtonPrimary = styled(ButtonPrimary)(({ theme }) => ({
  minWidth: 'auto',
  height: 'fit-content',
  borderRadius: theme.shape.buttonBorderRadius,
  '&:disabled': {
    backgroundColor: (theme.vars || theme).palette.buttonDisabledBg,
    color: (theme.vars || theme).palette.buttonDisabledAction,
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
