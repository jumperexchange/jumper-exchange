import { styled } from '@mui/material/styles';
import Tab, { TabProps } from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

export enum HorizontalTabSize {
  MD = 'medium',
  LG = 'large',
}

export const HorizontalTabsContainer = styled(Tabs)(({ theme }) => ({
  flex: 1,
  backgroundColor: (theme.vars || theme).palette.surface2.main,
  padding: theme.spacing(0.5),
  borderRadius: theme.shape.tabBarRadius,
  display: 'inline-flex',
  [theme.breakpoints.up('md')]: {
    flex: 'unset',
  },
  '.MuiTabs-flexContainer': {
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  '.MuiTabs-scroller': {
    width: 'auto',
    overflow: 'unset !important',
  },
  '.MuiTabs-indicator': {
    position: 'absolute',
    top: '0',
    left: '0',
    height: 'auto',
    width: '100%',
    borderRadius: 24,
    transform: 'translateX(0) scaleX(0.98)',
    boxShadow: theme.shadows[2],
    backgroundColor: (theme.vars || theme).palette.surface1.main,
    zIndex: 1,
  },
}));

interface HorizontalTabProps extends TabProps {
  size?: HorizontalTabSize;
}

export const HorizontalTabContainer = styled(Tab, {
  shouldForwardProp: (prop) => prop !== 'size',
})<HorizontalTabProps>(({ theme, disabled }) => ({
  fontWeight: theme.typography.fontWeightBold,
  textTransform: 'none',
  borderRadius: 24,
  width: 'auto',
  background: 'transparent',
  margin: 0,
  transition: 'all .2s ease-in-out',
  color: disabled
    ? `${(theme.vars || theme).palette.text.disabled} !important`
    : `${(theme.vars || theme).palette.text.primary} !important`,
  zIndex: 1,
  flex: 1,
  [theme.breakpoints.up('md')]: {
    flex: 'unset',
  },
  '& .MuiTab-wrapper': {
    color: 'inherit',
  },
  '&.MuiButtonBase-root': {
    zIndex: 2,
    color: 'inherit',
    maxWidth: 'fit-content',
    width: 'fit-content',
  },
  ...(!disabled && {
    ':hover': {
      backgroundColor: (theme.vars || theme).palette.alphaLight100.main,
      ...theme.applyStyles('light', {
        backgroundColor: (theme.vars || theme).palette.buttonAlphaLightBg,
      }),
    },
  }),

  '&.Mui-selected': {
    pointerEvents: 'none',
    backgroundColor: 'transparent',
  },

  variants: [
    {
      props: ({ size }) => size === HorizontalTabSize.MD,
      style: {
        height: 40,
        padding: theme.spacing(1, 2),
        ...theme.typography.bodySmallStrong,
      },
    },
    {
      props: ({ size }) => size === HorizontalTabSize.LG,
      style: {
        height: 48,
        padding: theme.spacing(1.5, 2.5),
        ...theme.typography.bodyMediumStrong,
      },
    },
  ],
}));
