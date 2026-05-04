'use client';

import type { ChainId, ExtendedChain, Token } from '@lifi/sdk';
import { Autocomplete, Box, Stack, TextField, Typography } from '@mui/material';
import {
  type CandlestickData,
  CandlestickSeries,
  createChart,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from 'lightweight-charts';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useChains } from '@/hooks/useChains';
import { useTokens } from '@/hooks/useTokens';
import { usePortfolioBalances } from '@/providers/PortfolioProvider/PortfolioContext';

interface UdfHistoryResponse {
  s: 'ok' | 'no_data' | 'error';
  t?: number[];
  o?: number[];
  h?: number[];
  l?: number[];
  c?: number[];
  errmsg?: string;
}

interface TradingViewChartProps {
  symbol: string;
  resolution?: string;
  udfBaseUrl?: string;
}

const DEFAULT_UDF_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL ?? ''}/tradingview/udf`;
const DEFAULT_CHAIN_ID = 1 as ChainId;

function TradingViewChart({
  symbol,
  resolution = '1D',
  udfBaseUrl = DEFAULT_UDF_BASE_URL,
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const chart: IChartApi = createChart(container, {
      autoSize: true,
      layout: {
        background: { color: '#0F0F0F' },
        textColor: '#D9D9D9',
      },
      grid: {
        vertLines: { color: 'rgba(242, 242, 242, 0.06)' },
        horzLines: { color: 'rgba(242, 242, 242, 0.06)' },
      },
      timeScale: { timeVisible: true, secondsVisible: false },
    });

    const series: ISeriesApi<'Candlestick'> = chart.addSeries(
      CandlestickSeries,
      {
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      },
    );

    const controller = new AbortController();
    const to = Math.floor(Date.now() / 1000);
    const from = to - 60 * 60 * 24 * 365;
    const url = `${udfBaseUrl}/history?symbol=${encodeURIComponent(symbol)}&resolution=${encodeURIComponent(resolution)}&from=${from}&to=${to}`;

    fetch(url, { signal: controller.signal })
      .then((res) => res.json() as Promise<UdfHistoryResponse>)
      .then((data) => {
        const { s, t, o, h, l, c } = data;
        if (s !== 'ok' || !t || !o || !h || !l || !c) {
          return;
        }
        const bars: CandlestickData<UTCTimestamp>[] = t.map((time, i) => ({
          time: time as UTCTimestamp,
          open: o[i],
          high: h[i],
          low: l[i],
          close: c[i],
        }));
        series.setData(bars);
        chart.timeScale().fitContent();
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('UDF history fetch failed', err);
        }
      });

    return () => {
      controller.abort();
      chart.remove();
    };
  }, [symbol, resolution, udfBaseUrl]);

  return <Box ref={containerRef} sx={{ height: 500, width: '100%' }} />;
}

const tokenKey = (chainId: number, address: string) =>
  `${chainId}-${address.toLowerCase()}`;

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

interface TokenOption {
  token: Token;
  amountUSD: number;
}

function scoreToken(option: TokenOption, query: string): number {
  if (!query) {
    return 0;
  }
  const q = query.toLowerCase();
  const symbol = option.token.symbol.toLowerCase();
  const name = option.token.name.toLowerCase();
  const address = option.token.address.toLowerCase();

  if (symbol === q) {
    return 100;
  }
  if (symbol.startsWith(q)) {
    return 80;
  }
  if (name.startsWith(q)) {
    return 60;
  }
  if (symbol.includes(q)) {
    return 50;
  }
  if (name.includes(q)) {
    return 30;
  }
  if (address.startsWith(q)) {
    return 20;
  }
  return 0;
}

function TradingViewWidget() {
  const { chains } = useChains();
  const { tokens } = useTokens();
  const { balances } = usePortfolioBalances();

  const [chain, setChain] = useState<ExtendedChain | null>(null);
  const [token, setToken] = useState<Token | null>(null);

  const sortedChains = useMemo(
    () => [...chains].sort((a, b) => a.name.localeCompare(b.name)),
    [chains],
  );

  const balancesByToken = useMemo(() => {
    const map = new Map<string, number>();
    for (const symbolBalances of Object.values(balances)) {
      for (const b of symbolBalances) {
        const key = tokenKey(b.token.chainId, b.token.address);
        map.set(key, (map.get(key) ?? 0) + b.amountUSD);
      }
    }
    return map;
  }, [balances]);

  const tokenOptions = useMemo<TokenOption[]>(() => {
    if (!chain || !tokens?.[chain.id]) {
      return [];
    }
    const list: TokenOption[] = tokens[chain.id].map((t) => ({
      token: t,
      amountUSD: balancesByToken.get(tokenKey(chain.id, t.address)) ?? 0,
    }));
    list.sort((a, b) => {
      if (a.amountUSD !== b.amountUSD) {
        return b.amountUSD - a.amountUSD;
      }
      return a.token.symbol.localeCompare(b.token.symbol);
    });
    return list;
  }, [chain, tokens, balancesByToken]);

  useEffect(() => {
    if (!chain && sortedChains.length > 0) {
      const ethereum = sortedChains.find((c) => c.id === DEFAULT_CHAIN_ID);
      setChain(ethereum ?? sortedChains[0]);
    }
  }, [chain, sortedChains]);

  useEffect(() => {
    if (token && chain && token.chainId !== chain.id) {
      setToken(null);
    }
  }, [chain, token]);

  useEffect(() => {
    if (!token && tokenOptions.length > 0) {
      setToken(tokenOptions[0].token);
    }
  }, [token, tokenOptions]);

  const selectedOption = useMemo(
    () =>
      token
        ? (tokenOptions.find(
            (o) =>
              o.token.address.toLowerCase() === token.address.toLowerCase(),
          ) ?? { token, amountUSD: 0 })
        : null,
    [token, tokenOptions],
  );

  const symbol = chain && token ? `${chain.id}:${token.address}` : null;

  return (
    <Stack spacing={2} sx={{ p: 2 }}>
      <Stack direction="row" spacing={2}>
        <Autocomplete
          sx={{ width: 240 }}
          options={sortedChains}
          getOptionLabel={(option) => option.name}
          value={chain}
          onChange={(_, value) => setChain(value)}
          renderInput={(params) => <TextField {...params} label="Chain" />}
          isOptionEqualToValue={(option, value) => option.id === value.id}
        />
        <Autocomplete<TokenOption>
          sx={{ width: 360 }}
          options={tokenOptions}
          value={selectedOption}
          onChange={(_, value) => setToken(value?.token ?? null)}
          getOptionLabel={(option) =>
            `${option.token.symbol} — ${option.token.name}`
          }
          isOptionEqualToValue={(option, value) =>
            option.token.address.toLowerCase() ===
            value.token.address.toLowerCase()
          }
          filterOptions={(options, { inputValue }) => {
            if (!inputValue) {
              return options;
            }
            return options
              .map((o) => ({ option: o, score: scoreToken(o, inputValue) }))
              .filter((x) => x.score > 0)
              .sort((a, b) => {
                if (a.score !== b.score) {
                  return b.score - a.score;
                }
                return b.option.amountUSD - a.option.amountUSD;
              })
              .map((x) => x.option);
          }}
          renderOption={(props, option) => (
            <Box
              component="li"
              {...props}
              key={tokenKey(option.token.chainId, option.token.address)}
            >
              <Stack
                direction="row"
                spacing={1.5}
                sx={{ width: '100%', alignItems: 'center' }}
              >
                <Box
                  component="img"
                  src={option.token.logoURI}
                  alt=""
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    flexShrink: 0,
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.visibility = 'hidden';
                  }}
                />
                <Stack sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" noWrap>
                    {option.token.symbol}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {option.token.name}
                  </Typography>
                </Stack>
                {option.amountUSD > 0 ? (
                  <Typography variant="body2" sx={{ flexShrink: 0 }}>
                    {usdFormatter.format(option.amountUSD)}
                  </Typography>
                ) : null}
              </Stack>
            </Box>
          )}
          renderInput={(params) => <TextField {...params} label="Token" />}
          disabled={!chain}
        />
      </Stack>
      {symbol ? <TradingViewChart symbol={symbol} /> : null}
    </Stack>
  );
}

export default memo(TradingViewWidget);
