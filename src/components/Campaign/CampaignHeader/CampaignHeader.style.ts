import type { Breakpoint, TypographyProps } from '@mui/material';
import {
  alpha,
  Box,
  IconButton,
  Link,
  styled,
  Typography,
} from '@mui/material';

export const InformationShareLink = styled(Link)(() => ({
  color: 'inherit',
  textDecoration: 'none',
}));

export const ColoredProtocolShareButton = styled(IconButton)(({ theme }) => ({
  background: alpha(theme.palette.white.main, 0.08),
  color: theme.palette.text.primary,
  transition: 'background-color 300ms ease-in-out',
  '&:hover': {
    background: alpha(theme.palette.white.main, 0.16),
  },
}));

export const CampaignHeaderBoxBackground = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  flexDirection: 'column',
  height: 180,
  borderRadius: theme.spacing(4),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  backgroundColor: alpha(theme.palette.primary.main, 0.24),
  [theme.breakpoints.down('md' as Breakpoint)]: {
    justifyContent: 'center',
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    justifyContent: 'flex-end',
  },
}));

export const VerticalCenterBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  marginLeft: theme.spacing(2),
}));

interface CampaignTitleProps extends TypographyProps {
  lightMode?: boolean;
}

export const CampaignTitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'lightMode',
})<CampaignTitleProps>(({ theme, lightMode }) => ({
  color: !lightMode ? theme.palette.white.main : theme.palette.black.main,
  fontWeight: 700,
  fontSize: 32,
  [theme.breakpoints.down('md' as Breakpoint)]: {
    fontSize: 24,
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    fontSize: 32,
  },
}));

interface CampaignDescriptionProps extends TypographyProps {
  lightMode?: boolean;
}

export const CampaignDescription = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'lightMode',
})<CampaignDescriptionProps>(({ theme, lightMode }) => ({
  color: alpha(
    !lightMode ? theme.palette.white.main : theme.palette.black.main,
    0.48,
  ),
  marginTop: theme.spacing(0.5),
  fontWeight: 500,
  fontSize: 16,

  [theme.breakpoints.down('md' as Breakpoint)]: {
    fontSize: 12,
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    fontSize: 16,
  },
}));

export const CardInfoTypogragphy = styled(Typography)(({ theme }) => ({
  color: theme.palette.white.main,
  fontWeight: 700,
}));

export const CampaignDigitInfoBox = styled(Box)(({ theme }) => ({
  maxWidth: '216px',
  minWidth: '164px',
  backgroundColor: alpha(theme.palette.primary.main, 0.8),
  boxShadow: '0 4px 6px #00000020',
  borderRadius: theme.spacing(2),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
}));

export const CampaignLinks = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

export const CampaignLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  textDecoration: 'none',
  color: theme.palette.white.main,
  backgroundColor: alpha(theme.palette.white.main, 0.08),
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1),
  transition: 'background-color 300ms ease-in-out',
  '&:hover': {
    backgroundColor: alpha(theme.palette.white.main, 0.16),
  },
}));

export const CampaignLinkText = styled(Typography)(({ theme }) => ({
  color: theme.palette.white.main,
  fontWeight: 500,
  fontSize: 14,
}));

export const CampaignLinkIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.white.main,
}));
