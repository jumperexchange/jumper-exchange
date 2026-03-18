import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import { DayPicker } from 'react-day-picker';
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

export const StyledSelectorContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'disabled',
})<{ disabled?: boolean }>(({ theme, disabled }) => ({
  borderRadius: theme.shape.buttonBorderRadius,
  background: (theme.vars || theme).palette.buttonAlphaDarkBg,
  color: disabled
    ? (theme.vars || theme).palette.textDisabled
    : (theme.vars || theme).palette.buttonAlphaDarkAction,
  padding: theme.spacing(0.75),
  cursor: disabled ? 'default' : 'pointer',
}));

export const StyledSelectorContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0.1, 0.25),
}));

export const StyledLabelContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'size',
})<BaseSizeProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
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
        '& svg': {
          height: 20,
          width: 20,
        },
      },
    },
    {
      props: ({ size }) => size === 'medium',
      style: {
        ...theme.typography.bodyMedium,
        height: 48,
        '& svg': {
          height: 24,
          width: 24,
        },
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
  pointerEvents: 'auto',
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

export const StyledDayPicker = styled(DayPicker)(({ theme }) => ({
  // CSS variables
  '--rdp-accent-color': (theme.vars || theme).palette.primary.main,
  '--rdp-background-color': (theme.vars || theme).palette.action.hover,

  // Reset
  '& button': {
    border: 'none',
    background: 'transparent',
  },

  // Header
  '& .rdp-month': {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  '& .rdp-month_caption': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: theme.spacing(1),
  },
  '& .rdp-caption_label': {
    ...theme.typography.bodyMedium,
    color: (theme.vars || theme).palette.text.primary,
  },
  '& .rdp-button_previous, & .rdp-button_next': {
    margin: theme.spacing(1),
    padding: 0,
  },
  '& .rdp-button_previous': {
    order: -1,
  },
  '& .rdp-button_next': {
    order: 1,
  },

  // Grid
  '& .rdp-month_grid': {
    order: 2,
    width: '100%',
    borderSpacing: 1,
    borderCollapse: 'separate',
  },

  // Weekdays
  '& .rdp-weekday': {
    ...theme.typography.bodyXXSmall,
    color: (theme.vars || theme).palette.text.secondary,
    textTransform: 'capitalize',
    borderTop: `${theme.spacing(1)} solid transparent`,
    borderBottom: `${theme.spacing(1)} solid transparent`,
    height: 48,
    width: 32,
  },

  // Days
  '& .rdp-day': {
    ...theme.typography.bodyXSmall,
    borderRadius: theme.shape.radius4,
    padding: 0,

    '&:not(.rdp-disabled)': {
      color: (theme.vars || theme).palette.text.primary,
      background: (theme.vars || theme).palette.surface1.main,
    },
    '&.rdp-range_middle': {
      color: (theme.vars || theme).palette.text.primary,
      background: (theme.vars || theme).palette.surface4.main,
    },
    '&.rdp-range_start, &.rdp-range_end, &.rdp-selected:not(.rdp-range_middle), &:hover:not(.rdp-day_selected):not(.rdp-disabled)':
      {
        color: (theme.vars || theme).palette.textSecondaryInverted,
        background: (theme.vars || theme).palette.accent1.main,
      },
    '&.rdp-disabled:not(.rdp-outside):not(.rdp-hidden)': {
      color: (theme.vars || theme).palette.text.primary,
      background: (theme.vars || theme).palette.alpha100.main,
      opacity: 0.5,
    },
    '&.rdp-outside.rdp-disabled:not(.rdp-hidden)': {
      color: (theme.vars || theme).palette.text.primary,
      background: 'transparent',
      opacity: 0.5,
    },
  },
  '& .rdp-day_button': {
    height: 36,
    minWidth: 36,
    width: '100%',
    padding: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'inherit',
  },
}));
