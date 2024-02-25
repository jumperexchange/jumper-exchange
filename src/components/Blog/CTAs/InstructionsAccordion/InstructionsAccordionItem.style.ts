import type { Breakpoint } from '@mui/material';
import { Box, Typography, styled } from '@mui/material';
import type { BoxProps } from '@mui/system';
import { getContrastAlphaColor } from 'src/utils';

export const InstructionsAccordionItemContainer = styled(Box)<BoxProps>(
  ({ theme }) => ({
    display: 'flex',
    overflow: 'hidden',
    backgroundColor:
      theme.palette.mode === 'dark'
        ? getContrastAlphaColor(theme, '8%')
        : getContrastAlphaColor(theme, '4%'),
    padding: theme.spacing(3),
    flexDirection: 'column',
    margin: theme.spacing(2, 0),
    borderRadius: '24px',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  }),
);

export const InstructionsAccordionItemMain = styled(Box)<BoxProps>(() => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

export const InstructionsAccordionItemMore = styled(Box)<BoxProps>(
  ({ theme }) => ({
    width: '100%',
    marginLeft: theme.spacing(7),
    marginTop: theme.spacing(2),
    [theme.breakpoints.up('sm' as Breakpoint)]: {
      marginLeft: theme.spacing(13),
    },
  }),
);

export const InstructionsAccordionItemIndex = styled(Typography)(
  ({ theme }) => ({
    fontSize: '18px',
    fontWeight: 600,
    lineHeight: '32px',
    color: getContrastAlphaColor(theme, 0.32),
    [theme.breakpoints.up('sm' as Breakpoint)]: {
      marginLeft: theme.spacing(2),
    },
  }),
);

export const InstructionsAccordionItemLabel = styled(Box)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  fontWeight: 600,
  fontSize: '18px',
  lineHeight: '32px',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    marginLeft: theme.spacing(3),
  },
}));
