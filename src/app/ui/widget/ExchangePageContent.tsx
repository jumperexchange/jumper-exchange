'use client';

import { useEffect } from 'react';
import { OrdersSection } from '@/components/LimitOrders/OrdersSection';
import { MarketPriceSection } from '@/components/LimitOrders/MarketPriceSection';
import { useWidgetSidePanelStore } from '@/stores/widgetSidePanel/WidgetSidePanelStore';
import { MainWidgetPageContent } from './MainWidgetPageContent';
import { WidgetSidePanel } from './WidgetSidePanel';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { IconButton } from '@/components/core/buttons/IconButton/IconButton';
import { Size, Variant } from '@/components/core/buttons/types';

export const ExchangePageContent = () => {
  const isSidePanelExpanded = useWidgetSidePanelStore(
    (state) => state.isSidePanelExpanded,
  );
  const toggleSidePanelExpanded = useWidgetSidePanelStore(
    (state) => state.toggleSidePanelExpanded,
  );

  useEffect(() => {
    return () => {
      useWidgetSidePanelStore.setState({ isSidePanelExpanded: false });
    };
  }, []);

  const expandButton = (
    <IconButton
      size={Size.SM}
      variant={Variant.AlphaLight}
      onClick={toggleSidePanelExpanded}
      aria-expanded={isSidePanelExpanded}
      aria-label={isSidePanelExpanded ? 'Collapse panels' : 'Expand panels'}
      data-testid="orders-section-expand"
      sx={{ height: 32, width: 32 }}
    >
      {isSidePanelExpanded ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
    </IconButton>
  );

  return (
    <MainWidgetPageContent
      variant="default"
      activeTheme="default"
      isSidePanelExpanded={isSidePanelExpanded}
      sidePanelContent={
        <WidgetSidePanel>
          <MarketPriceSection action={expandButton} />
          <OrdersSection
            isSidePanelExpanded={isSidePanelExpanded}
            action={expandButton}
          />
        </WidgetSidePanel>
      }
    />
  );
};
