import type { BoxProps } from '@mui/material';
import { Box, Typography, styled } from '@mui/material';

interface IconHeaderContainerProps extends BoxProps {
  hideTitleOnMobile?: boolean;
}

export const IconHeaderContainer = styled(Box)<IconHeaderContainerProps>(
  ({ theme, hideTitleOnMobile }) => ({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : '#5c4286',
    paddingTop: '4px',
    paddingBottom: '4px',
    paddingRight: '6px',
    paddingLeft: '6px',
    borderRadius: '32px',
    width: 'fit-content',

    ...(hideTitleOnMobile && {
      [theme.breakpoints.down('sm')]: {
        '.icon-header-title': {
          display: 'none',
        },
      },
    }),
  }),
);

export const IconHeaderTitle = styled(Typography)(({ theme }) => ({
  marginLeft: '8px',
  userSelect: 'none',
  color: theme.palette.text.primary,
}));
