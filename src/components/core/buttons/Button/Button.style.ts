'use client';

import MuiButton from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { Variant as ButtonVariant, Size as ButtonSize } from '../types';

interface StyledButtonProps {
  buttonVariant: ButtonVariant;
  buttonSize: ButtonSize;
}

export const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) =>
    !['buttonVariant', 'buttonSize'].includes(prop as string),
})<StyledButtonProps>(({ theme, fullWidth }) => ({
  minHeight: 'auto',
  minWidth: 'auto',
  height: 'auto',
  width: fullWidth ? '100%' : 'auto',
  borderRadius: theme.shape.buttonBorderRadius,
  transition: theme.transitions.create(
    ['background-color', 'color', 'box-shadow'],
    {
      duration: 250,
      easing: theme.transitions.easing.easeInOut,
    },
  ),
  textTransform: 'none',
  letterSpacing: 0,
  '& .MuiButton-loadingIndicator': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  '&:disabled, &.Mui-disabled': {
    pointerEvents: 'none',
    color: (theme.vars || theme).palette.buttonDisabledAction,
    backgroundColor: (theme.vars || theme).palette.buttonDisabledBg,
  },
  variants: [
    {
      props: { buttonVariant: ButtonVariant.Default },
      style: {
        color: (theme.vars || theme).palette.buttonLightAction,
        backgroundColor: (theme.vars || theme).palette.buttonLightBg,
        '&:hover, &:focus-visible': {
          backgroundColor: `color-mix(in srgb, ${(theme.vars || theme).palette.buttonLightBg} ${(1 - theme.palette.action.hoverOpacity) * 100}%, black 10%)`,
        },
        '&:active, &:focus-visible:active': {
          backgroundColor: `color-mix(in srgb, ${(theme.vars || theme).palette.buttonLightBg} ${(1 - theme.palette.action.activatedOpacity) * 100}%, black 10%)`,
        },
      },
    },
    {
      props: { buttonVariant: ButtonVariant.Primary },
      style: {
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
    {
      props: { buttonVariant: ButtonVariant.Secondary },
      style: {
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
    {
      props: { buttonVariant: ButtonVariant.AlphaLight },
      style: {
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
    {
      props: { buttonVariant: ButtonVariant.AlphaDark },
      style: {
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
    {
      props: { buttonVariant: ButtonVariant.LightBorder },
      style: {
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
    {
      props: { buttonVariant: ButtonVariant.Disabled },
      style: {
        color: (theme.vars || theme).palette.buttonDisabledAction,
        backgroundColor: (theme.vars || theme).palette.buttonDisabledBg,
      },
    },
    {
      props: { buttonVariant: ButtonVariant.Borderless },
      style: {
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
    {
      props: { buttonVariant: ButtonVariant.Success },
      style: {
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
    {
      props: { buttonSize: ButtonSize.XS },
      style: {
        padding: theme.spacing(0.5),
        '& .MuiButton-buttonLabel': {
          fontSize: theme.typography.bodyXXSmallStrong.fontSize,
          lineHeight: theme.typography.bodyXXSmallStrong.lineHeight,
          fontWeight: theme.typography.bodyXXSmallStrong.fontWeight,
        },
        '& svg:not(.MuiCircularProgress-svg)': {
          width: theme.typography.bodyXXSmallStrong.lineHeight,
          height: theme.typography.bodyXXSmallStrong.lineHeight,
        },
        '& .MuiCircularProgress-root': {
          width: `${theme.typography.bodyXXSmallStrong.lineHeight} !important`,
          height: `${theme.typography.bodyXXSmallStrong.lineHeight} !important`,
        },
        '& :not(svg):not(.MuiTouchRipple-root)': {
          //   height: theme.spacing(3),
        },
        '& > :nth-child(1 of :not(.MuiTouchRipple-root):not(.MuiButton-loadingWrapper))':
          {
            marginLeft: theme.spacing(0),
          },
        '& > :nth-last-child(1 of :not(.MuiTouchRipple-root):not(.MuiButton-loadingWrapper))':
          {
            marginRight: theme.spacing(0),
          },
      },
    },
    {
      props: { buttonSize: ButtonSize.XS, loadingPosition: 'start' },
      style: {
        '&:not(.MuiButton-fullWidth) .MuiButton-loadingIndicator': {
          left: theme.spacing(0.5 + 0.5),
          right: 'auto',
        },
      },
    },
    {
      props: { buttonSize: ButtonSize.XS, loadingPosition: 'end' },
      style: {
        '&:not(.MuiButton-fullWidth) .MuiButton-loadingIndicator': {
          left: 'auto',
          right: theme.spacing(0.5 + 0.5),
        },
      },
    },
    {
      props: { buttonSize: ButtonSize.XS, loadingPosition: 'center' },
      style: {
        '&:not(.MuiButton-fullWidth) .MuiButton-loadingIndicator': {
          left: '50%',
          right: 'auto',
          transform: 'translateX(-50%)',
        },
      },
    },
    {
      props: { buttonSize: ButtonSize.SM },
      style: {
        padding: theme.spacing(0.5),
        '& .MuiButton-buttonLabel': {
          fontSize: theme.typography.bodyXSmallStrong.fontSize,
          lineHeight: theme.typography.bodyXSmallStrong.lineHeight,
          fontWeight: theme.typography.bodyXSmallStrong.fontWeight,
        },
        '& svg:not(.MuiCircularProgress-svg)': {
          width: theme.typography.bodyXSmallStrong.lineHeight,
          height: theme.typography.bodyXSmallStrong.lineHeight,
        },
        '& .MuiCircularProgress-root': {
          width: `${theme.typography.bodyXSmallStrong.lineHeight} !important`,
          height: `${theme.typography.bodyXSmallStrong.lineHeight} !important`,
        },
        '& :not(svg):not(.MuiTouchRipple-root)': {
          //   height: theme.spacing(3),
        },
        '& > :nth-child(1 of :not(.MuiTouchRipple-root):not(.MuiButton-loadingWrapper))':
          {
            marginLeft: theme.spacing(0),
          },
        '& > :nth-last-child(1 of :not(.MuiTouchRipple-root):not(.MuiButton-loadingWrapper))':
          {
            marginRight: theme.spacing(0),
          },
      },
    },
    {
      props: { buttonSize: ButtonSize.SM, loadingPosition: 'start' },
      style: {
        '&:not(.MuiButton-fullWidth) .MuiButton-loadingIndicator': {
          left: theme.spacing(0.5 + 0.5),
          right: 'auto',
        },
      },
    },
    {
      props: { buttonSize: ButtonSize.SM, loadingPosition: 'end' },
      style: {
        '&:not(.MuiButton-fullWidth) .MuiButton-loadingIndicator': {
          left: 'auto',
          right: theme.spacing(0.5 + 0.5),
        },
      },
    },
    {
      props: { buttonSize: ButtonSize.SM, loadingPosition: 'center' },
      style: {
        '&:not(.MuiButton-fullWidth) .MuiButton-loadingIndicator': {
          left: '50%',
          right: 'auto',
          transform: 'translateX(-50%)',
        },
      },
    },
    {
      props: { buttonSize: ButtonSize.MD },
      style: {
        padding: theme.spacing(0.75),
        '& .MuiButton-buttonLabel': {
          fontSize: theme.typography.bodySmallStrong.fontSize,
          lineHeight: theme.typography.bodySmallStrong.lineHeight,
          fontWeight: theme.typography.bodySmallStrong.fontWeight,
        },
        '& svg:not(.MuiCircularProgress-svg)': {
          width: theme.typography.bodySmallStrong.lineHeight,
          height: theme.typography.bodySmallStrong.lineHeight,
        },
        '& .MuiCircularProgress-root': {
          width: `${theme.typography.bodySmallStrong.lineHeight} !important`,
          height: `${theme.typography.bodySmallStrong.lineHeight} !important`,
        },
        '& > :not(svg):not(.MuiTouchRipple-root)': {
          height: theme.spacing(3.5),
        },
        '& > :nth-child(1 of :not(.MuiTouchRipple-root):not(.MuiButton-loadingWrapper))':
          {
            marginLeft: theme.spacing(0.25),
          },
        '& > :nth-last-child(1 of :not(.MuiTouchRipple-root):not(.MuiButton-loadingWrapper))':
          {
            marginRight: theme.spacing(0.25),
          },
      },
    },
    {
      props: { buttonSize: ButtonSize.MD, loadingPosition: 'start' },
      style: {
        '&:not(.MuiButton-fullWidth) .MuiButton-loadingIndicator': {
          left: theme.spacing(0.75 + 0.5),
          right: 'auto',
        },
      },
    },
    {
      props: { buttonSize: ButtonSize.MD, loadingPosition: 'end' },
      style: {
        '&:not(.MuiButton-fullWidth) .MuiButton-loadingIndicator': {
          left: 'auto',
          right: theme.spacing(0.75 + 0.5),
        },
      },
    },
    {
      props: { buttonSize: ButtonSize.MD, loadingPosition: 'center' },
      style: {
        '&:not(.MuiButton-fullWidth) .MuiButton-loadingIndicator': {
          left: '50%',
          right: 'auto',
          transform: 'translateX(-50%)',
        },
      },
    },
    {
      props: { buttonSize: ButtonSize.LG },
      style: {
        padding: theme.spacing(1),
        '& .MuiButton-buttonLabel': {
          fontSize: theme.typography.bodyMediumStrong.fontSize,
          lineHeight: theme.typography.bodyMediumStrong.lineHeight,
          fontWeight: theme.typography.bodyMediumStrong.fontWeight,
        },
        '& svg:not(.MuiCircularProgress-svg)': {
          width: theme.typography.bodyMediumStrong.lineHeight,
          height: theme.typography.bodyMediumStrong.lineHeight,
        },
        '& .MuiCircularProgress-root': {
          width: `${theme.typography.bodyMediumStrong.lineHeight} !important`,
          height: `${theme.typography.bodyMediumStrong.lineHeight} !important`,
        },
        '& > :not(svg):not(.MuiTouchRipple-root)': {
          height: theme.spacing(4),
        },
        '& > :nth-child(1 of :not(.MuiTouchRipple-root):not(.MuiButton-loadingWrapper))':
          {
            marginLeft: theme.spacing(0.25),
          },
        '& > :nth-last-child(1 of :not(.MuiTouchRipple-root):not(.MuiButton-loadingWrapper))':
          {
            marginRight: theme.spacing(0.25),
          },
      },
    },
    {
      props: { buttonSize: ButtonSize.LG, loadingPosition: 'start' },
      style: {
        '&:not(.MuiButton-fullWidth) .MuiButton-loadingIndicator': {
          left: theme.spacing(1 + 0.5),
          right: 'auto',
        },
      },
    },
    {
      props: { buttonSize: ButtonSize.LG, loadingPosition: 'end' },
      style: {
        '&:not(.MuiButton-fullWidth) .MuiButton-loadingIndicator': {
          left: 'auto',
          right: theme.spacing(1 + 0.5),
        },
      },
    },
    {
      props: { buttonSize: ButtonSize.LG, loadingPosition: 'center' },
      style: {
        '&:not(.MuiButton-fullWidth) .MuiButton-loadingIndicator': {
          left: '50%',
          right: 'auto',
          transform: 'translateX(-50%)',
        },
      },
    },
    {
      props: { buttonSize: ButtonSize.XL },
      style: {
        padding: theme.spacing(1.5),
        '& .MuiButton-buttonLabel': {
          fontSize: theme.typography.bodyLargeStrong.fontSize,
          lineHeight: theme.typography.bodyLargeStrong.lineHeight,
          fontWeight: theme.typography.bodyLargeStrong.fontWeight,
        },
        '& svg:not(.MuiCircularProgress-svg)': {
          width: theme.typography.bodyLargeStrong.lineHeight,
          height: theme.typography.bodyLargeStrong.lineHeight,
        },
        '& .MuiCircularProgress-root': {
          width: `${theme.typography.bodyLargeStrong.lineHeight} !important`,
          height: `${theme.typography.bodyLargeStrong.lineHeight} !important`,
        },
        '& > :not(svg):not(.MuiTouchRipple-root)': {
          height: theme.spacing(4),
        },
        '& > :nth-child(1 of :not(.MuiTouchRipple-root):not(.MuiButton-loadingWrapper))':
          {
            marginLeft: theme.spacing(0.25),
          },
        '& > :nth-last-child(1 of :not(.MuiTouchRipple-root):not(.MuiButton-loadingWrapper))':
          {
            marginRight: theme.spacing(0.25),
          },
      },
    },
    {
      props: { buttonSize: ButtonSize.XL, loadingPosition: 'start' },
      style: {
        '&:not(.MuiButton-fullWidth) .MuiButton-loadingIndicator': {
          left: theme.spacing(1.5 + 0.5),
          right: 'auto',
        },
      },
    },
    {
      props: { buttonSize: ButtonSize.XL, loadingPosition: 'end' },
      style: {
        '&:not(.MuiButton-fullWidth) .MuiButton-loadingIndicator': {
          left: 'auto',
          right: theme.spacing(1.5 + 0.5),
        },
      },
    },
    {
      props: { buttonSize: ButtonSize.XL, loadingPosition: 'center' },
      style: {
        '&:not(.MuiButton-fullWidth) .MuiButton-loadingIndicator': {
          left: '50%',
          right: 'auto',
          transform: 'translateX(-50%)',
        },
      },
    },
  ],
}));

interface ButtonLabelProps {
  buttonSize: ButtonSize;
}

export const ButtonLabel = styled('span', {
  shouldForwardProp: (prop) => prop !== 'buttonSize',
})<ButtonLabelProps>(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  variants: [
    {
      props: { buttonSize: ButtonSize.SM },
      style: {
        padding: theme.spacing(0.25, 0.5),
      },
    },
    {
      props: { buttonSize: ButtonSize.MD },
      style: {
        padding: theme.spacing(0.5, 1),
      },
    },
    {
      props: { buttonSize: ButtonSize.LG },
      style: {
        padding: theme.spacing(0.5, 1.5),
      },
    },
    {
      props: { buttonSize: ButtonSize.XL },
      style: {
        padding: theme.spacing(0.5, 1.5),
      },
    },
  ],
}));
