'use client';

import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { WIDGET_WIDTH } from 'src/config/widgetConfig';
import { VerticalTabs } from '@/components/Menus/VerticalMenu/VerticalTabs';
import { useHeaderHeight } from '@/hooks/useHeaderHeight';
import { mergeSx } from '@/utils/theme/mergeSx';
import { getWidgetStickyTop } from './widgetStickyLayout';

const WIDGET_COL_WIDTH = WIDGET_WIDTH;
const SIDE_COL_WIDTH_DESKTOP = 704;
const GRID_GAP_PX = 24;
const STAGE_SHADOW_INSET_PX = 12;
const LAYOUT_TRANSITION = { duration: 0.28, ease: 'easeOut' } as const;

const getGridTemplateColumns = (
  hasSidePanel: boolean,
  isSidePanelExpanded: boolean,
  isWelcomeScreenOpen: boolean,
) => {
  const widgetOnly = 'auto auto';
  // minmax(0, ...) lets these columns shrink below their ideal width instead
  // of overflowing when the collapsed side panel doesn't have its full width
  // available (e.g. narrower "lg" viewports).
  const withSideTablet = `minmax(0, ${WIDGET_COL_WIDTH}px) minmax(0, ${WIDGET_COL_WIDTH}px)`;
  const withSideDesktop = `auto minmax(0, ${WIDGET_COL_WIDTH}px) minmax(0, ${SIDE_COL_WIDTH_DESKTOP}px)`;
  const expandedTablet = `${WIDGET_COL_WIDTH}px minmax(0, 1fr)`;
  const expandedDesktop = `auto ${WIDGET_COL_WIDTH}px minmax(0, 1fr)`;

  if (!hasSidePanel || isWelcomeScreenOpen) {
    return { xs: 'minmax(0, 1fr)', lg: widgetOnly };
  }

  if (isSidePanelExpanded) {
    return {
      xs: 'minmax(0, 1fr)',
      md: expandedTablet,
      lg: expandedDesktop,
    };
  }

  return {
    xs: 'minmax(0, 1fr)',
    md: withSideTablet,
    lg: withSideDesktop,
  };
};

interface WidgetStageProps {
  announcementContent?: ReactNode;
  formContent: ReactNode;
  sidePanelContent?: ReactNode;
  isSidePanelExpanded?: boolean;
  isWelcomeScreenOpen?: boolean;
  sx?: SxProps<Theme>;
}

const getStageSx = (
  hasSidePanel: boolean,
  isSidePanelExpanded: boolean,
  hasAnnouncement: boolean,
  isWelcomeScreenOpen: boolean,
): SxProps<Theme> => {
  const isSidePanelLayoutActive = hasSidePanel && !isWelcomeScreenOpen;

  return {
    display: 'grid',
    columnGap: `${GRID_GAP_PX}px`,
    rowGap: `${GRID_GAP_PX}px`,
    boxSizing: 'border-box',
    height: 'auto',
    minHeight: 'auto',
    overflow: 'visible',
    width: {
      xs: '100%',
      md: isSidePanelLayoutActive ? '100%' : 'fit-content',
      lg: isSidePanelLayoutActive ? undefined : 'fit-content',
    },
    maxWidth: '100%',
    marginX: isSidePanelLayoutActive ? undefined : { md: 'auto', lg: 'auto' },
    justifyContent: {
      md:
        isSidePanelLayoutActive && !isSidePanelExpanded ? 'center' : undefined,
    },
    px: { md: `${STAGE_SHADOW_INSET_PX}px` },
    alignItems: 'start',
    alignContent: 'start',
    transition: `grid-template-columns ${LAYOUT_TRANSITION.duration * 1000}ms ${LAYOUT_TRANSITION.ease}`,
    gridTemplateColumns: getGridTemplateColumns(
      hasSidePanel,
      isSidePanelExpanded,
      isWelcomeScreenOpen,
    ),
    gridTemplateRows: {
      xs: hasSidePanel
        ? hasAnnouncement
          ? 'auto auto auto'
          : 'auto auto'
        : hasAnnouncement
          ? 'auto auto'
          : 'auto',
      md: hasAnnouncement ? 'auto auto' : 'auto',
    },
    gridTemplateAreas: {
      xs: hasSidePanel
        ? hasAnnouncement
          ? '"banner" "form" "sidePanel"'
          : '"form" "sidePanel"'
        : hasAnnouncement
          ? '"banner" "form"'
          : '"form"',
    },
  };
};

const getStickyColumnSx = (stickyTop: string): SxProps<Theme> => ({
  position: { md: 'sticky' },
  top: { md: stickyTop },
  alignSelf: 'start',
});

