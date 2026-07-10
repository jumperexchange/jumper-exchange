'use client';

import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { useEffect, useState } from 'react';
import { WidgetEvent, useWidgetEvents } from '@lifi/widget';
import { IconButton } from '@/components/core/buttons/IconButton/IconButton';
import { Size, Variant } from '@/components/core/buttons/types';
import { MarketPriceSection } from '@/components/LimitOrders/MarketPriceSection/MarketPriceSection';
import { OrdersSection } from '@/components/LimitOrders/OrdersSection/OrdersSection';
import { useWidgetSidePanelStore } from '@/stores/widgetSidePanel/WidgetSidePanelStore';
import { MainWidgetPageContent } from './MainWidgetPageContent';
import { WidgetSidePanel } from './WidgetSidePanel';
import { useTranslation } from 'react-i18next';


export const AdvancedPageContent = () => {
  const { t } = useTranslation();
  const widgetEvents = useWidgetEvents();
  const [isLimitTabActive, setIsLimitTabActive] = useState(false);
  const isSidePanelExpanded = useWidgetSidePanelStore(
    (state) => state.isSidePanelExpanded,
  );
  const toggleSidePanelExpanded = useWidgetSidePanelStore(
    (state) => state.toggleSidePanelExpanded,
  );

  useEffect(() => {
    const handler = ({ tab }: { tab: string }) => {
      setIsLimitTabActive(tab === 'limit');
    };
    widgetEvents.on(WidgetEvent.NavigationTabChanged, handler);
    return () => {
      widgetEvents.off(WidgetEvent.NavigationTabChanged, handler);
    };
  }, [widgetEvents]);

  useEffect(() => {
    return () => {
      useWidgetSidePanelStore.setState({ isSidePanelExpanded: false });
    };
  }, []);

  const expandButton = (
    <IconButton
      size={Size.SM}
      variant={Variant.AlphaDark}
      onClick={toggleSidePanelExpanded}
      aria-expanded={isSidePanelExpanded}
      aria-label={
        isSidePanelExpanded
          ? t('limitOrders.table.actions.collapsePanels')
          : t('limitOrders.table.actions.expandPanels')
      }
      data-testid="orders-section-expand"
      sx={{ height: 32, width: 32 }}
    >
      {isSidePanelExpanded ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
    </IconButton>
  );

  return (
    <MainWidgetPageContent
      variant="advanced"
      isSidePanelExpanded={isSidePanelExpanded}
      sidePanelContent={
        isLimitTabActive ? (<WidgetSidePanel>
          <MarketPriceSection action={expandButton} />
          <OrdersSection
            isSidePanelExpanded={isSidePanelExpanded}
            action={expandButton}
          />
        </WidgetSidePanel>
        ) : undefined
    }
    />
  );
};
