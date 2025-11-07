import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { BaseSurfaceSkeleton } from 'src/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import { Link } from 'src/components/Link/Link';
import { getTextEllipsisStyles } from 'src/utils/styles/getTextEllipsisStyles';

export const ProtocolCardContainer = styled(Box)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.surface1.main,
  borderRadius: theme.shape.cardBorderRadius,
  boxShadow: theme.shadows[2],
  transition: 'all 0.3s ease-in-out',
  ...theme.applyStyles('dark', {
    backgroundColor: (theme.vars || theme).palette.surface2.main,
  }),
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}));

interface ProtocolCardHeaderContainerProps {
  backgroundUrl: string;
}

export const ProtocolCardHeaderContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'backgroundUrl',
})<ProtocolCardHeaderContainerProps>(({ theme, backgroundUrl }) => ({
  display: 'block',
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '" "',
    position: 'absolute',
    height: '100%',
    width: '100%',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    background: `url(${backgroundUrl}), ${(theme.vars || theme).palette.surface2.main}`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    transform: 'scale(6)',
    filter: 'blur(96px)',
  },
}));

export const ProtocolCardHeaderBadgeContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(3),
  right: theme.spacing(3),
  zIndex: 1,
}));

export const ProtocolCardHeaderContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(0, 3),
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '100%',
}));

export const ProtocolCardProtocolTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.urbanistTitle2XLarge,
  ...getTextEllipsisStyles(1),
  whiteSpace: 'nowrap',
  maxWidth: '100%',
}));

export const ProtocolCardProtocolAvatar = styled(Image)(({ theme }) => ({
  objectFit: 'cover',
  objectPosition: 'center',
  aspectRatio: '1 / 1',
  borderRadius: '50%',
  border: `2px solid`,
  borderColor: (theme.vars || theme).palette.surface2.main,
  backgroundColor: (theme.vars || theme).palette.surface2.main,
  ...theme.applyStyles('light', {
    borderColor: (theme.vars || theme).palette.surface1.main,
    backgroundColor: (theme.vars || theme).palette.surface1.main,
  }),
}));

export const ProtocolCardContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  gap: theme.spacing(3),
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: (theme.vars || theme).palette.surface2.main,
  ...theme.applyStyles('light', {
    backgroundColor: (theme.vars || theme).palette.surface1.main,
  }),
}));

export const ProtocolCardContentHeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(3),
}));

export const ProtocolCardTagsContainer = styled(Stack)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const ProtocolCardDescriptionContainer = styled(Typography)(
  ({ theme }) => ({
    color: (theme.vars || theme).palette.text.secondary,
    ...getTextEllipsisStyles(4),
    overflow: 'hidden',
    whiteSpace: 'break-spaces',
    marginBottom: 'auto',
  }),
);

export const ProtocolCardLink = styled(Link)(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  ...theme.typography.bodyMediumStrong,
  textDecoration: 'none',
  display: 'inline-flex',
  width: 'fit-content',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  transition: 'color 0.3s ease',
  '&:hover': {
    color: (theme.vars || theme).palette.primary.main,
  },
  '& svg': {
    width: 20,
    height: 20,
  },
}));

export const BaseSkeleton = styled(BaseSurfaceSkeleton)(({ theme }) => ({}));
