'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { OrdersSection } from '@/components/LimitOrders/OrdersSection/OrdersSection';
import { MarketPriceSection } from '@/components/LimitOrders/MarketPriceSection/MarketPriceSection';
import { useWidgetSidePanelStore } from '@/stores/widgetSidePanel/WidgetSidePanelStore';
import { MainWidgetPageContent } from './MainWidgetPageContent';
import { WidgetSidePanel } from './WidgetSidePanel';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { IconButton } from '@/components/core/buttons/IconButton/IconButton';
import { Size, Variant } from '@/components/core/buttons/types';
import { useMediaQuery } from '@mui/material';

export const ExchangePageContent = () => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
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

  const expandButton = !isMobile ? (
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
  ) : null;

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
