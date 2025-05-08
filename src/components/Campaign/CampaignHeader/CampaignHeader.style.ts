import type { BoxProps, TypographyProps } from '@mui/material';
import { Box, IconButton, Link, styled, Typography } from '@mui/material';

export const InformationShareLink = styled(Link)(() => ({
  color: 'inherit',
  textDecoration: 'none',
}));

export const ColoredProtocolShareButton = styled(IconButton)(({ theme }) => ({
  background: (theme.vars || theme).palette.alphaLight200.main,
  color: (theme.vars || theme).palette.text.primary,
  transition: 'background-color 300ms ease-in-out',
  '&:hover': {
    background: (theme.vars || theme).palette.alphaLight400.main,
  },
}));

interface CampaignHeaderBoxBackgroundProps extends BoxProps {
  lightMode?: boolean;
}

export const CampaignHeaderContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'lightMode',
})<CampaignHeaderBoxBackgroundProps>(({ theme, lightMode }) => ({
  alignItems: 'center',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  height: 180,
  borderRadius: theme.spacing(4),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  backgroundColor: !lightMode
    ? (theme.vars || theme).palette.alphaLight300.main
    : (theme.vars || theme).palette.alphaLight700.main,
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
  color: !lightMode
    ? (theme.vars || theme).palette.white.main
    : (theme.vars || theme).palette.black.main,
}));

interface CampaignDescriptionProps extends TypographyProps {
  lightMode?: boolean;
}

export const CampaignDescription = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'lightMode',
})<CampaignDescriptionProps>(({ theme, lightMode }) => ({
  color: !lightMode
    ? (theme.vars || theme).palette.alphaLight700.main
    : (theme.vars || theme).palette.alphaDark700.main,
  marginTop: theme.spacing(0.5),
}));

interface CampaignDigitInfoBoxProps extends BoxProps {
  lightMode?: boolean;
}

export const CampaignHeaderInfos = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'lightMode',
})<CampaignDigitInfoBoxProps>(({ theme, lightMode }) => ({
  maxWidth: '216px',
  minWidth: '164px',
  color: !lightMode
    ? (theme.vars || theme).palette.white.main
    : (theme.vars || theme).palette.black.main,
  backgroundColor: !lightMode
    ? (theme.vars || theme).palette.alphaLight300.main
    : (theme.vars || theme).palette.white.main,
  boxShadow: '0 4px 6px #00000020',
  borderRadius: theme.spacing(2),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
}));
