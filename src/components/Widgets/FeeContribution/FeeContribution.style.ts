import Box, { BoxProps } from '@mui/material/Box';
import Button, { ButtonProps } from '@mui/material/Button';
import Card from '@mui/material/Card';
import Drawer from '@mui/material/Drawer';
import { alpha, darken, styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

interface ContributionWrapperProps extends BoxProps {
  showContribution: boolean;
}

export const ContributionWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'showContribution',
})<ContributionWrapperProps>(({ showContribution }) => ({
  position: 'relative',
  transition: 'height 250ms',
  height: showContribution ? '156px' : '0px',
}));

export const DrawerWrapper = styled(Box)(() => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
  overflow: 'hidden',
  borderRadius: '24px',
  boxShadow: 'none',
}));

export const ContributionCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  border: 'unset',
  padding: theme.spacing(2),
  borderRadius: '16px',
  boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.04)',
}));

export const ContributionCardTitle = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  lineHeight: '20px',
  fontWeight: 700,
}));

interface ContributionCustomInputProps {
  isFieldActive?: boolean;
  inputAmount?: string;
  value?: string;
}

export const ContributionCustomInput = styled(TextField, {
  shouldForwardProp: (prop) => !['isFieldActive'].includes(prop as string),
})<ContributionCustomInputProps>(({ theme, isFieldActive, value }) => ({
  width: '100%',
  borderRadius: '24px',
  overflow: 'hidden',
  transition: 'background-color 250ms',
  backgroundColor: isFieldActive
    ? 'rgba(101, 59, 163, 0.84)'
    : `${(theme.vars || theme).palette.grey[200]} !important`,
  '&:hover': {
    backgroundColor: isFieldActive
      ? '#653BA3'
      : `${(theme.vars || theme).palette.grey[300]} !important`,
  },
  ...theme.applyStyles('light', {
    backgroundColor: isFieldActive
      ? '#F0E5FF'
      : (theme.vars || theme).palette.grey[100],
    '&:hover': {
      backgroundColor: isFieldActive
        ? darken('#F0E5FF', 0.08)
        : (theme.vars || theme).palette.grey[300],
    },
  }),
  '& .MuiInputBase-root': {
    borderRadius: '16px',
    width: '100%',
    height: '32px',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    padding: 0,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    maxWidth: '100%',
    '& fieldset': {
      border: 'none !important',
    },
  },
  '& .MuiInputBase-input': {
    ...((isFieldActive || value) && {
      width: `${(value?.length || 1) * 8}px`,
      paddingLeft: theme.spacing(0.5),
    }),

    padding: value || !isFieldActive ? 0 : '0 16px',

    // borderRadius: '16px',
    height: 'auto',
    justifyContent: 'center',
    ':focus': {
      padding: '0 12px 0 24px',
      border: 'none',
    },
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: 700,
    textAlign: 'center',
    color: (theme.vars || theme).palette.text.primary,
    backgroundColor: 'transparent !important',
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
    '&::placeholder': {
      color: (theme.vars || theme).palette.text.primary,
      opacity: 1,
    },
    '&:focus': {
      padding: 0,
      border: 'none',
    },
  },
  '& .MuiInputAdornment-root': {
    fontSize: '12px',
    marginRight: 0,
    lineHeight: '100%',
    fontWeight: 700,
    color: (theme.vars || theme).palette.text.primary,
    ...((isFieldActive || !!value) && {
      padding: 0,
    }),
  },
}));

interface ContributionButtonProps extends ButtonProps {
  selected: boolean;
}

export const ContributionButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<ContributionButtonProps>(
  ({ theme }) => ({
    width: '100%',
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: 700,
    height: '32px',
    transition: 'background-color 250ms',
    color: (theme.vars || theme).palette.text.primary,
    borderColor: 'transparent',
  }),
  {
    variants: [
      {
        props: { selected: true },
        style: ({ theme }) => ({
          backgroundColor: 'rgba(101, 59, 163, 0.84)',
          '&:hover': { backgroundColor: '#653BA3' },
          ...theme.applyStyles('light', {
            backgroundColor: '#F0E5FF',
            '&:hover': {
              color: (theme.vars || theme).palette.text.primary,
              backgroundColor: darken('#F0E5FF', 0.08),
            },
          }),
        }),
      },
      {
        props: { selected: false },
        style: ({ theme }) => ({
          backgroundColor: `${(theme.vars || theme).palette.grey[200]} !important`,
          '&:hover': {
            backgroundColor: `${(theme.vars || theme).palette.grey[300]} !important`,
          },
          ...theme.applyStyles('light', {
            backgroundColor: (theme.vars || theme).palette.grey[100],
            '&:hover': {
              backgroundColor: (theme.vars || theme).palette.grey[300],
            },
          }),
        }),
      },
    ],
  },
);

interface ContributionButtonCTAProps extends ButtonProps {
  isTxConfirmed: boolean;
}

export const ContributionButtonCTA = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isTxConfirmed',
})<ContributionButtonCTAProps>(
  ({ theme }) => ({
    width: '100%',
    fontSize: '14px',
    lineHeight: '16px',
    fontWeight: 700,
    height: '40px',
    gap: '8px',
    transition: 'background-color 250ms',
  }),
  {
    variants: [
      {
        props: { isTxConfirmed: true },
        style: ({ theme }) => ({
          color: '#00B849',
          backgroundColor: 'rgba(101, 59, 163, 0.84)',
          '&:hover': { backgroundColor: '#653BA3' },

          ...theme.applyStyles('light', {
            backgroundColor: '#D6FFE7',
            color: '#00B849',
            '&:hover': {
              backgroundColor: darken('#D6FFE7', 0.04),
            },
          }),
        }),
      },
      {
        props: { isTxConfirmed: false },
        style: ({ theme }) => ({
          backgroundColor: 'rgba(101, 59, 163, 0.84)',
          color: (theme.vars || theme).palette.text.primary,
          '&:hover': {
            backgroundColor: '#653BA3',
          },
          ...theme.applyStyles('light', {
            backgroundColor: '#F0E5FF',
            color: (theme.vars || theme).palette.text.primary,
            '&:hover': {
              backgroundColor: darken('#F0E5FF', 0.08),
            },
          }),
        }),
      },
    ],
  },
);

export const ContributionDescription = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  lineHeight: '16px',
  fontWeight: 500,
  color: alpha('#fff', 0.84),
  height: '40px',

  ...theme.applyStyles('light', {
    color: (theme.vars || theme).palette.grey[700],
  }),
}));

export const ContributionDrawer = styled(Drawer)(({ theme }) => ({
  position: 'absolute',
  '& .MuiDrawer-paper': {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    borderRadius: '24px',
    boxShadow: 'none',
  },
}));
