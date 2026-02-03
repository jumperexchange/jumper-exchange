'use client';

import MuiIconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { Variant as IconButtonVariant, Size as IconButtonSize } from '../types';

interface StyledIconButtonProps {
  buttonVariant: IconButtonVariant;
  buttonSize: IconButtonSize;
}

export const StyledIconButton = styled(MuiIconButton, {
  shouldForwardProp: (prop) =>
    !['buttonVariant', 'buttonSize'].includes(prop as string),
})<StyledIconButtonProps>(({ theme }) => ({
  borderRadius: '50%',
  transition: theme.transitions.create(
    ['background-color', 'color', 'box-shadow'],
    {
      duration: 250,
      easing: theme.transitions.easing.easeInOut,
    },
  ),
  '&:disabled, &.MuiButtonBase-root.MuiIconButton-root.Mui-disabled': {
    pointerEvents: 'none',
    color: (theme.vars || theme).palette.buttonDisabledAction,
    backgroundColor: (theme.vars || theme).palette.buttonDisabledBg,
  },
  '& .MuiIconButton-loadingIndicator': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'inherit',
  },
  '&.MuiIconButton-loading .MuiSvgIcon-root': {
    visibility: 'hidden',
  },
  variants: [
    {
      props: { buttonVariant: IconButtonVariant.Default },
      style: {
        '&.MuiButtonBase-root.MuiIconButton-root': {
          color: (theme.vars || theme).palette.buttonLightAction,
          backgroundColor: (theme.vars || theme).palette.buttonLightBg,
          '&:hover, &:focus-visible': {
            backgroundColor: `color-mix(in srgb, ${(theme.vars || theme).palette.buttonLightBg} ${(1 - theme.palette.action.hoverOpacity) * 100}%, black)`,
          },
          '&:active, &:focus-visible:active': {
            backgroundColor: `color-mix(in srgb, ${(theme.vars || theme).palette.buttonLightBg} ${(1 - theme.palette.action.activatedOpacity) * 100}%, black)`,
          },
        },
      },
    },
    {
      props: { buttonVariant: IconButtonVariant.Primary },
      style: {
        '&.MuiButtonBase-root.MuiIconButton-root': {
          color: (theme.vars || theme).palette.buttonPrimaryAction,
          backgroundColor: (theme.vars || theme).palette.buttonPrimaryBg,
          '&:hover, &:focus-visible': {
            backgroundColor: `color-mix(in srgb, ${(theme.vars || theme).palette.buttonPrimaryBg} ${(1 - theme.palette.action.hoverOpacity) * 100}%, black 10%)`,
          },
          '&:active, &:focus-visible:active': {
            backgroundColor: `color-mix(in srgb, ${(theme.vars || theme).palette.buttonPrimaryBg} ${(1 - theme.palette.action.activatedOpacity) * 100}%, black 10%)`,
          },
        },
      },
    },
    {
      props: { buttonVariant: IconButtonVariant.Secondary },
      style: {
        '&.MuiButtonBase-root.MuiIconButton-root': {
          color: (theme.vars || theme).palette.buttonSecondaryAction,
          backgroundColor: (theme.vars || theme).palette.buttonSecondaryBg,
          '&:hover, &:focus-visible': {
            backgroundColor: `color-mix(in srgb, ${(theme.vars || theme).palette.buttonSecondaryBg} ${(1 - theme.palette.action.hoverOpacity) * 100}%, black 10%)`,
          },
          '&:active, &:focus-visible:active': {
            backgroundColor: `color-mix(in srgb, ${(theme.vars || theme).palette.buttonSecondaryBg} ${(1 - theme.palette.action.activatedOpacity) * 100}%, black 10%)`,
          },
        },
      },
    },
    {
      props: { buttonVariant: IconButtonVariant.AlphaLight },
      style: {
        '&.MuiButtonBase-root.MuiIconButton-root': {
          color: (theme.vars || theme).palette.buttonActiveAction,
          backgroundColor: (theme.vars || theme).palette.buttonAlphaLightBg,
          '&:hover, &:focus-visible': {
            backgroundColor: `color-mix(in srgb, ${(theme.vars || theme).palette.buttonAlphaLightBg} ${(1 - theme.palette.action.hoverOpacity) * 100}%, black 10%)`,
          },
          '&:active, &:focus-visible:active': {
            backgroundColor: `color-mix(in srgb, ${(theme.vars || theme).palette.buttonAlphaLightBg} ${(1 - theme.palette.action.activatedOpacity) * 100}%, black 10%)`,
          },
          ...theme.applyStyles('light', {
            color: (theme.vars || theme).palette.buttonAlphaLightAction,
          }),
        },
      },
    },
    {
      props: { buttonVariant: IconButtonVariant.AlphaDark },
      style: {
        '&.MuiButtonBase-root.MuiIconButton-root': {
          color: (theme.vars || theme).palette.buttonAlphaDarkAction,
          backgroundColor: (theme.vars || theme).palette.buttonAlphaDarkBg,
          '&:hover, &:focus-visible': {
            backgroundColor: `color-mix(in srgb, ${(theme.vars || theme).palette.buttonAlphaDarkBg} ${(1 - theme.palette.action.hoverOpacity) * 100}%, black 10%)`,
          },
          '&:active, &:focus-visible:active': {
            backgroundColor: `color-mix(in srgb, ${(theme.vars || theme).palette.buttonAlphaDarkBg} ${(1 - theme.palette.action.activatedOpacity) * 100}%, black 10%)`,
          },
        },
      },
    },
    {
      props: { buttonVariant: IconButtonVariant.LightBorder },
      style: {
        '&.MuiButtonBase-root.MuiIconButton-root': {
          color: (theme.vars || theme).palette.buttonLightAction,
          backgroundColor: (theme.vars || theme).palette.buttonLightBg,
          border: `1px solid ${(theme.vars || theme).palette.border}`,
          '&:hover, &:focus-visible': {
            backgroundColor: `color-mix(in srgb, ${(theme.vars || theme).palette.buttonLightBg} ${(1 - theme.palette.action.hoverOpacity) * 100}%, black 10%)`,
            border: `1px solid ${(theme.vars || theme).palette.borderActive}`,
          },
          '&:active, &:focus-visible:active': {
            backgroundColor: `color-mix(in srgb, ${(theme.vars || theme).palette.buttonLightBg} ${(1 - theme.palette.action.activatedOpacity) * 100}%, black 10%)`,
            border: `1px solid ${(theme.vars || theme).palette.borderActive}`,
          },
        },
      },
    },
    {
      props: { buttonVariant: IconButtonVariant.Disabled },
      style: {
        '&.MuiButtonBase-root.MuiIconButton-root': {
          color: (theme.vars || theme).palette.buttonDisabledAction,
          backgroundColor: (theme.vars || theme).palette.buttonDisabledBg,
        },
      },
    },
    {
      props: { buttonVariant: IconButtonVariant.Borderless },
      style: {
        '&.MuiButtonBase-root.MuiIconButton-root': {
          color: (theme.vars || theme).palette.text.primary,
          backgroundColor: 'transparent',
          '&:hover, &:focus-visible': {
            color: (theme.vars || theme).palette.buttonLightAction,
            backgroundColor: (theme.vars || theme).palette.buttonLightBg,
          },
          '&:active, &:focus-visible:active': {
            color: (theme.vars || theme).palette.buttonLightAction,
            backgroundColor: (theme.vars || theme).palette.buttonLightBg,
          },
          ...theme.applyStyles('light', {
            color: (theme.vars || theme).palette.buttonLightAction,
          }),
        },
      },
    },
    {
      props: { buttonVariant: IconButtonVariant.Success },
      style: {
        '&.MuiButtonBase-root.MuiIconButton-root': {
          color: (theme.vars || theme).palette.statusSuccessFg,
          backgroundColor: (theme.vars || theme).palette.statusSuccessBg,
          '&:hover, &:focus-visible': {
            backgroundColor: `color-mix(in srgb, ${(theme.vars || theme).palette.statusSuccessBg} ${(1 - theme.palette.action.hoverOpacity) * 100}%, black 10%)`,
          },
          '&:active, &:focus-visible:active': {
            backgroundColor: `color-mix(in srgb, ${(theme.vars || theme).palette.statusSuccessBg} ${(1 - theme.palette.action.activatedOpacity) * 100}%, black 10%)`,
          },
        },
      },
    },
    {
      props: { buttonSize: IconButtonSize.XS },
      style: {
        padding: theme.spacing(0.375),
        '& svg:not(.MuiCircularProgress-svg)': {
          width: theme.spacing(1.25),
          height: theme.spacing(1.25),
        },
        '& .MuiCircularProgress-root': {
          width: `${theme.spacing(1.25)} !important`,
          height: `${theme.spacing(1.25)} !important`,
        },
      },
    },
    {
      props: { buttonSize: IconButtonSize.SM },
      style: {
        padding: theme.spacing(0.5),
        '& svg:not(.MuiCircularProgress-svg)': {
          width: theme.typography.bodyXSmallStrong.lineHeight,
          height: theme.typography.bodyXSmallStrong.lineHeight,
        },
        '& .MuiCircularProgress-root': {
          width: `${theme.typography.bodyXSmallStrong.lineHeight} !important`,
          height: `${theme.typography.bodyXSmallStrong.lineHeight} !important`,
        },
      },
    },
    {
      props: { buttonSize: IconButtonSize.MD },
      style: {
        padding: theme.spacing(0.75),
        '& svg:not(.MuiCircularProgress-svg)': {
          width: theme.typography.bodySmallStrong.lineHeight,
          height: theme.typography.bodySmallStrong.lineHeight,
        },
        '& .MuiCircularProgress-root': {
          width: `${theme.typography.bodySmallStrong.lineHeight} !important`,
          height: `${theme.typography.bodySmallStrong.lineHeight} !important`,
        },
      },
    },
    {
      props: { buttonSize: IconButtonSize.LG },
      style: {
        padding: theme.spacing(1),
        '& svg:not(.MuiCircularProgress-svg)': {
          width: theme.typography.bodyMediumStrong.lineHeight,
          height: theme.typography.bodyMediumStrong.lineHeight,
        },
        '& .MuiCircularProgress-root': {
          width: `${theme.typography.bodyMediumStrong.lineHeight} !important`,
          height: `${theme.typography.bodyMediumStrong.lineHeight} !important`,
        },
      },
    },
    {
      props: { buttonSize: IconButtonSize.XL },
      style: {
        padding: theme.spacing(1.25),
        '& svg:not(.MuiCircularProgress-svg)': {
          width: theme.typography.bodyLargeStrong.lineHeight,
          height: theme.typography.bodyLargeStrong.lineHeight,
        },
        '& .MuiCircularProgress-root': {
          width: `${theme.typography.bodyLargeStrong.lineHeight} !important`,
          height: `${theme.typography.bodyLargeStrong.lineHeight} !important`,
        },
      },
    },
  ],
}));
