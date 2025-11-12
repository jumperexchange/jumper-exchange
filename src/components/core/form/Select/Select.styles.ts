import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import { ButtonTertiary } from 'src/components/Button/Button.style';

interface BaseSizeProps {
  size?: 'small' | 'medium';
}

export const StyledSelect = styled(Select)(({ theme }) => ({
  '&.MuiSelect-root': {
    padding: 0,
    width: 'fit-content',
  },
  '&.MuiSelect-root .MuiSelect-select': {
    padding: '0 !important',
  },
  '&.MuiInput-underline:before': {
    display: 'none',
  },
  '&.MuiInput-underline:after': {
    display: 'none',
  },
}));

export const StyledSelectorContainer = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.buttonBorderRadius,
  background: (theme.vars || theme).palette.buttonAlphaDarkBg,
  color: (theme.vars || theme).palette.buttonAlphaDarkAction,
  padding: theme.spacing(0.75),
  cursor: 'pointer',
}));

export const StyledSelectorContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0.1, 0.25),
}));

export const StyledLabelContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'size',
})<BaseSizeProps>(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
  variants: [
    {
      props: ({ size }) => !size || size === 'small',
      style: {
        padding: theme.spacing(0.5, 1),
      },
    },
    {
      props: ({ size }) => size === 'medium',
      style: {
        padding: 0,
      },
    },
  ],
}));

export const StyledMenuItem = styled(MenuItem, {
  shouldForwardProp: (prop) => prop !== 'size',
})<BaseSizeProps>(({ theme, size }) => ({
  padding: theme.spacing(0.75),
  '&:hover': {
    backgroundColor: 'transparent',
  },
  '&.Mui-selected, &.Mui-selected:hover, &.Mui-selected:focus, &.Mui-selected:focus-within':
    {
      backgroundColor: 'transparent',
    },
  variants: [
    {
      props: ({ size }) => !size || size === 'small',
      style: {
        padding: theme.spacing(0.75),
      },
    },
    {
      props: ({ size }) => size === 'medium',
      style: {
        padding: theme.spacing(0.5, 0),
      },
    },
  ],
}));

export const StyledMenuItemContentContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'size',
})<BaseSizeProps>(({ theme, size }) => ({
  display: 'flex',
  alignItems: 'center',
  variants: [
    {
      props: ({ size }) => !size || size === 'small',
      style: {
        padding: theme.spacing(0.25),
      },
    },
    {
      props: ({ size }) => size === 'medium',
      style: {
        padding: 0,
        gap: theme.spacing(1.5),
      },
    },
  ],
}));

export const StyledMultiSelectFiltersContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'size',
})<BaseSizeProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(1),
  pointerEvents: 'none',
  '& > .MuiInputBase-root, & > .MuiButtonBase-root': {
    pointerEvents: 'auto',
  },
  variants: [
    {
      props: ({ size }) => !size || size === 'small',
      style: {
        height: 40,
        padding: theme.spacing(1),
      },
    },
    {
      props: ({ size }) => size === 'medium',
      style: {
        height: 48,
        padding: 0,
      },
    },
  ],
}));

export const StyledMultiSelectFiltersClearButton = styled(ButtonTertiary)(
  ({ theme }) => ({
    minWidth: 'unset',
    variants: [
      {
        props: ({ size }) => size === 'small',
        style: {
          height: theme.spacing(4),
          padding: theme.spacing(1, 1.2),
          fontSize: theme.typography.bodyXSmallStrong.fontSize,
          fontWeight: theme.typography.bodyXSmallStrong.fontWeight,
          lineHeight: theme.typography.bodyXSmallStrong.lineHeight,
        },
      },
      {
        props: ({ size }) => size === 'medium',
        style: {
          height: theme.spacing(5),
          padding: theme.spacing(1.375, 2),
          fontSize: theme.typography.bodySmallStrong.fontSize,
          fontWeight: theme.typography.bodySmallStrong.fontWeight,
          lineHeight: theme.typography.bodySmallStrong.lineHeight,
        },
      },
    ],
  }),
);

export const StyledMultiSelectFiltersInput = styled(InputBase, {
  shouldForwardProp: (prop) => prop !== 'size',
})<BaseSizeProps>(({ theme, size }) => ({
  width: '100%',
  padding: theme.spacing(1.25, 1.5),
  borderRadius: theme.shape.inputTextBorderRadius,
  backgroundColor: (theme.vars || theme).palette.alpha100.main,
  fontWeight: 500,
  gap: theme.spacing(0.75),
  '& svg': {
    color: (theme.vars || theme).palette.textHint,
    transition: 'color 0.2s ease-in-out',
  },
  '&:focus svg, &:focus-within svg, &:active svg': {
    color: (theme.vars || theme).palette.text.primary,
  },
  '& placeholder': {
    color: (theme.vars || theme).palette.textHint,
  },
  variants: [
    {
      props: ({ size }) => !size || size === 'small',
      style: {
        ...theme.typography.bodySmall,
        height: 40,
      },
    },
    {
      props: ({ size }) => size === 'medium',
      style: {
        ...theme.typography.bodyMedium,
        height: 48,
      },
    },
  ],
}));

export const StyledSliderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(1),
  width: '100%',
}));

export const StyledSlider = styled(Slider)(({ theme }) => ({
  width: `calc(100% - 1.5rem)`,
  // width: `calc(100% - 0.75rem)`,
  '& .MuiSlider-valueLabel': {
    display: 'none',
  },

  '&, & .MuiSlider-track, & .MuiSlider-rail': {
    height: theme.spacing(1),
    borderRadius: theme.shape.cardBorderRadius,
  },

  '& .MuiSlider-rail': {
    backgroundColor: (theme.vars || theme).palette.alpha200.main,
    margin: `0 -0.75rem`,
    width: `calc(100% + 1.5rem)`,
    // width: `calc(100% + 0.75rem)`,
  },

  '& .MuiSlider-thumb': {
    width: theme.spacing(3),
    height: theme.spacing(3),
    '&:hover, &:focus, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: `color-mix(in srgb, ${(theme.vars || theme).palette.accent1Alt.main} 24%, transparent) 0 0 0 4px`,
    },
  },
}));

export const StyledSliderRangeContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
}));
