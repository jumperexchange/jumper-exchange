import MuiNotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import MuiBadge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import type { Theme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { getSurfaceBorder } from '@/theme/utils/getSurfaceBorder';

const getIconProps = (theme: Theme) => ({
  fontSize: '24px',
  color: (theme.vars || theme).palette.white.main,
  ...theme.applyStyles('light', {
    color: (theme.vars || theme).palette.black.main,
  }),
});

export const BellIcon = styled(MuiNotificationsNoneRoundedIcon)(({ theme }) =>
  getIconProps(theme),
);

export const NotificationBadge = styled(MuiBadge)(() => ({
  display: 'inline-flex',
  overflow: 'visible',
  '& .MuiBadge-badge': {
    fontSize: 11,
    minWidth: 18,
    height: 18,
    padding: '0 4px',
    top: '14%',
    right: '14%',
    transform: 'scale(1) translate(calc(50% - 2.5px), calc(-50% + 2.5px))',
    transformOrigin: '100% 0%',
  },
}));

export const NotificationPaper = styled(Paper)(({ theme }) => ({
  background: (theme.vars || theme).palette.surface1.main,
  border: getSurfaceBorder(theme, 'surface1'),
  borderRadius: theme.shape.borderRadius,
  width: 400,
  maxHeight: 600,
  display: 'flex',
  flexDirection: 'column',
  boxShadow: theme.shadows[1],
  marginTop: -2,
  overflow: 'hidden',
}));

export const NotificationHeaderContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 2.5, 0.5, 2.5),
}));

export const NotificationHeaderTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.bodyLargeStrong,
  color: (theme.vars || theme).palette.text.primary,
}));

export const NotificationHeaderSubtitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.bodySmall,
  color: (theme.vars || theme).palette.text.secondary,
  marginTop: theme.spacing(0.25),
}));

export const FilterRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  padding: theme.spacing(0.5, 2.5, 1.5, 2.5),
  borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

export const NotificationListContainer = styled(Box)(() => ({
  overflowY: 'auto',
  flex: 1,
}));

export const NotificationItemContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2, 2.5),
  cursor: 'pointer',
  position: 'relative',
  borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
  transition: 'background-color 0.15s ease',
  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.surface2.main,
  },
  '&:hover .notification-trash': {
    opacity: 1,
  },
  '&:last-child': {
    borderBottom: 'none',
  },
}));

export const UnreadDot = styled(Box)(({ theme }) => ({
  width: 8,
  height: 8,
  minWidth: 8,
  borderRadius: '50%',
  backgroundColor: (theme.vars || theme).palette.primary.main,
  marginTop: theme.spacing(0.75),
}));

export const NotificationContent = styled(Box)(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  paddingRight: theme.spacing(4.5),
}));

export const NotificationTitleRow = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 8,
}));

export const NotificationTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.bodyMediumStrong,
  color: (theme.vars || theme).palette.text.primary,
  flex: 1,
  minWidth: 0,
}));

export const NotificationDate = styled(Typography)(({ theme }) => ({
  ...theme.typography.bodyXSmall,
  color: (theme.vars || theme).palette.text.secondary,
  marginTop: theme.spacing(0.25),
  whiteSpace: 'nowrap',
}));

export const NotificationBody = styled(Typography)(({ theme }) => ({
  ...theme.typography.bodySmall,
  color: (theme.vars || theme).palette.text.secondary,
  marginTop: theme.spacing(0.5),
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

export const NotificationFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

export const CtaLink = styled('a')(({ theme }) => ({
  ...theme.typography.bodySmallStrong,
  color: (theme.vars || theme).palette.text.primary,
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  cursor: 'pointer',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
  '& .MuiSvgIcon-root': {
    fontSize: 14,
  },
}));

export const TrashButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1.5),
  right: theme.spacing(1.5),
  opacity: 0,
  transition: 'opacity 0.15s ease',
  padding: theme.spacing(0.5),
  color: (theme.vars || theme).palette.text.secondary,
  '&:hover': {
    color: (theme.vars || theme).palette.text.primary,
  },
}));

export const EmptyState = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(6, 2),
  color: (theme.vars || theme).palette.text.secondary,
  ...theme.typography.bodyMedium,
}));
