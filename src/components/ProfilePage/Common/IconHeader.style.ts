import type { TypographyProps } from '@mui/material';
import { Box, Typography, styled } from '@mui/material';

export const IconHeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : '#5c4286',
  paddingTop: '4px',
  paddingBottom: '4px',
  paddingRight: '6px',
  paddingLeft: '6px',
  borderRadius: '32px',
  width: 'fit-content',
}));

interface IconHeaderTitleProps extends TypographyProps {
  hideTitleOnMobile?: boolean;
}

export const IconHeaderTitle = styled(Typography)<IconHeaderTitleProps>(
  ({ theme, hideTitleOnMobile }) => ({
    marginLeft: '8px',
    userSelect: 'none',
    color: theme.palette.text.primary,

    ...(hideTitleOnMobile && {
      [theme.breakpoints.down('sm')]: {
        '.icon-header-title': {
          display: 'none',
        },
      },
    }),
  }),
);
