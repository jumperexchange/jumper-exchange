import type { TypographyProps } from '@mui/material';
import { Typography } from '@mui/material';
import type { Breakpoint } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

export const CenteredContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  ...theme.applyStyles('light', {
    backgroundColor: (theme.vars || theme).palette.background.default,
  }),
}));

export const ErrorMessage = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(2.5),
  textAlign: 'center',
  color: (theme.vars || theme).palette.accent1Alt.main,
  fontWeight: 700,
  [theme.breakpoints.up('sm')]: {
    fontSize: '24px',
    fontWeight: 400,
    lineHeight: '32px',
  },
  ...theme.applyStyles('light', {
    color: (theme.vars || theme).palette.accent1Alt.main,
  }),
}));

export const SupportMessage = styled(Typography)<TypographyProps>(
  ({ theme }) => ({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 208,
    marginLeft: '9.5px',
    marginRight: '9.5px',
    [theme.breakpoints.up('sm' as Breakpoint)]: {
      maxWidth: 168,
    },
  }),
);
