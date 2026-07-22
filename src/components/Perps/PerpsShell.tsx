'use client';

import Box from '@mui/material/Box';
import {
  AccountControl,
  PortfolioView,
  TradeView,
} from '@lifinance/perps-widget/react';
import { useRouter } from 'next/navigation';
import { parseAsString, useQueryState } from 'nuqs';
import { AppPaths } from '@/const/urls';
import { PerpsProviders } from './PerpsProviders';

// Jumper only ships the Hyperliquid venue today; Lighter and Ondo require
// extra build steps (WASM asset copy, bridge deposit flows) not wired up yet.
const PROVIDER = 'hyperliquid';

export function PerpsShell({ page }: { page: 'trade' | 'portfolio' }) {
  const router = useRouter();
  // Persists the market in the query string, so a refresh restores the same
  // market instead of the default.
  const [market, setMarket] = useQueryState(
    'market',
    parseAsString.withOptions({
      history: 'replace',
      shallow: true,
      scroll: false,
    }),
  );

  return (
    <PerpsProviders>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <AccountControl
          provider={PROVIDER}
          onProviderChange={() => {}}
          portfolioHref={AppPaths.PerpsPortfolio}
        />
      </Box>
      {page === 'portfolio' ? (
        <Box sx={{ maxWidth: 480, margin: '0 auto' }}>
          <PortfolioView
            provider={PROVIDER}
            onProviderChange={() => {}}
            onTrade={() => router.push(AppPaths.PerpsTrade)}
          />
        </Box>
      ) : (
        <TradeView
          provider={PROVIDER}
          onProviderChange={() => {}}
          defaultMarketId={market ?? undefined}
          onMarketChange={(marketId) => setMarket(marketId)}
        />
      )}
    </PerpsProviders>
  );
}
