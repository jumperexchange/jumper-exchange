import { Box, Breakpoint, styled, Typography } from '@mui/material';
import { ButtonSecondary } from 'src/components/Button';
import { getContrastAlphaColor } from 'src/utils/colors';
import type { ButtonProps as MuiButtonProps } from '@mui/material';

export const CampaignBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(3),
  backgroundColor: theme.palette.bgSecondary.main,
  borderRadius: '24px',
  flexDirection: 'row',
  boxShadow: theme.shadows[1],
  padding: theme.spacing(2),
  marginTop: theme.spacing(4),
  [theme.breakpoints.down('md' as Breakpoint)]: {
    flexDirection: 'column',
  },

  [theme.breakpoints.up('lg' as Breakpoint)]: {
    flexDirection: 'row',
  },
}));

export const CampaignInfoVerticalBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

export const CampaignTagBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.bgQuaternary.main,
  display: 'flex',
  padding: '4px 8px',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: theme.spacing(24),
  width: '33%',
}));

export const CampaignButton = styled;

export const TitleTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
  [theme.breakpoints.down('md' as Breakpoint)]: {
    fontSize: 32,
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    fontSize: 48,
  },
}));

export const SubtitleTypography = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 500,
  color: theme.palette.text.secondary,
}));

export const TextDescriptionBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

export const BannerButton = styled(ButtonSecondary)<MuiButtonProps>(
  ({ theme }) => ({
    gap: '8px',
    borderRadius: '24px',
    '&:hover': {
      backgroundColor: getContrastAlphaColor(theme, '4%'),
    },
    '&:hover svg': {
      fill:
        theme.palette.mode === 'light'
          ? theme.palette.grey[700]
          : theme.palette.grey[300],
    },
    [theme.breakpoints.down('md' as Breakpoint)]: {
      marginTop: 16,
    },
  }),
);