const getWidgetWidthSx = (constrained = true): SxProps<Theme> => ({
  width: '100%',
  ...(constrained && { maxWidth: { sm: WIDGET_WIDTH } }),
  justifySelf: { sm: 'center' },
});

export const WidgetStage = ({
  announcementContent,
  formContent,
  sidePanelContent,
  isSidePanelExpanded = false,
  isWelcomeScreenOpen = false,
  sx,
}: WidgetStageProps) => {
  const theme = useTheme();
  const headerHeightPx = useHeaderHeight();
  const isHeaderHidden = useScrollTrigger();
  const hasAnnouncement = Boolean(announcementContent);
  const hasSidePanel = Boolean(sidePanelContent);
  const bannerStickyTop = getWidgetStickyTop(
    isHeaderHidden ? 0 : headerHeightPx,
    theme,
  );
  const bannerRef = useRef<HTMLDivElement>(null);
  const contentRow = hasAnnouncement ? 2 : 1;
  const [bannerHeightPx, setBannerHeightPx] = useState(0);

  const widgetStickyTop =
    hasAnnouncement && bannerHeightPx > 0
      ? `calc(${bannerStickyTop} + ${bannerHeightPx + GRID_GAP_PX}px)`
      : bannerStickyTop;

  const stickyColumnSx = isWelcomeScreenOpen
    ? {}
    : getStickyColumnSx(widgetStickyTop);

  const welcomeOpenStageSx: SxProps<Theme> = isWelcomeScreenOpen
    ? {
        overflow: 'hidden',
        '@media screen and (min-height: 700px)': {
          overflow: 'visible',
        },
      }
    : {};

  useEffect(() => {
    const banner = bannerRef.current;
    if (!hasAnnouncement || !banner) {
      setBannerHeightPx(0);
      return;
    }

    const updateBannerHeight = () => {
      setBannerHeightPx(banner.offsetHeight);
    };

    updateBannerHeight();

    const observer = new ResizeObserver(updateBannerHeight);
    observer.observe(banner);

    return () => {
      observer.disconnect();
    };
  }, [hasAnnouncement]);

  return (
    <Box
      data-expanded={hasSidePanel && isSidePanelExpanded ? '' : undefined}
      sx={mergeSx(
        getStageSx(
          hasSidePanel,
          isSidePanelExpanded,
          hasAnnouncement,
          isWelcomeScreenOpen,
        ),
        welcomeOpenStageSx,
        sx,
      )}
    >
      {hasAnnouncement && (
        <>
          <Box
            sx={{
              gridArea: { xs: 'banner' },
              display: { xs: 'flex', md: 'none' },
              justifyContent: 'center',
              width: '100%',
              maxWidth: { sm: WIDGET_WIDTH },
              justifySelf: { sm: 'center' },
              flexShrink: 0,
            }}
          >
            {announcementContent}
          </Box>
          <Box
            ref={bannerRef}
            sx={{
              gridColumn: { md: hasSidePanel ? '1' : '2', lg: '2' },
              gridRow: { md: 1 },
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'center',
              width: '100%',
              maxWidth: WIDGET_WIDTH,
              justifySelf: 'center',
              flexShrink: 0,
              ...(isWelcomeScreenOpen
                ? {}
                : {
                    position: { md: 'sticky' },
                    top: { md: bannerStickyTop },
                    zIndex: { md: 1 },
                  }),
            }}
          >
            {announcementContent}
          </Box>
        </>
      )}
      <Box
        sx={{
          gridColumn: { lg: '1' },
          gridRow: { md: contentRow },
          display: { xs: 'none', lg: isWelcomeScreenOpen ? 'none' : 'block' },
          minHeight: 0,
          ...stickyColumnSx,
        }}
      >
        <VerticalTabs />
      </Box>
      <Box
        sx={mergeSx(
          {
            gridArea: { xs: 'form' },
            gridColumn: { md: hasSidePanel ? '1' : '2', lg: '2' },
            gridRow: { md: contentRow },
            minWidth: 0,
            minHeight: 0,
            zIndex: 10,
          },
          getWidgetWidthSx(hasSidePanel),
          stickyColumnSx,
        )}
      >
        {formContent}
      </Box>
      {hasSidePanel && (
        <Box
          sx={mergeSx(
            {
              display: isWelcomeScreenOpen ? 'none' : undefined,
              gridArea: { xs: 'sidePanel' },
              gridColumn: { md: '2', lg: '3' },
              gridRow: { md: contentRow },
              minWidth: 0,
              width: '100%',
              maxWidth: { sm: WIDGET_WIDTH, md: 'none' },
              justifySelf: { xs: 'stretch', sm: 'center', md: 'stretch' },
            },
            stickyColumnSx,
          )}
        >
          {sidePanelContent}
        </Box>
      )}
    </Box>
  );
};
