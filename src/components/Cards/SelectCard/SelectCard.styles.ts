import type { BoxProps } from '@mui/material/Box';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import type { InputBaseProps } from '@mui/material/InputBase';
import InputBase from '@mui/material/InputBase';
import InputLabel from '@mui/material/InputLabel';
import type { TypographyProps } from '@mui/material/Typography';
import Typography from '@mui/material/Typography';
import type { Theme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

export enum SelectCardMode {
  Display = 'display',
  Input = 'input',
}

interface SelectCardContainerProps extends BoxProps {
  isClickable?: boolean;
}

export const SelectCardContainer = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'isClickable',
})<SelectCardContainerProps>(({ theme, isClickable }) => ({
  width: '100%',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  background: (theme.vars || theme).palette.surface2.main,
  padding: theme.spacing(2),
  position: 'relative',
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
  gap: theme.spacing(2),
  alignItems: 'center',
}));

export const SelectCardValueContainer = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}));

export const SelectCardLabel = styled(InputLabel)(({ theme }) => ({
  ...theme.typography.bodySmallStrong,
}));

interface SelectCardDescriptionProps extends TypographyProps {
  hideOverflow?: boolean;
}

export const SelectCardDescription = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'hideOverflow',
})<SelectCardDescriptionProps>(({ theme, hideOverflow }) => ({
  color: (theme.vars || theme).palette.text.secondary,
  ...(hideOverflow && {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
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

interface SelectCardInputFieldProps extends InputBaseProps {
  isAmount?: boolean;
}

export const SelectCardInputField = styled(InputBase, {
  shouldForwardProp: (prop) => prop !== 'isAmount',
})<SelectCardInputFieldProps>(({ theme, isAmount }) => ({
  '& input': {
    ...theme.typography.bodyLargeStrong,
    height: 'auto',
    paddingTop: 0,
    paddingBottom: theme.spacing(0.25),
  },
  '& input::placeholder': {
    opacity: 1,
    ...getPlaceholderTextStyles(theme),
  },
  ...(isAmount && {
    '& input, & input::placeholder': {
      fontSize: 24,
      fontWeight: 700,
    },
  }),
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
