import Box, { BoxProps } from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled, Theme } from '@mui/material/styles';
import { alpha } from '@mui/system';

export enum SelectCardMode {
  Display = 'display',
  Input = 'input',
}

interface SelectCardContainerProps extends BoxProps {
  isClickable?: boolean;
}

export const SelectCardContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isClickable',
})<SelectCardContainerProps>(({ theme, isClickable }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  background: (theme.vars || theme).palette.surface2.main,
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  cursor: isClickable ? 'pointer' : 'initial',
  ...theme.applyStyles?.('light', {
    background: (theme.vars || theme).palette.background.default,
  }),
}));

export const SelectCardContentContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  gap: theme.spacing(1.25),
  alignItems: 'center',
}));

export const SelectCardValueContainer = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

export const SelectCardLabel = styled(InputLabel)(({ theme }) => ({
  ...theme.typography.bodySmallStrong,
}));

export const SelectCardDescription = styled(Typography)(({ theme }) => ({
  color: (theme.vars || theme).palette.alphaLight800.main,
  ...theme.applyStyles('light', {
    color: (theme.vars || theme).palette.alphaDark800.main,
  }),
}));

export const getPlaceholderTextStyles = (theme: Theme) => ({
  ...theme.typography.bodyLarge,
  fontWeight: '500',
  color: (theme.vars || theme).palette.alphaLight600.main,
  ...theme.applyStyles?.('light', {
    color: (theme.vars || theme).palette.alphaDark600.main,
  }),
});

export const SelectCardInputField = styled(InputBase)(({ theme }) => ({
  '& input': {
    ...theme.typography.bodyLargeStrong,
    paddingTop: 0,
    paddingBottom: theme.spacing(0.25),
  },
  '& input::placeholder': {
    opacity: 1,
    ...getPlaceholderTextStyles(theme),
  },
}));

interface SelectCardDisplayValueProps {
  showPlaceholder: boolean;
}

export const SelectCardDisplayValue = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'showPlaceholder',
})<SelectCardDisplayValueProps>(({ theme, showPlaceholder }) => ({
  ...theme.typography.bodyLargeStrong,
  paddingTop: 0,
  paddingBottom: theme.spacing(0.25),
  ...(showPlaceholder && getPlaceholderTextStyles(theme)),
}));
