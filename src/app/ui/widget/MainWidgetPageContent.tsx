'use client';

import { type ReactNode } from 'react';
import { AnnouncementBannerWrapper } from '@/app/ui/app/AnnouncementBannerWrapper';
import { Widget } from '@/components/Widgets/Widget';
import { Widgets } from '@/components/Widgets/Widgets';
import { useWelcomeScreen } from '@/hooks/useWelcomeScreen';
import type { StarterVariantType } from '@/types/internal';
import { WidgetStage } from './WidgetStage';
import type { SxProps, Theme } from '@mui/material/styles';

interface MainWidgetPageContentProps {
  variant: StarterVariantType;
  activeTheme?: string;
  isLoading?: boolean;
  sidePanelContent?: ReactNode;
  isSidePanelExpanded?: boolean;
  sx?: SxProps<Theme>;
}

export const MainWidgetPageContent = ({
  variant,
  activeTheme,
  isLoading,
  sidePanelContent,
  isSidePanelExpanded = false,
  sx,
}: MainWidgetPageContentProps) => {
  const { welcomeScreenClosed, enabled } = useWelcomeScreen();
  const isWelcomeScreenClosed = welcomeScreenClosed || !enabled;

  return (
    <WidgetStage
      isSidePanelExpanded={isSidePanelExpanded}
      isWelcomeScreenOpen={!isWelcomeScreenClosed}
      announcementContent={
        isWelcomeScreenClosed ? (
          <AnnouncementBannerWrapper align="widget" />
        ) : undefined
      }
      formContent={
        <>
          <Widget
            activeTheme={activeTheme ?? variant}
            starterVariant={variant}
            isLoading={isLoading}
          />
          <Widgets />
        </>
      }
      sidePanelContent={sidePanelContent}
      sx={sx}
    />
  );
};
