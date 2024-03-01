import type {
  BoxProps,
  Breakpoint,
  CSSObject,
  IconButtonProps,
} from '@mui/material';
import { Box, Stack, Typography, alpha, styled } from '@mui/material';
/* The line `import { IconButtonTertiary } from 'src/components/IconButton.style';` is importing the
  `IconButtonTertiary` component from the file located at `'src/components/IconButton.style'`. This
  component is likely a custom styled IconButton component defined in that file and is being used in
  the current file for styling purposes within the styled components. */
import { IconButtonTertiary } from './IconButton.style';

export const CompletedQuestContainer = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light'
      ? '#F9F5FF'
      : alpha(theme.palette.white.main, 0.08),
  // marginTop: theme.spacing(6),
  padding: theme.spacing(2),
  borderRadius: '32px',
  //   margin: theme.spacing(6, 2, 0),
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)'
      : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    margin: theme.spacing(8, 8, 0),
    padding: theme.spacing(6, 3),
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    padding: theme.spacing(8, 4, 4),
    margin: theme.spacing(12, 8, 0),
  },
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    padding: theme.spacing(6, 6, 4),
  },
  [theme.breakpoints.up('xl' as Breakpoint)]: {
    margin: `${theme.spacing(12, 'auto', 0)}`,
    maxWidth: theme.breakpoints.values.xl,
  },
  marginBottom: 1,
}));

export const CompletedQuestHeader = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'styles',
})<BoxProps>(({ theme }) => ({
  display: 'flex',
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.white.main,
  }),
  justifyContent: 'space-between',
}));

export const CompletedQuestTitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'styles' && prop !== 'show',
})(({ theme }) => ({
  fontWeight: 700,
  fontSize: '24px',
  lineHeight: '32px',
  color: 'inherit',
  margin: theme.spacing(3, 1.5, 0),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    margin: theme.spacing(0, 1.5, 0),
  },
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    justifyContent: 'flex-start',
    margin: 0,
  },
}));

export const CompletedQuestStack = styled(Stack)(() => ({
  marginTop: 32,
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
}));
