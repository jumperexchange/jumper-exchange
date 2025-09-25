import { styled } from '@mui/material/styles';
import Tabs, { TabsProps } from '@mui/material/Tabs';
import Tab, { TabProps } from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Badge, { BadgeProps } from '@mui/material/Badge';

interface StyledTabsProps extends TabsProps {
  showBorder?: boolean;
  size?: 'small' | 'medium' | 'large';
}

interface StyledTabProps extends TabProps {
  size?: 'small' | 'medium' | 'large';
}

const getTabSize = (size?: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small':
      return {
        minHeight: 32,
        padding: '6px 16px',
        fontSize: '0.875rem',
      };
    case 'large':
      return {
        minHeight: 48,
        padding: '12px 32px',
        fontSize: '1.125rem',
      };
    case 'medium':
    default:
      return {
        minHeight: 40,
        padding: '8px 24px',
        fontSize: '1rem',
      };
  }
};

const getPillRadius = (size?: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small':
      return 16;
    case 'large':
      return 24;
    case 'medium':
    default:
      return 20;
  }
};

export const StyledTabs = styled(Tabs, {
  shouldForwardProp: (prop) => prop !== 'showBorder' && prop !== 'size',
})<StyledTabsProps>(({ theme, showBorder, size }) => {
  const pillRadius = getPillRadius(size);

  return {
    minHeight: size === 'small' ? 32 : size === 'large' ? 48 : 40,
    position: 'relative',
    backgroundColor: (theme.vars || theme).palette.action.hover,
    borderRadius: pillRadius,
    padding: '3px',
    display: 'inline-flex',
    ...(showBorder && {
      border: `1px solid ${(theme.vars || theme).palette.divider}`,
    }),
    '& .MuiTabs-indicator': {
      height: '100%',
      borderRadius: pillRadius - 3,
      backgroundColor: (theme.vars || theme).palette.background.paper,
      boxShadow: '0 2px 8px 0 rgba(0,0,0,0.1)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 1,
      bottom: 0,
      border: 'none',
    },
    '& .MuiTabs-flexContainer': {
      position: 'relative',
      zIndex: 2,
      gap: 0,
    },
    '& .MuiTabs-scrollButtons': {
      '&.Mui-disabled': {
        opacity: 0.3,
      },
    },
  };
});

export const StyledTab = styled(Tab, {
  shouldForwardProp: (prop) => prop !== 'size',
})<StyledTabProps>(({ theme, size = 'medium' }) => ({
  textTransform: 'none',
  fontWeight: 500,
  color: (theme.vars || theme).palette.text.secondary,
  position: 'relative',
  zIndex: 2,
  opacity: 0.7,
  ...getTabSize(size),
  minWidth: 'auto',
  '&:first-of-type': {
    borderTopLeftRadius: getPillRadius(size) - 3,
    borderBottomLeftRadius: getPillRadius(size) - 3,
  },
  '&:last-of-type': {
    borderTopRightRadius: getPillRadius(size) - 3,
    borderBottomRightRadius: getPillRadius(size) - 3,
  },
  '&.Mui-selected': {
    color: (theme.vars || theme).palette.text.primary,
    fontWeight: 600,
    opacity: 1,
  },
  '&.Mui-disabled': {
    opacity: 0.3,
    cursor: 'not-allowed',
  },
  '&:hover:not(.Mui-selected):not(.Mui-disabled)': {
    opacity: 0.85,
  },
  '& .MuiTab-iconWrapper': {
    marginBottom: size === 'small' ? 2 : 4,
  },
  transition: theme.transitions.create(['color', 'opacity'], {
    duration: theme.transitions.duration.short,
  }),
  // Disable ripple effect for cleaner pill aesthetic
  disableRipple: true,
}));

export const TabContainer = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
}));

export const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -8,
    top: 8,
    border: `2px solid ${(theme.vars || theme).palette.background.paper}`,
    padding: '0 4px',
    backgroundColor: (theme.vars || theme).palette.primary.main,
    color: (theme.vars || theme).palette.primary.contrastText,
    fontSize: '0.75rem',
    minWidth: 20,
    height: 20,
  },
}));

export const TabContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: (theme.vars || theme).palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(1),
}));

export const IconWrapper = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(0.5),
  '& > svg': {
    fontSize: '1.25rem',
  },
}));
