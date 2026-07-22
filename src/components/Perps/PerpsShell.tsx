'use client';

import Box from '@mui/material/Box';
import {
  AccountControl,
  PortfolioView,
  TradeView,
} from '@lifinance/perps-widget/react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { AppPaths } from '@/const/urls';
import { PerpsProviders } from './PerpsProviders';

// Jumper only ships the Hyperliquid venue today; Lighter and Ondo require
// extra build steps (WASM asset copy, bridge deposit flows) not wired up yet.
const PROVIDER = 'hyperliquid';

function readQueryParam(name: string): string | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }
  return new URLSearchParams(window.location.search).get(name) ?? undefined;
}

/** Persists the market in the query string, so a refresh restores the same
 * market instead of the default. */
function writeQueryParam(name: string, value: string) {
  const url = new URL(window.location.href);
  if (url.searchParams.get(name) === value) {
    return;
  }
  url.searchParams.set(name, value);
  window.history.replaceState(null, '', url);
}

export function PerpsShell({ page }: { page: 'trade' | 'portfolio' }) {
  const router = useRouter();
  const marketFromUrl = useMemo(() => readQueryParam('market'), []);

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
          defaultMarketId={marketFromUrl}
          onMarketChange={(marketId) => writeQueryParam('market', marketId)}
        />
      )}
    </PerpsProviders>
  );
}
