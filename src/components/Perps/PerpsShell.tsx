'use client';

import {
  AccountControl,
  PortfolioView,
  TradeView,
} from '@lifinance/perps-widget/react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { AppPaths } from '@/const/urls';
import { useHeaderHeight } from '@/hooks/useHeaderHeight';
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
  const headerHeight = useHeaderHeight();
  const router = useRouter();
  const marketFromUrl = useMemo(() => readQueryParam('market'), []);

  return (
    <PerpsProviders>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: `calc(100dvh - ${headerHeight}px)`,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '16px 16px 0',
          }}
        >
          <AccountControl
            provider={PROVIDER}
            onProviderChange={() => {}}
            portfolioHref={AppPaths.PerpsPortfolio}
          />
        </div>
        <div
          style={{
            width: '100%',
            padding: '0 16px 16px',
            flex: 1,
            minHeight: 0,
            overflow: 'auto',
          }}
        >
          {page === 'portfolio' ? (
            <div style={{ maxWidth: 480, margin: '16px auto 0' }}>
              <PortfolioView
                provider={PROVIDER}
                onProviderChange={() => {}}
                onTrade={() => router.push(AppPaths.PerpsTrade)}
              />
            </div>
          ) : (
            <TradeView
              provider={PROVIDER}
              onProviderChange={() => {}}
              defaultMarketId={marketFromUrl}
              onMarketChange={(marketId) => writeQueryParam('market', marketId)}
            />
          )}
        </div>
      </div>
    </PerpsProviders>
  );
}
