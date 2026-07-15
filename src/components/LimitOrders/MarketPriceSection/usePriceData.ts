'use client';

import type {
  ICandlestickDatafeed,
  ResolutionString,
} from '@jumperexchange/shared-ui/components';
import { useEffect, useState } from 'react';

export interface PriceChange {
  label: string;
  change: number;
}

export const CHANGE_WINDOWS = [
  { label: '1h', res: '60', countback: 2 },
  { label: '4h', res: '240', countback: 2 },
  { label: '24h', res: '1D', countback: 2 },
  { label: '1 week', res: '1W', countback: 2 },
] as const;

export function usePriceData(datafeed: ICandlestickDatafeed, symbol: string) {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [changes, setChanges] = useState<PriceChange[]>([]);

  useEffect(() => {
    setCurrentPrice(null);
    setChanges([]);

    if (!symbol) {
      return;
    }

    let closureStale = false;
    const now = () => Math.floor(Date.now() / 1000);

    datafeed.onReady((config) => {
      if (closureStale) {
        return;
      }

      datafeed.resolveSymbol(
        symbol,
        (symbolInfo) => {
          for (const { label, res, countback } of CHANGE_WINDOWS) {
            if (
              !config.supported_resolutions?.includes(res as ResolutionString)
            ) {
              console.error(
                'Resolution not supported: ',
                res,
                'for symbol: ',
                symbol,
              );
              continue;
            }
            datafeed.getBars(
              symbolInfo,
              res as ResolutionString,
              { from: 0, to: now(), countback, firstDataRequest: true },
              (bars) => {
                if (closureStale || bars.length < 2) {
                  return;
                }
                const change =
                  ((bars[bars.length - 1].close - bars[0].close) /
                    bars[0].close) *
                  100;
                setChanges((prev) => [
                  ...prev.filter((c) => c.label !== label),
                  { label, change },
                ]);
                if (label === '1h') {
                  setCurrentPrice(bars[bars.length - 1].close);
                }
              },
              () => {
                console.error(
                  'Error fetching price information for symbol: ',
                  symbol,
                );
              },
            );
          }
        },
        () => {
          console.error(
            'Error fetching symbol information for symbol: ',
            symbol,
          );
        },
      );
    });

    return () => {
      closureStale = true;
    };
  }, [datafeed, symbol]);

  return { currentPrice, changes };
}
