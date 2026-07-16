// @vitest-environment jsdom

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import type {
  ApyAnalyticsHistory,
  HistoryGraph,
} from 'src/types/jumper-backend';
import {
  useApyAnalyticsChartConfig,
  useSimpleAnalyticsChartConfig,
} from './hooks';
import { AnalyticsRangeFieldEnum } from './types';

// Minimal stand-in for the app theme (the real one imports next/font,
// which is unavailable under vitest) with just the tokens the hooks read.
const theme = createTheme({
  palette: {
    surface1: { main: '#fff' },
    accent1: { main: '#000' },
    accent2: { main: '#000' },
    surfaceAccent1Bg: '#eee',
    surfaceAccent2Bg: '#eee',
    textAccent2: '#000',
  } as never,
});

const wrapper = ({ children }: React.PropsWithChildren) =>
  React.createElement(ThemeProvider, { theme }, children);

const DAY_MS = 24 * 60 * 60 * 1000;
const start = Date.UTC(2026, 5, 4);
const day = (index: number) => start + index * DAY_MS;

const simpleHistory = (values: (number | null)[]): HistoryGraph => ({
  points: values.map((v, index) => ({ t: day(index), v })),
});

const apyHistory = (totals: (number | null)[]): ApyAnalyticsHistory => ({
  points: totals.map((total, index) => ({
    t: day(index),
    base: total != null ? total / 2 : null,
    reward: total != null ? total / 2 : null,
    intrinsic: total != null ? 0 : null,
    total,
  })),
});

const renderSimple = (rawData: HistoryGraph) =>
  renderHook(
    () => useSimpleAnalyticsChartConfig(rawData, AnalyticsRangeFieldEnum.WEEK),
    { wrapper },
  ).result.current.data;

const renderApy = (rawData: ApyAnalyticsHistory) =>
  renderHook(
    () => useApyAnalyticsChartConfig(rawData, AnalyticsRangeFieldEnum.WEEK),
    { wrapper },
  ).result.current.data;

describe('useSimpleAnalyticsChartConfig', () => {
  it('drops leading null values', () => {
    const data = renderSimple(simpleHistory([null, null, 100, 120]));

    expect(data.map((point) => point.value)).toEqual([100, 120]);
    expect(data[0].date).toBe(new Date(day(2)).toISOString());
  });

  it('drops trailing null values so the chart ends on the last day with data', () => {
    const data = renderSimple(simpleHistory([100, 120, 110, null]));

    expect(data.map((point) => point.value)).toEqual([100, 120, 110]);
    expect(data.at(-1)?.date).toBe(new Date(day(2)).toISOString());
  });

  it('keeps interior null values', () => {
    const data = renderSimple(simpleHistory([100, null, 110]));

    expect(data.map((point) => point.value)).toEqual([100, null, 110]);
  });

  it('returns an empty array when all values are null', () => {
    expect(renderSimple(simpleHistory([null, null, null]))).toEqual([]);
  });

  it('keeps data untouched when every day has a value', () => {
    const data = renderSimple(simpleHistory([100, 120, 110, 130]));

    expect(data.map((point) => point.value)).toEqual([100, 120, 110, 130]);
  });
});

describe('useApyAnalyticsChartConfig', () => {
  it('drops leading null totals', () => {
    const data = renderApy(apyHistory([null, 4.7, 5.3]));

    expect(data.map((point) => point.total)).toEqual([4.7, 5.3]);
    expect(data[0].date).toBe(new Date(day(1)).toISOString());
  });

  it('drops trailing null totals so the chart ends on the last day with data', () => {
    const data = renderApy(apyHistory([4.7, 5.3, null, null]));

    expect(data.map((point) => point.total)).toEqual([4.7, 5.3]);
    expect(data.at(-1)?.date).toBe(new Date(day(1)).toISOString());
  });

  it('keeps interior null totals', () => {
    const data = renderApy(apyHistory([4.7, null, 5.3]));

    expect(data.map((point) => point.total)).toEqual([4.7, null, 5.3]);
  });

  it('returns an empty array when all totals are null', () => {
    expect(renderApy(apyHistory([null, null]))).toEqual([]);
  });

  it('keeps data untouched when every day has a total', () => {
    const data = renderApy(apyHistory([4.7, 5.3, 5.0]));

    expect(data.map((point) => point.total)).toEqual([4.7, 5.3, 5.0]);
  });
});
