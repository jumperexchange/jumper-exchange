import type {
  UdfConfigDto,
  UdfSearchResultDto,
  UdfSymbolInfoDto,
} from '@/types/jumper-backend';
import { JumperBackend } from '@/types/jumper-backend';

const OPTIONAL_V1_SUFFIX = /\/v1\/?$/;

function makeUdfClient() {
  const baseUrl = (process.env.NEXT_PUBLIC_JUMPER_API ?? '').replace(
    OPTIONAL_V1_SUFFIX,
    '',
  );
  return new JumperBackend({ baseUrl });
}

export interface UdfBar {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export class UdfClient {
  private readonly api = makeUdfClient();

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

    const bars: UdfBar[] = (data.t ?? []).map((time, i) => ({
      time,
      open: (data.o ?? [])[i],
      high: (data.h ?? [])[i],
      low: (data.l ?? [])[i],
      close: (data.c ?? [])[i],
    }));

    return { bars, noData: false };
  }
}

export const udfClient = new UdfClient();
