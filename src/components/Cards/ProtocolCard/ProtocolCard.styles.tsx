import { getSurfaceBorder } from '@/theme/utils/getSurfaceBorder';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { BaseSurfaceSkeleton } from 'src/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import { getTextEllipsisStyles } from 'src/utils/styles/getTextEllipsisStyles';
import { SectionCardContainer } from '../SectionCard/SectionCard.style';
import Button from '@mui/material/Button';

export const ProtocolCardContainer = styled(Box)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.surface1.main,
  border: getSurfaceBorder(theme, 'surface1'),
  borderRadius: theme.shape.cardBorderRadius,
  boxShadow: theme.shadows[2],
  transition: 'all 0.3s ease-in-out',
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
    border: getSurfaceBorder(theme, 'surface2'),
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
  borderColor: (theme.vars || theme).palette.surface1.main,
  backgroundColor: (theme.vars || theme).palette.surface1.main,
}));

export const ProtocolCardContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  gap: theme.spacing(3),
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: (theme.vars || theme).palette.surface1.main,
}));

export const ProtocolCardContentHeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  [theme.breakpoints.up('sm')]: {
    columnGap: theme.spacing(3),
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export const ProtocolCardTitleContainer = styled(Stack)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'wrap',
  columnGap: theme.spacing(1.5),
  rowGap: theme.spacing(1),
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
    marginBottom: 'auto',
  }),
);

export const BaseSkeleton = styled(BaseSurfaceSkeleton)(({ theme }) => ({}));

export const ProtocolDescriptionModalContentContainer = styled(
  SectionCardContainer,
)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  width: 488,
  maxWidth: 'calc(100vw - 32px)',
}));

export const ProtocolCardDescriptionSeeMoreButton = styled(Button)(
  ({ theme }) => ({
    ...theme.typography.bodyMediumParagraph,
    fontWeight: 700,
    color: (theme.vars || theme).palette.text.secondary,
    padding: 0,
    height: 'auto',
    marginBottom: '2px',
  }),
);
