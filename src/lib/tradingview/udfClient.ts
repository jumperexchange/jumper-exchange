import type {
  UdfConfigDto,
  UdfSearchResultDto,
  UdfSymbolInfoDto,
} from '@/types/jumper-backend';
import { makeClient } from '@/app/lib/client';

export interface UdfBar {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export class UdfClient {
  private readonly api = makeClient();

  async getConfig(): Promise<UdfConfigDto> {
    const res = await this.api.v1.udfControllerConfigV1();
    return res.data;
  }

  async getSymbol(symbol: string): Promise<UdfSymbolInfoDto> {
    const res = await this.api.v1.udfControllerSymbolsV1({ symbol });
    return res.data;
  }

  async searchSymbols(
    query: string,
    limit = 30,
  ): Promise<UdfSearchResultDto[]> {
    const res = await this.api.v1.udfControllerSearchV1({ query, limit });
    return res.data;
  }

  async getBars(
    symbol: string,
    resolution: string,
    from: number,
    to: number,
    countback?: number,
  ): Promise<{ bars: UdfBar[]; noData: boolean; nextTime?: number }> {
    const res = await this.api.v1.udfControllerHistoryV1({
      symbol,
      resolution,
      from,
      to,
      countback,
    });
    const data = res.data;

    if (data.s === 'error') {
      throw new Error(data.errmsg ?? 'UDF history error');
    }

    if (data.s === 'no_data') {
      return { bars: [], noData: true, nextTime: data.nextTime ?? undefined };
    }

    const t = data.t ?? [];
    const o = data.o ?? [];
    const h = data.h ?? [];
    const l = data.l ?? [];
    const c = data.c ?? [];
    if (
      o.length !== t.length ||
      h.length !== t.length ||
      l.length !== t.length ||
      c.length !== t.length
    ) {
      throw new Error('UDF history error: mismatched OHLC array lengths');
    }

    const bars: UdfBar[] = t.map((time, i) => ({
      time,
      open: o[i],
      high: h[i],
      low: l[i],
      close: c[i],
    }));

    return { bars, noData: false };
  }
}

export const udfClient = new UdfClient();
