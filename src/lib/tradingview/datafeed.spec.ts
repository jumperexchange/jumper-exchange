import { describe, expect, it, vi } from 'vitest';
import { UdfDatafeed } from './datafeed';
import type { UdfClient } from './udfClient';

vi.mock('@/config/env-config', () => ({
  default: {
    NEXT_PUBLIC_BACKEND_URL: 'https://backend.test',
  },
}));

const VALID_CONFIG = {
  supported_resolutions: ['1D'],
  supports_marks: false,
  supports_search: false,
  supports_timescale_marks: false,
  supports_time: true,
  exchanges: [],
  symbols_types: [],
};

function createClient(overrides: Partial<UdfClient> = {}): UdfClient {
  return {
    getConfig: vi.fn().mockResolvedValue(VALID_CONFIG),
    ...overrides,
  } as unknown as UdfClient;
}

describe('UdfDatafeed.onReady', () => {
  it('fetches config once and reuses it across multiple onReady calls', async () => {
    const client = createClient();
    const datafeed = new UdfDatafeed(client);

    await new Promise<void>((resolve) => datafeed.onReady(() => resolve()));
    await new Promise<void>((resolve) => datafeed.onReady(() => resolve()));
    await new Promise<void>((resolve) => datafeed.onReady(() => resolve()));

    expect(client.getConfig).toHaveBeenCalledTimes(1);
  });

  it('still invokes the callback with the cached config on every call', async () => {
    const client = createClient();
    const datafeed = new UdfDatafeed(client);

    const first = await new Promise((resolve) => datafeed.onReady(resolve));
    const second = await new Promise((resolve) => datafeed.onReady(resolve));

    expect(first).toMatchObject({ supported_resolutions: ['1D'] });
    expect(second).toEqual(first);
  });

  it('does not cache a failed getConfig call, and retries on the next onReady', async () => {
    const getConfig = vi
      .fn()
      .mockRejectedValueOnce(new Error('network error'))
      .mockResolvedValueOnce(VALID_CONFIG);
    const client = createClient({ getConfig });
    const datafeed = new UdfDatafeed(client);

    const first = await new Promise((resolve) => datafeed.onReady(resolve));
    expect(first).toEqual({});

    const second = await new Promise((resolve) => datafeed.onReady(resolve));
    expect(second).toMatchObject({ supported_resolutions: ['1D'] });

    expect(getConfig).toHaveBeenCalledTimes(2);
  });
});
