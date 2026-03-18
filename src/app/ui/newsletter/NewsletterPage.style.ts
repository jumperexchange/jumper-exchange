import { ButtonPrimary } from '@/components/Button/Button.style';
import { Link } from '@/components/Link/Link';
import { getSurfaceBorder } from '@/theme/utils/getSurfaceBorder';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

export const NewsletterPageContainer = styled(Box)(({ theme }) => ({
  marginRight: 'auto',
  marginLeft: 'auto',
  maxWidth: 344,
  marginTop: theme.spacing(7),
  [theme.breakpoints.up('md')]: {
    maxWidth: 600,
    marginTop: theme.spacing(14.25),
  },
}));

export const NewsletterWelcomeContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(4),
  padding: theme.spacing(0, 2),
}));

export const NewsletterWelcomeContentTitleContainer = styled(Box)(
  ({ theme }) => ({}),
);

export const NewsletterForm = styled(Box)(({ theme }) => ({
  maxWidth: 416,
  width: '100%',
  padding: 0,
}));

export const NewsletterFormGroup = styled(FormGroup, {
  shouldForwardProp: (prop) =>
    prop !== 'error' && prop !== 'disabled' && prop !== 'layout',
})<{ error?: boolean; disabled?: boolean; layout?: 'inline' | 'stacked' }>(
  ({ theme }) => ({
    width: '100%',
    boxShadow: theme.shadows[2],
    verticalAlign: 'middle',
    padding: theme.spacing(0.5, 0.5, 0.5, 2),
    border: `1px solid`,
    transition: 'border-color 0.2s ease-in-out',
    borderRadius: theme.shape.buttonBorderRadius,
    backgroundColor: (theme.vars || theme).palette.alphaLight100.main,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    ...theme.applyStyles?.('light', {
      backgroundColor: (theme.vars || theme).palette.surface1.main,
      border: getSurfaceBorder(theme, 'surface1'),
    }),
    '.MuiInputBase-root': {
      ':before, :after': {
        display: 'none',
      },
    },
    '& input': {
      ...theme.typography.bodyMedium,
    },
    '& input::placeholder': {
      opacity: 1,
      ...theme.typography.bodyMedium,
      color: (theme.vars || theme).palette.textHint,
    },
    '& input:disabled': {
      pointerEvents: 'none',
      '&::placeholder': {
        color: (theme.vars || theme).palette.textDisabled,
      },
    },
    variants: [
      {
        props: { error: true },
        style: {
          borderColor: (theme.vars || theme).palette.borderError,
        },
      },
      {
        props: { error: false },
        style: {
          borderColor: (theme.vars || theme).palette.grey[100],
          '&:hover, &:active, &:focus, &:focus-visible, &:focus-within': {
            borderColor: (theme.vars || theme).palette.borderActive,
          },
        },
      },
      {
        props: { disabled: true },
        style: {
          '&, &:hover, &:active, &:focus, &:focus-visible, &:focus-within': {
            borderColor: (theme.vars || theme).palette.grey[100],
            backgroundColor: (theme.vars || theme).palette.buttonDisabledBg,
          },
        },
      },
      {
        props: { layout: 'stacked' },
        style: {
          padding: theme.spacing(1.25, 2),
          '& .MuiInputBase-root': {
            width: '100%',
          },
        },
      },
    ],
  }),
);

export const NewsletterFormButton = styled(ButtonPrimary)(({ theme }) => ({
  '&.MuiButtonBase-root.MuiButton-root': {
    ...theme.typography.bodySmallStrong,
    minWidth: 'fit-content',
    padding: theme.spacing(1.375, 2),
    '&.MuiButton-fullWidth': {
      minWidth: 'unset',
      width: '100%',
    },
    backgroundColor: (theme.vars || theme).palette.buttonPrimaryBg,
    color: (theme.vars || theme).palette.buttonPrimaryAction,
    '&:disabled': {
      backgroundColor: (theme.vars || theme).palette.buttonDisabledBg,
      color: (theme.vars || theme).palette.buttonDisabledAction,
    },
  },
}));

export const NewsletterLink = styled(Link)(({ theme }) => ({
  color: 'inherit',
  textDecorationColor: 'inherit',
}));

export const NewsletterErrorMessage = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  textAlign: 'left',
  color: (theme.vars || theme).palette.textError,
}));
