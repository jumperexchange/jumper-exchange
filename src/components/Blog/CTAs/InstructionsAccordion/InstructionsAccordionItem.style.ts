import { getContrastAlphaColor } from '@/utils/colors';
import type { Breakpoint } from '@mui/material';
import { Box, Typography, styled } from '@mui/material';
import { IconButtonTertiary } from 'src/components/IconButton.style';

export const InstructionsAccordionItemContainer = styled(Box)(({ theme }) => ({
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
  alignItems: 'flex-start',
  position: 'relative',

  a: {
    color:
      theme.palette.mode === 'light'
        ? theme.palette.primary.main
        : theme.palette.accent1Alt.main,
  },

  '& a:not(:first-child)': {
    marginLeft: theme.spacing(0.5),
  },

  [theme.breakpoints.up('sm' as Breakpoint)]: {
    alignSelf: 'flex-start',
    margin: theme.spacing(2, 0, 0, 0),
  },
}));

export const InstructionsAccordionItemMain = styled(Box)(() => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

export const InstructionsAccordionItemHeader = styled(Box)(() => ({
  display: 'flex',
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
    color: getContrastAlphaColor(theme, 0.32),

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

export const InstructionsAccordionButtonMainBox = styled(Box)(() => ({
  display: 'flex',
  alignContent: 'center',
  justifyContent: 'flex-start',
  mt: '8px',
}));

export const InstructionsAccordionLinkBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  textAlign: 'left',
  alignItems: 'center',
  alignContent: 'center',
  color: theme.palette.black.main,
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));
