import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { BaseSurfaceSkeleton } from 'src/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import { getTextEllipsisStyles } from 'src/utils/styles/getTextEllipsisStyles';

interface TitleWithHintContainerProps {
  gap?: number;
}

export const TitleWithHintContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'gap',
})<TitleWithHintContainerProps>(({ gap }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: gap || 2,
  overflow: 'hidden',
}));

export const TitleWithHintTitle = styled(Typography)(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  ...getTextEllipsisStyles(1),
}));

export const TitleWithHintHint = styled(Typography)(({ theme }) => ({
  color: (theme.vars || theme).palette.text.secondary,
  ...getTextEllipsisStyles(1),
}));

export const TitleWithHintTypographySkeleton = styled(BaseSurfaceSkeleton)(
  ({ theme }) => ({
    width: '100%',
    height: '100%',
    minWidth: 100,
    minHeight: 16,
    lineHeight: '100%',
  }),
);
