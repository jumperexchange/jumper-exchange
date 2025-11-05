import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { getTextEllipsisStyles } from 'src/utils/styles/getTextEllipsisStyles';

export const TitleWithHintContainer = styled(Box)(({}) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
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

export const TitleWithHintTypographySkeleton = styled(Skeleton)(
  ({ theme }) => ({
    backgroundColor: (theme.vars || theme).palette.surface1.main,
    ...theme.applyStyles('light', {
      backgroundColor: (theme.vars || theme).palette.surface2.main,
    }),
    transform: 'none',
    width: '100%',
    height: '100%',
    minWidth: 100,
    minHeight: 16,
    lineHeight: '100%',
  }),
);
