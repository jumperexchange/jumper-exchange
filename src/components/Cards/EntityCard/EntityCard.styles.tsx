import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card, { CardProps } from '@mui/material/Card';
import Chip, { ChipProps } from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import Stack, { StackProps } from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { Link } from 'src/components/Link';

// Card & Containers

export const StyledEntityCard = styled(Card)<CardProps>(
  ({ theme, onClick }) => ({
    borderRadius: theme.shape.cardBorderRadius,
    boxShadow: theme.shadows[2],
    cursor: onClick ? 'pointer' : 'default',
    '&:hover': {
      boxShadow: onClick ? `0 4px 24px 0 rgba(0,0,0,.08)` : theme.shadows[2],
    },
  }),
);

export const StyledEntityCardContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 3, 3, 3),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  backgroundColor: (theme.vars || theme).palette.background.default,
  position: 'relative',
  ...theme.applyStyles('light', {
    backgroundColor: (theme.vars || theme).palette.white.main,
  }),
}));

export const StyledEntityCardBadgeContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2.5),
  zIndex: 1,
}));

// Image

export const StyledEntityCardImageContainer = styled(Box)(() => ({
  display: 'block',
  position: 'relative',
}));

export const StyledEntityCardImage = styled(Image)(() => ({
  objectFit: 'cover',
  objectPosition: 'center',
  aspectRatio: '2 / 1',
  height: '100%',
  width: '100%',
}));

// Titles & Description

export const StyledEntityCardTitleBase = styled(Typography)(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
}));

export const StyledCompactEntityCardTitle = styled(StyledEntityCardTitleBase)(
  ({ theme }) => ({
    ...theme.typography.titleXSmall,
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),
);

export const StyledWideEntityCardTitle = styled(StyledEntityCardTitleBase)(
  ({ theme }) => ({
    ...theme.typography.headerMedium,
  }),
);

export const StyledEntityCardDescription = styled(Typography)(({ theme }) => ({
  ...theme.typography.bodyMedium,
  color: (theme.vars || theme).palette.text.primary,
  opacity: 0.64,
  lineHeight: '150%',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 12,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

// Link

export const StyledEntityCardLink = styled(Link)(({ theme }) => ({
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
}));

// Avatars

const BaseAvatar = styled(Avatar)(({ theme }) => ({
  boxSizing: 'content-box',
  border: 2,
  borderStyle: 'solid',
  borderColor: (theme.vars || theme).palette.background.default,
  ...theme.applyStyles('light', {
    borderColor: (theme.vars || theme).palette.white.main,
  }),
}));

export const StyledCompactParticipantAvatar = styled(BaseAvatar)(() => ({
  height: 32,
  width: 32,
}));

export const StyledWideParticipantAvatar = styled(BaseAvatar)(() => ({
  height: 40,
  width: 40,
}));

export const StyledParticipantsContainer = styled((props: StackProps) => (
  <Stack direction="row" spacing={-1.25} {...props} />
))(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: theme.spacing(3),
  transform: 'translateY(-50%)',
}));

// Rewards & Chips

export const StyledRewardsContainer = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(1),
  flexWrap: 'wrap',
}));

/*
 * Currently this component is not clickable,
 * but passing an onClick prop to the parent container makes it throw an error.
 * https://github.com/mui/material-ui/issues/46262
 */
export const StyledCompactRewardChipContainer = styled((props: ChipProps) => {
  return <Chip {...props} onClick={() => {}} />;
})(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
  backgroundColor: (theme.vars || theme).palette.alphaLight100.main,
  borderRadius: (theme.vars || theme).shape.buttonBorderRadius,
  '& .MuiChip-label': {
    padding: theme.spacing(0, 0.75),
  },
  '& .MuiChip-avatar': {
    width: 'fit-content',
    padding: theme.spacing(0, 0.25),
    margin: 0,
  },
  ...theme.applyStyles('light', {
    backgroundColor: (theme.vars || theme).palette.alphaDark100.main,
  }),
}));

export const StyledWideRewardChipContainer = styled(
  StyledCompactRewardChipContainer,
)(() => ({
  height: 48,
}));

export const StyledCompactRewardLabel = styled(Typography)(({ theme }) => ({
  ...theme.typography.bodySmallStrong,
}));

export const StyledRewardsAvatarsContainer = styled((props: StackProps) => (
  <Stack direction="row" spacing={-1.25} alignItems="center" {...props} />
))(({ theme }) => ({}));

export const StyledRewardAvatar = styled(BaseAvatar)(({ theme }) => ({
  height: 24,
  width: 24,
  [theme.breakpoints.up('sm')]: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
}));

// Skeletons

export const BaseSkeleton = styled(Skeleton)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.grey[100],
}));

export const BaseStyledSkeleton = styled(Skeleton)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.surface1.main,
}));

export const StyledAvatarSkeleton = styled(BaseStyledSkeleton)(({ theme }) => ({
  boxSizing: 'content-box',
  border: 2,
  borderStyle: 'solid',
  borderColor: (theme.vars || theme).palette.background.default,
  ...theme.applyStyles('light', {
    borderColor: (theme.vars || theme).palette.white.main,
  }),
}));

export const StyledContentSkeleton = styled(BaseStyledSkeleton)(
  ({ theme }) => ({
    height: theme.spacing(2),
    transform: 'none',
  }),
);

export const StyledShapeSkeleton = styled(BaseStyledSkeleton)(
  ({ theme }) => ({}),
);

export const StyledContentSkeletonContainer = styled((props: StackProps) => (
  <Stack direction="column" spacing={1} {...props} />
))(({ theme }) => ({}));
