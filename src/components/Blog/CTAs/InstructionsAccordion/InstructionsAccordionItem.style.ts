import type { Breakpoint } from '@mui/material';
import { Box, Typography, styled } from '@mui/material';
import type { ButtonProps } from '@mui/material/Button';
import type { LinkProps } from 'next/link';
import Link from 'next/link';
import { IconButtonTertiary } from 'src/components/IconButton.style';

export const InstructionsAccordionItemContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  overflow: 'hidden',
  backgroundColor: (theme.vars || theme).palette.alphaLight200.main,
  padding: theme.spacing(3),
  flexDirection: 'column',
  margin: theme.spacing(2, 0),
  borderRadius: '24px',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  position: 'relative',
  gap: theme.spacing(0.5),
  a: {
    color: (theme.vars || theme).palette.accent1Alt.main,
    ...theme.applyStyles('light', {
      color: (theme.vars || theme).palette.primary.main,
    }),
  },

  [theme.breakpoints.up('sm' as Breakpoint)]: {
    alignSelf: 'flex-start',
    margin: theme.spacing(2, 0, 0, 0),
  },
  ...theme.applyStyles('light', {
    backgroundColor: (theme.vars || theme).palette.alphaDark100.main,
  }),
}));

export const InstructionsAccordionItemMain = styled(Box)(() => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

export const InstructionsAccordionItemHeader = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}));

export const InstructionsAccordionItemMore = styled(Box)(({ theme }) => ({
  margin: theme.spacing(2, 0, 0, 3),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    alignSelf: 'flex-start',
    margin: theme.spacing(2, 0, 0, 6),
  },
}));

export const InstructionsAccordionItemIndex = styled(Typography)(
  ({ theme }) => ({
    fontSize: '18px',
    fontWeight: 600,
    lineHeight: '32px',
    color: (theme.vars || theme).palette.alphaLight600.main,
    ...theme.applyStyles('light', {
      color: (theme.vars || theme).palette.alphaDark600.main,
    }),
    [theme.breakpoints.up('sm' as Breakpoint)]: {
      marginLeft: theme.spacing(2),
    },
  }),
);

export const InstructionsAccordionToggle = styled(IconButtonTertiary)(
  ({ theme }) => ({
    width: '40px',
    height: '40px',
  }),
);

export const InstructionsAccordionItemLabel = styled(Box)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  color: (theme.vars || theme).palette.text.primary,
  fontWeight: 600,
  fontSize: '18px',
  lineHeight: '32px',
  p: {
    marginBlock: 'auto',
    display: 'inline',
  },
  '& a:not(:first-child), & p:not(:first-child)': {
    marginLeft: theme.spacing(0.5),
  },
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    marginLeft: theme.spacing(3),
  },
}));

export const InstructionsAccordionButtonMainBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignContent: 'center',
  justifyContent: 'flex-start',
  flexDirection: 'column',
  marginTop: theme.spacing(1),
  gap: theme.spacing(1.5),

  [theme.breakpoints.up('sm' as Breakpoint)]: {
    flexDirection: 'row',
  },
}));

export const InstructionsAccordionLinkBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  textAlign: 'left',
  alignItems: 'center',
  alignContent: 'center',
  color: (theme.vars || theme).palette.white.main,
  ...theme.applyStyles('light', {
    color: (theme.vars || theme).palette.black.main,
  }),
}));

export const InstructionsAccordionLink = styled(Link)<LinkProps & ButtonProps>(
  ({ theme }) => ({
    display: 'flex',
    textAlign: 'left',
    alignItems: 'center',
    alignContent: 'center',
    textDecoration: 'none',
    padding: `${theme.spacing(0.5, 1)}`,
    color: (theme.vars || theme).palette.white.main,
    ...theme.applyStyles('light', {
      color: (theme.vars || theme).palette.black.main,
    }),
  }),
);

export const InstructionsAccordionLinkLabel = styled(Typography)(
  ({ theme }) => ({
    overflow: 'hidden',
    marginRight: theme.spacing(1),
    textOverflow: 'ellipsis',
    maxWidth: 208,

    [theme.breakpoints.up('sm' as Breakpoint)]: {
      maxWidth: 168,
    },
  }),
);
