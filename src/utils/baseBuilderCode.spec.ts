import type { TransactionRequestUpdateHook } from '@lifi/sdk';
import { Attribution } from 'ox/erc8021';
import { describe, expect, it } from 'vitest';
import { createBaseBuilderCodeHook } from './baseBuilderCode';

const BUILDER_CODE = 'bc_test123';
const SUFFIX = Attribution.toDataSuffix({ codes: [BUILDER_CODE] }).slice(2);

const baseTx = {
  requestType: 'transaction' as const,
  chainId: 8453,
  to: '0x1231deb6f5749ef6ce6943a275a1d3e7486f4eae',
  data: '0xdeadbeef',
  value: 0n,
};

function createHook(): TransactionRequestUpdateHook {
  const hook = createBaseBuilderCodeHook(BUILDER_CODE);
  expect(hook).toBeDefined();
  return hook!;
}

describe('createBaseBuilderCodeHook', () => {
  it('returns undefined when no builder code is configured', () => {
    expect(createBaseBuilderCodeHook('')).toBeUndefined();
  });

  it('appends a decodable ERC-8021 suffix on Base transactions', async () => {
    const result = await createHook()(baseTx);

    expect(result.data).toBe(baseTx.data + SUFFIX);
    expect(Attribution.fromData(result.data as `0x${string}`)).toEqual({
      codes: [BUILDER_CODE],
      id: 0,
    });
  });

  it('does not touch ERC-20 approvals', async () => {
    const tx = { ...baseTx, requestType: 'approve' as const };
    expect(await createHook()(tx)).toEqual(tx);
  });

  it('does not touch non-Base transactions', async () => {
    const tx = { ...baseTx, chainId: 1 };
    expect(await createHook()(tx)).toEqual(tx);
  });

  it('does not double-append on already-suffixed calldata', async () => {
    const hook = createHook();
    const once = await hook(baseTx);
    const twice = await hook({ ...baseTx, data: once.data });

    expect(twice.data).toBe(once.data);
  });

  it('passes through transactions without calldata', async () => {
    const tx = { ...baseTx, data: undefined };
    expect(await createHook()(tx)).toEqual(tx);
  });
});
