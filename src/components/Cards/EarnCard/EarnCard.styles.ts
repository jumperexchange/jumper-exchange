import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import InfoIcon from '@mui/icons-material/Info';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

interface EarnCardContainerProps {
  hasLink?: boolean;
}

const EarnCardContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'hasLink',
})<EarnCardContainerProps>(({ theme, hasLink }) => ({
  backgroundColor: (theme.vars || theme).palette.surface1.main,
  borderRadius: theme.shape.cardBorderRadius,
  boxShadow: theme.shadows[2],
  cursor: hasLink ? 'pointer' : 'default',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: hasLink ? `0 4px 24px 0 rgba(0,0,0,.08)` : theme.shadows[2],
  },
  ...theme.applyStyles('dark', {
    backgroundColor: (theme.vars || theme).palette.surface2.main,
  }),
}));

export const CompactEarnCardContainer = styled(EarnCardContainer)(
  ({ theme }) => ({
    padding: theme.spacing(4, 3, 3),
    minHeight: 330,
    height: '-webkit-fill-available',
  }),
);

export const CompactEarnCardHeaderContainer = styled(Stack)(({ theme }) => ({
  justifyContent: 'space-between',
  alignItems: 'start',
}));

export const CompactEarnCardTagContainer = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(1),
}));

export const CompactEarnCardContentContainer = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(2),
}));

export const CompactEarnCardItemHeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center',
}));

export const CompactEarnCardItemContentContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center',
}));

export const TooltipIcon = styled(InfoIcon)(({ theme }) => ({
  height: '16px',
  width: '16px',
  cursor: 'help',
  color: (theme.vars || theme).palette.iconHint,
}));

export const CompactEarnCardItemValuePrepend = styled(Box)(({ theme }) => ({}));

export const CompactEarnCardItemValue = styled(Typography)(({ theme }) => ({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical',
}));

export const CompactEarnCardItemValueAppend = styled(Typography)(
  ({ theme }) => ({
    mb: theme.spacing(0.25),
    color: (theme.vars || theme).palette.alphaLight800.main,
    ...theme.applyStyles('light', {
      color: (theme.vars || theme).palette.alphaDark800.main,
    }),
  }),
);

export const BaseSkeleton = styled(Skeleton)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.surface2.main,
  transform: 'none',
}));

export const ListItemEarnCardContainer = styled(EarnCardContainer)(
  ({ theme }) => ({
    padding: theme.spacing(3),
  }),
);

export const ListItemEarnContentWrapper = styled(Stack)(({ theme }) => ({
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

export const ListItemEarnCardTagContainer = styled(Stack)(({ theme }) => ({
  rowGap: theme.spacing(2),
  columnGap: theme.spacing(1),
  alignItems: 'center',
}));
