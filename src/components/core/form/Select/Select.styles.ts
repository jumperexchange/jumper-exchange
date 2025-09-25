import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import { ButtonTertiary } from 'src/components/Button/Button.style';

export const StyledSelect = styled(Select)(({ theme }) => ({
  '&.MuiSelect-root': {
    padding: 0,
    width: 'fit-content',
  },
  '&.MuiSelect-root .MuiSelect-select': {
    padding: 0,
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

export const StyledLabelContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
}));

export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: theme.spacing(0.75),
  '&:hover': {
    backgroundColor: 'transparent',
  },
  '&.Mui-selected, &.Mui-selected:hover, &.Mui-selected:focus, &.Mui-selected:focus-within':
    {
      backgroundColor: 'transparent',
    },
}));

export const StyledMenuItemContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.25),
  display: 'flex',
  alignItems: 'center',
}));

export const StyledMultiSelectFiltersContainer = styled(Box)(({ theme }) => ({
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1),
  pointerEvents: 'none',
  '& > *': {
    pointerEvents: 'auto',
  },
}));

export const StyledMultiSelectFiltersClearButton = styled(ButtonTertiary)(
  ({ theme }) => ({
    minWidth: 'unset',
    height: theme.spacing(4),
    padding: theme.spacing(1, 1.2),
    fontSize: theme.typography.bodyXSmallStrong.fontSize,
    fontWeight: theme.typography.bodyXSmallStrong.fontWeight,
    lineHeight: theme.typography.bodyXSmallStrong.lineHeight,
  }),
);

export const StyledMultiSelectFiltersInput = styled(InputBase)(({ theme }) => ({
  height: 40,
  width: '100%',
  padding: theme.spacing(1.25, 1.5),
  borderRadius: theme.shape.inputTextBorderRadius,
  backgroundColor: (theme.vars || theme).palette.alpha100.main,
  ...theme.typography.bodySmall,
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
