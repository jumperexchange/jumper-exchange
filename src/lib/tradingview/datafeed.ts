import type {
  Bar,
  DatafeedConfiguration,
  ICandlestickDatafeed,
  LibrarySymbolInfo,
  OnBarsLoadedCallback,
  OnErrorCallback,
  OnReadyCallback,
  OnRealtimeCallback,
  PeriodParams,
  ResolutionString,
} from '@jumperexchange/shared-ui/components';
import { secondsInDay } from 'date-fns/constants';
import { type UdfClient, udfClient } from './udfClient';

export class UdfDatafeed implements ICandlestickDatafeed {
  private readonly subscriptions = new Map<
    string,
    ReturnType<typeof setInterval>
  >();
  private cachedConfig?: DatafeedConfiguration;

  constructor(private readonly client: UdfClient) {}

  onReady(callback: OnReadyCallback): void {
    if (this.cachedConfig) {
      setTimeout(() => callback(this.cachedConfig!), 0);
      return;
    }

    this.client
      .getConfig()
      .then((config) => {
        const datafeedConfig: DatafeedConfiguration = {
          supported_resolutions:
            config.supported_resolutions as ResolutionString[],
          supports_marks: config.supports_marks,
          supports_search: config.supports_search,
          supports_timescale_marks: config.supports_timescale_marks,
          supports_time: config.supports_time ?? true,
          exchanges: config.exchanges,
          symbols_types: config.symbols_types,
        };
        this.cachedConfig = datafeedConfig;
        setTimeout(() => callback(datafeedConfig), 0);
      })
      .catch(() => {
        setTimeout(() => callback({}), 0);
      });
  }

  resolveSymbol(
    symbolName: string,
    onResolve: (symbolInfo: LibrarySymbolInfo) => void,
    onError: OnErrorCallback,
  ): void {
    this.client
      .getSymbol(symbolName)
      .then((symbolInfo) => {
        onResolve({
          ...symbolInfo,
          supported_resolutions:
            symbolInfo.supported_resolutions as ResolutionString[],
        });
      })
      .catch((err: unknown) => {
        onError(
          err instanceof Error ? err.message : 'Failed to resolve symbol',
        );
      });
  }

  getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    periodParams: PeriodParams,
    onResult: OnBarsLoadedCallback,
    onError: OnErrorCallback,
  ): void {
    const { from, to, countback } = periodParams;
    this.client
      .getBars(symbolInfo.ticker, resolution, from, to, countback)
      .then(({ bars, noData, nextTime }) => {
        const tvBars: Bar[] = bars.map((b) => ({
          time: b.time,
          open: b.open,
          high: b.high,
          low: b.low,
          close: b.close,
        }));
        onResult(tvBars, { noData, nextTime });
      })
      .catch((err: unknown) => {
        onError(err instanceof Error ? err.message : 'Failed to load bars');
      });
  }

  subscribeBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onRealtimeCallback: OnRealtimeCallback,
    subscriberUID: string,
    _onResetCacheNeededCallback: () => void,
  ): void {
    this.unsubscribeBars(subscriberUID);

    function realtimeLookback(res: ResolutionString): number {
      if (res === '1W') {
        return 7 * secondsInDay;
      }
      if (res === '1D' || res === 'D') {
        return 2 * secondsInDay;
      }
      const minutes = Number(res);
      if (!Number.isNaN(minutes)) {
        return 2 * minutes * 60;
      }
      return 86400;
    }

    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      this.client
        .getBars(
          symbolInfo.ticker,
          resolution,
          now - realtimeLookback(resolution),
          now,
          2,
        )
        .then(({ bars }) => {
          if (bars.length > 0) {
            onRealtimeCallback(bars[bars.length - 1]);
          }
        })
        .catch(() => {
          // Silent — stale candle is acceptable on poll failure
        });
    }, 60_000);

    this.subscriptions.set(subscriberUID, interval);
  }

  unsubscribeBars(subscriberUID: string): void {
    const interval = this.subscriptions.get(subscriberUID);
    if (interval !== undefined) {
      clearInterval(interval);
      this.subscriptions.delete(subscriberUID);
    }
  }
}

export const datafeed = new UdfDatafeed(udfClient);
