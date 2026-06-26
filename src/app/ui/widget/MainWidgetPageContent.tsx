'use client';

import type { ReactNode } from 'react';
import { AnnouncementBannerWrapper } from '@/app/ui/app/AnnouncementBannerWrapper';
import { Widget } from '@/components/Widgets/Widget';
import { Widgets } from '@/components/Widgets/Widgets';
import { useWelcomeScreen } from '@/hooks/useWelcomeScreen';
import type { StarterVariantType } from '@/types/internal';
import { WidgetStage } from './WidgetStage';

interface MainWidgetPageContentProps {
  variant: StarterVariantType;
  activeTheme?: string;
  isLoading?: boolean;
  sidePanelContent?: ReactNode;
  isSidePanelExpanded?: boolean;
}

export const MainWidgetPageContent = ({
  variant,
  activeTheme,
  isLoading,
  sidePanelContent,
  isSidePanelExpanded = false,
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
    />
  );
};
