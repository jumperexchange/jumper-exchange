import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

interface HeroEarnCardContainerProps {
  hasLink?: boolean;
}

export const HeroEarnCardContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'hasLink',
})<HeroEarnCardContainerProps>(({ theme, hasLink }) => ({
  backgroundColor: (theme.vars || theme).palette.surface1.main,
  borderRadius: theme.shape.cardBorderRadius,
  boxShadow: theme.shadows[3],
  cursor: hasLink ? 'pointer' : 'default',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: hasLink ? `0 4px 24px 0 rgba(0,0,0,.08)` : theme.shadows[2],
  },
  ...theme.applyStyles('dark', {
    backgroundColor: (theme.vars || theme).palette.surface2.main,
  }),
  padding: theme.spacing(3),
  gap: theme.spacing(0.5),
  minHeight: 312,
  height: '-webkit-fill-available',
  display: 'flex',
  flexDirection: 'column',
}));

export const HeroEarnCardHeaderContainer = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(0.5),
}));

interface HeroEarnCardContentContainerProps {
  isMain?: boolean;
}

export const HeroEarnCardContentContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isMain',
})<HeroEarnCardContentContainerProps>(({ theme, isMain }) => ({
  marginBottom: theme.spacing(1),
  gap: theme.spacing(2),
  '&, & > *': {
    ...(isMain ? theme.typography.titleMedium : theme.typography.titleSmall),
    margin: 0,
  },
}));

export const HeroEarnCardFooterContainer = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(2),
  flexDirection: 'column-reverse',
  flex: '1',
}));

export const HeroEarnCardFooterContentContainer = styled(Stack)(
  ({ theme }) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
  }),
);

export const BaseSkeleton = styled(Skeleton)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.surface2.main,
  transform: 'none',
}));
