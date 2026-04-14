import MuiNotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import MuiBadge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import type { Theme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { getSurfaceBorder } from '@/theme/utils/getSurfaceBorder';
import { getTextEllipsisStyles } from '@/utils/styles/getTextEllipsisStyles';

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
  },
}));

export const NotificationPaper = styled(Paper)(({ theme }) => ({
  background: (theme.vars || theme).palette.surface1.main,
  border: getSurfaceBorder(theme, 'surface1'),
  borderRadius: theme.shape.cardContainerBorderRadius,
  width: 400,
  maxHeight: 600,
  display: 'flex',
  flexDirection: 'column',
  boxShadow: theme.shadows[1],
  overflow: 'hidden',
}));

export const NotificationHeaderContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 3, 0.5, 3),
}));

export const NotificationHeaderTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.bodyMediumStrong,
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

interface NotificationItemContainerProps {
  isRead: boolean;
}

export const NotificationItemContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isRead',
})<NotificationItemContainerProps>(({ theme }) => ({
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
  variants: [
    {
      props: { isRead: false },
      style: {
        backgroundColor: (theme.vars || theme).palette.surface2.main,
      },
    },
  ],
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
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minWidth: 0,
  paddingRight: theme.spacing(4.5),
  gap: theme.spacing(0.5),
}));

export const NotificationTitleRow = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 8,
}));

export const NotificationTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.bodySmallStrong,
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
  ...getTextEllipsisStyles(2),
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

export const EmptyState = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(6, 2),
  color: (theme.vars || theme).palette.text.secondary,
  ...theme.typography.bodyMedium,
}));
