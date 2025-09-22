import { styled } from '@mui/material/styles';
import ToggleButton, { ToggleButtonProps } from '@mui/material/ToggleButton';
import ToggleButtonGroup, {
  ToggleButtonGroupProps,
} from '@mui/material/ToggleButtonGroup';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface IconSelectContainerProps {
  orientation?: 'horizontal' | 'vertical' | 'grid';
  columns?: number;
  fullWidth?: boolean;
}

interface StyledToggleButtonProps extends ToggleButtonProps {
  variant?: 'contained' | 'outlined' | 'text';
  selectedColor?: 'primary' | 'secondary' | 'default';
}

interface StyledIconButtonProps extends IconButtonProps {
  isSelected?: boolean;
  selectedColor?: 'primary' | 'secondary' | 'default';
  variant?: 'contained' | 'outlined' | 'text';
}

export const IconSelectContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'orientation' && prop !== 'columns' && prop !== 'fullWidth',
})<IconSelectContainerProps>(({ theme, orientation, columns, fullWidth }) => ({
  display: orientation === 'grid' ? 'grid' : 'flex',
  flexDirection: orientation === 'vertical' ? 'column' : 'row',
  flexWrap: orientation === 'horizontal' ? 'wrap' : undefined,
  gap: theme.spacing(1),
  width: fullWidth ? '100%' : 'auto',
  ...(orientation === 'grid' && {
    gridTemplateColumns: `repeat(${columns || 'auto-fill'}, minmax(64px, 1fr))`,
    gridGap: theme.spacing(1),
  }),
}));

export const StyledToggleButtonGroup = styled(
  ToggleButtonGroup,
)<ToggleButtonGroupProps>(({ theme }) => ({
  '& .MuiToggleButton-root': {
    margin: theme.spacing(0.5),
    border: 0,
    '&.Mui-disabled': {
      border: 0,
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

export const StyledToggleButton = styled(ToggleButton, {
  shouldForwardProp: (prop) => prop !== 'variant' && prop !== 'selectedColor',
})<StyledToggleButtonProps>(({
  theme,
  variant = 'outlined',
  selectedColor = 'primary',
}) => {
  const colorMap = {
    primary: (theme.vars || theme).palette.primary.main,
    secondary: (theme.vars || theme).palette.secondary.main,
    default: (theme.vars || theme).palette.action.active,
  };

  const contrastTextMap = {
    primary: (theme.vars || theme).palette.primary.contrastText,
    secondary: (theme.vars || theme).palette.secondary.contrastText,
    default: (theme.vars || theme).palette.text.primary,
  };

  const selectedColorValue = colorMap[selectedColor];
  const selectedContrastText = contrastTextMap[selectedColor];

  return {
    color: (theme.vars || theme).palette.text.primary,
    backgroundColor:
      variant === 'contained'
        ? (theme.vars || theme).palette.action.hover
        : 'transparent',
    border:
      variant === 'outlined'
        ? `1px solid ${(theme.vars || theme).palette.divider}`
        : 'none',
    '&:hover': {
      backgroundColor: (theme.vars || theme).palette.action.hover,
    },
    '&.Mui-selected': {
      color:
        selectedColor === 'primary' || selectedColor === 'secondary'
          ? selectedContrastText
          : selectedColorValue,
      backgroundColor:
        selectedColor === 'primary' || selectedColor === 'secondary'
          ? selectedColorValue
          : variant === 'contained'
            ? `${selectedColorValue}20`
            : variant === 'outlined'
              ? `${selectedColorValue}10`
              : 'transparent',
      border:
        variant === 'outlined' &&
        !(selectedColor === 'primary' || selectedColor === 'secondary')
          ? `2px solid ${selectedColorValue}`
          : 'none',
      '&:hover': {
        color:
          selectedColor === 'primary' || selectedColor === 'secondary'
            ? selectedContrastText
            : selectedColorValue,
        backgroundColor:
          selectedColor === 'primary' || selectedColor === 'secondary'
            ? selectedColorValue
            : variant === 'contained'
              ? `${selectedColorValue}30`
              : `${selectedColorValue}15`,
      },
    },
    '&.Mui-disabled': {
      opacity: 0.5,
    },
    transition: theme.transitions.create(
      ['background-color', 'box-shadow', 'border-color', 'color'],
      {
        duration: theme.transitions.duration.short,
      },
    ),
  };
});

export const StyledIconButton = styled(IconButton, {
  shouldForwardProp: (prop) =>
    prop !== 'isSelected' && prop !== 'selectedColor' && prop !== 'variant',
})<StyledIconButtonProps>(({
  theme,
  isSelected = false,
  selectedColor = 'primary',
  variant = 'outlined',
}) => {
  const colorMap = {
    primary: (theme.vars || theme).palette.primary.main,
    secondary: (theme.vars || theme).palette.secondary.main,
    default: (theme.vars || theme).palette.action.active,
  };

  const contrastTextMap = {
    primary: (theme.vars || theme).palette.primary.contrastText,
    secondary: (theme.vars || theme).palette.secondary.contrastText,
    default: (theme.vars || theme).palette.text.primary,
  };

  const selectedColorValue = colorMap[selectedColor];
  const selectedContrastText = contrastTextMap[selectedColor];

  return {
    color: isSelected
      ? selectedColor === 'primary' || selectedColor === 'secondary'
        ? selectedContrastText
        : selectedColorValue
      : (theme.vars || theme).palette.text.primary,
    backgroundColor: isSelected
      ? selectedColor === 'primary' || selectedColor === 'secondary'
        ? selectedColorValue
        : variant === 'contained'
          ? `${selectedColorValue}20`
          : variant === 'outlined'
            ? `${selectedColorValue}10`
            : 'transparent'
      : 'transparent',
    border:
      variant === 'outlined' &&
      !(selectedColor === 'primary' || selectedColor === 'secondary')
        ? isSelected
          ? `2px solid ${selectedColorValue}`
          : `1px solid ${(theme.vars || theme).palette.divider}`
        : 'none',
    '&:hover': {
      color: isSelected
        ? selectedColor === 'primary' || selectedColor === 'secondary'
          ? selectedContrastText
          : selectedColorValue
        : (theme.vars || theme).palette.text.primary,
      backgroundColor: isSelected
        ? selectedColor === 'primary' || selectedColor === 'secondary'
          ? selectedColorValue
          : variant === 'contained'
            ? `${selectedColorValue}30`
            : `${selectedColorValue}15`
        : (theme.vars || theme).palette.action.hover,
    },
    '&.Mui-disabled': {
      opacity: 0.5,
    },
    transition: theme.transitions.create(
      ['background-color', 'box-shadow', 'border-color', 'color'],
      {
        duration: theme.transitions.duration.short,
      },
    ),
  };
});

export const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(0.5),
}));

export const IconLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  textAlign: 'center',
  marginTop: theme.spacing(0.5),
  color: 'inherit',
}));
