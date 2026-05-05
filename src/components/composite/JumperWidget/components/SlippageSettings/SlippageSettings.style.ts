import type { Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import InputBase, { inputBaseClasses } from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';

export const SettingsFieldSet = styled(Box)(({ theme }) => ({
  display: 'flex',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0.5),
  gap: theme.spacing(0.5),
  height: '3.5rem',
  backgroundColor: (theme.vars || theme).palette.alpha100.main,
}));

const settingsControlSelected = (theme: Theme) => ({
  backgroundColor: (theme.vars || theme).palette.surface1.main,
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.radius8,
});

interface SettingsControlProps {
  selected?: boolean;
}

export const SettingsDefaultButton = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<SettingsControlProps>(({ theme, selected }) => {
  const selectedStyles = settingsControlSelected(theme);
  return {
    height: '100%',
    width: '100%',
    borderRadius: theme.shape.radius8,
    fontSize: '1rem',
    fontWeight: 700,
    '&:focus': {
      ...selectedStyles,
    },
    ...(selected && {
      '&:not(:focus)': {
        ...selectedStyles,
      },
    }),
  };
});

export const SettingsCustomInput = styled(InputBase, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<SettingsControlProps>(({ theme, selected }) => {
  const selectedStyles = settingsControlSelected(theme);
  return {
    height: '100%',
    width: '100%',
    [`& .${inputBaseClasses.input}`]: {
      height: '100%',
      width: '100%',
      padding: 0,
      textAlign: 'center',
      '&::placeholder': {
        fontSize: 'inherit',
        fontWeight: 500,
        color: (theme.vars || theme).palette.textHint,
      },
      '&:focus': {
        ...selectedStyles,
      },
      ...(selected && {
        '&:not(:focus)': {
          ...selectedStyles,
        },
      }),
    },
  };
});

export const SlippageLimitsWarningContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.25),
  marginTop: theme.spacing(1.5),
}));
