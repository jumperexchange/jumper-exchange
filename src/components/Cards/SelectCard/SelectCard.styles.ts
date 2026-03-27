import type { BoxProps } from '@mui/material/Box';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import type { InputBaseProps } from '@mui/material/InputBase';
import InputBase from '@mui/material/InputBase';
import InputLabel, { type InputLabelProps } from '@mui/material/InputLabel';
import type { TypographyProps } from '@mui/material/Typography';
import Typography from '@mui/material/Typography';
import type { Theme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import type { TypographyVariantKey } from '@/utils/theme/isTypographyThemeKey';
import { getTypographyStyles } from '@/utils/theme/isTypographyThemeKey';

export enum SelectCardMode {
  Display = 'display',
  Input = 'input',
}

interface TextVariantProps {
  textVariant?: TypographyVariantKey;
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

export const SelectCardLabel = styled(InputLabel, {
  shouldForwardProp: (prop) => prop !== 'textVariant',
})<InputLabelProps & TextVariantProps>(({ theme, textVariant }) => ({
  ...getTypographyStyles(theme, textVariant, 'bodySmallStrong'),
}));

interface SelectCardDescriptionProps extends TypographyProps {
  hideOverflow?: boolean;
}

export const SelectCardDescription = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'hideOverflow',
})<SelectCardDescriptionProps>(({ theme, hideOverflow }) => ({
  color: (theme.vars || theme).palette.text.secondary,
  minWidth: 0,
  ...(hideOverflow && {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }),
}));

export const getPlaceholderTextStyles = (
  theme: Theme,
  placeholderVariant?: TextVariantProps['textVariant'],
) => ({
  ...getTypographyStyles(theme, placeholderVariant, 'bodyXLarge'),
  fontWeight: '500',
  color: (theme.vars || theme).palette.alphaLight600.main,
  ...theme.applyStyles?.('light', {
    color: (theme.vars || theme).palette.alphaDark600.main,
  }),
});

interface SelectCardInputFieldProps extends InputBaseProps {
  isAmount?: boolean;
  valueVariant?: TextVariantProps['textVariant'];
  placeholderVariant?: TextVariantProps['textVariant'];
}

export const SelectCardInputField = styled(InputBase, {
  shouldForwardProp: (prop) =>
    prop !== 'isAmount' &&
    prop !== 'valueVariant' &&
    prop !== 'placeholderVariant',
})<SelectCardInputFieldProps>(
  ({ theme, isAmount, valueVariant, placeholderVariant }) => ({
    '& input': {
      ...getTypographyStyles(theme, valueVariant, 'bodyLargeStrong'),
      height: 'auto',
      paddingTop: theme.spacing(0.1875),
      paddingBottom: theme.spacing(0.2),
    },
    '& input::placeholder': {
      opacity: 1,
      ...getPlaceholderTextStyles(theme, placeholderVariant),
    },
    ...(isAmount && {
      '& input, & input::placeholder': {
        fontSize: 24,
        fontWeight: 700,
      },
    }),
  }),
);

interface SelectCardDisplayValueProps extends TextVariantProps {
  showPlaceholder: boolean;
  placeholderVariant?: TextVariantProps['textVariant'];
}

export const SelectCardDisplayValue = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'showPlaceholder' &&
    prop !== 'textVariant' &&
    prop !== 'placeholderVariant',
})<SelectCardDisplayValueProps>(
  ({ theme, showPlaceholder, textVariant, placeholderVariant }) => ({
    ...getTypographyStyles(theme, textVariant, 'bodyXLargeStrong'),
    paddingTop: 0,
    ...(showPlaceholder && getPlaceholderTextStyles(theme, placeholderVariant)),
  }),
);
