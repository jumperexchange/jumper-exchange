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
        minHeight: 36,
        padding: '6px 12px',
        fontSize: '0.875rem',
      };
    case 'large':
      return {
        minHeight: 56,
        padding: '12px 24px',
        fontSize: '1.125rem',
      };
    case 'medium':
    default:
      return {
        minHeight: 48,
        padding: '8px 16px',
        fontSize: '1rem',
      };
  }
};

export const StyledTabs = styled(Tabs, {
  shouldForwardProp: (prop) => prop !== 'showBorder' && prop !== 'size',
})<StyledTabsProps>(({ theme, showBorder, size }) => ({
  minHeight: size === 'small' ? 36 : size === 'large' ? 56 : 48,
  ...(showBorder && {
    borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
  }),
  '& .MuiTabs-indicator': {
    backgroundColor: (theme.vars || theme).palette.primary.main,
    height: size === 'small' ? 2 : 3,
  },
  '& .MuiTabs-scrollButtons': {
    '&.Mui-disabled': {
      opacity: 0.3,
    },
  },
}));

export const StyledTab = styled(Tab, {
  shouldForwardProp: (prop) => prop !== 'size',
})<StyledTabProps>(({ theme, size = 'medium' }) => ({
  textTransform: 'none',
  fontWeight: 500,
  color: (theme.vars || theme).palette.text.secondary,
  ...getTabSize(size),
  '&.Mui-selected': {
    color: (theme.vars || theme).palette.primary.main,
    fontWeight: 600,
  },
  '&.Mui-disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  '&:hover': {
    color: (theme.vars || theme).palette.primary.light,
    backgroundColor: (theme.vars || theme).palette.action.hover,
  },
  '& .MuiTab-iconWrapper': {
    marginBottom: size === 'small' ? 2 : 4,
  },
  transition: theme.transitions.create(['color', 'background-color'], {
    duration: theme.transitions.duration.short,
  }),
}));

export const TabContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
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