'use client';

import type { ChainId } from '@lifi/sdk';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { useMediaQuery } from '@mui/material';
import type React from 'react';
import { useEffect, useState } from 'react';
import { WidgetEvent, useWidgetEvents } from '@lifi/widget';
import type { Address } from 'viem';
import { IconButton } from '@/components/core/buttons/IconButton/IconButton';
import { Size, Variant } from '@/components/core/buttons/types';
import { MarketPriceSection } from '@/components/LimitOrders/MarketPriceSection/MarketPriceSection';
import { OrdersSection } from '@/components/LimitOrders/OrdersSection/OrdersSection';
import { useChains } from '@/hooks/useChains';
import { useTokens } from '@/hooks/useTokens';
import { datafeed } from '@/lib/tradingview/datafeed';
import { useChainTokenSelectionStore } from '@/stores/chainTokenSelection/ChainTokenSelectionStore';
import { useWidgetSidePanelStore } from '@/stores/widgetSidePanel/WidgetSidePanelStore';
import { createBaseToken } from '@/types/tokens';
import { MainWidgetPageContent } from './MainWidgetPageContent';
import { WidgetSidePanel } from './WidgetSidePanel';
import { useTranslation } from 'react-i18next';

const MarketPriceSectionConnected = ({
  action,
}: {
  action: React.ReactNode;
}) => {
  const { sourceChainToken } = useChainTokenSelectionStore();
  const { getToken } = useTokens();
  const { getChainById } = useChains();

  const { chainId, tokenAddress } = sourceChainToken;
  const rawFromToken =
    chainId && tokenAddress
      ? getToken(chainId as ChainId, tokenAddress as Address)
      : undefined;
  const fromToken = rawFromToken
    ? { ...rawFromToken, type: 'base' as const }
    : undefined;
  const chain = chainId ? getChainById(chainId as ChainId) : undefined;
  const nativeToken = chain?.nativeToken
    ? createBaseToken(chain.nativeToken)
    : undefined;

  if (!fromToken || !nativeToken) {
    return null;
  }

  return (
    <MarketPriceSection
      tokens={[fromToken, nativeToken]}
      chain={chain}
      datafeed={datafeed}
      action={action}
    />
  );
};

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
        isLimitTabActive ? (
          <WidgetSidePanel>
          {/* TODO: replace placeholder tokens with tokens from the limit-order widget state */}
            <MarketPriceSectionConnected action={expandButton} />
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
