import type { TabProps } from '@/components/Tabs';
import { Tabs } from '@/components/Tabs';
import { getContrastAlphaColor } from '@/utils/colors';
import type { Theme } from '@mui/material';
import { Skeleton, useMediaQuery, useTheme } from '@mui/material';
import { urbanist } from 'src/fonts/fonts';

interface BlogArticlesBoardTabsProps {
  openDropdown: boolean;
  filteredTags: TabProps[];
  tabId: number | undefined;
  ariaLabel: string;
}

export const BlogArticlesBoardTabs = ({
  openDropdown,
  filteredTags,
  tabId,
  ariaLabel,
}: BlogArticlesBoardTabsProps) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const containerStyles = {
    marginTop: theme.spacing(4),

    backgroundColor:
      !isDesktop && openDropdown
        ? theme.palette.surface1.main
        : theme.palette.mode === 'dark'
          ? getContrastAlphaColor(theme, '12%')
          : getContrastAlphaColor(theme, '4%'),
    display: 'flex',
    // height: openDropdown ? '68px' : 'auto',
    maxHeight: openDropdown ? 1000 : 0,
    // height: openDropdown ? 'auto' : 68,
    borderRadius: '12px',
    transitionProperty: 'max-height, background-color',
    transitionDuration: '.3s',
    transitionTimingFunction: 'ease-in-out',
    padding: !isDesktop ? theme.spacing(1) : theme.spacing(0.5, 1),
    overflow: 'hidden',
    width: '100%',
    maxWidth: '320px',
    zIndex: 1,
    ...(isDesktop && { minHeight: 68 }),
    ...(!isDesktop && { height: openDropdown ? 'auto' : 52 }),
    ...(!isDesktop && openDropdown && { margin: 0 }),

    [theme.breakpoints.up('lg')]: {
      maxWidth: 'unset',
      borderRadius: '28px',
      minWidth: 416,
      width: 'fit-content',
      display: 'flex',
    },

    div: {
      [theme.breakpoints.up('lg')]: {
        height: 56,
      },
    },

    ...(!isDesktop &&
      !openDropdown && {
        '.inactive': {
          display: 'none',
          backgroundColor: 'red',
        },
      }),

    '.MuiTabs-indicator': {
      minWidth: '80%',
      width: '100%',
      maxWidth: 320,
      left: '50%',
      top: !isDesktop ? 0 : `${theme.spacing(0.75)} !important`,
      borderRadius: '6px',
      transform: 'translateX(-50%)',
      zIndex: '-1',
      [theme.breakpoints.up('lg')]: {
        width: 'auto',
        minWidth: 'unset',
        position: 'absolute',
        top: '50% !important',
        left: 'unset',
        transform: 'translateY(-50%) scaleY(0.98)',
        backgroundColor:
          theme.palette.mode === 'dark'
            ? theme.palette.alphaLight300.main
            : theme.palette.white.main,
        ...(isDesktop && { height: 48 }),
        zIndex: -1,
        borderRadius: '24px',
      },
    },
  };

  const tabStyles = {
    height: 48,
    borderRadius: '6px',
    width: '100%',
    flexGrow: 0,
    maxWidth: '320px',
    padding: theme.spacing(1),
    fontFamily: urbanist.style.fontFamily,
    ...(!isDesktop && {
      height: openDropdown ? 'auto' : 32,
      margin: theme.spacing(0),
      span: { backgroundColor: 'transparent' },
    }),

    [theme.breakpoints.up('lg')]: {
      width: 142,
      borderRadius: '24px',
    },
  };

  return filteredTags ? (
    <Tabs
      data={filteredTags}
      value={tabId ?? 0}
      orientation={isDesktop ? 'horizontal' : 'vertical'}
      ariaLabel={ariaLabel}
      containerStyles={containerStyles}
      tabStyles={tabStyles}
    />
  ) : (
    <Skeleton sx={{ width: '100%', height: 68 }} />
  );
};
