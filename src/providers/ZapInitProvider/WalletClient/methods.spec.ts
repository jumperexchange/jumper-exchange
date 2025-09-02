import { describe, it, expect, vi, beforeEach, MockInstance } from 'vitest';

import { waitForCallsStatus } from './methods';
import { MeeClient } from '@biconomy/abstractjs';
import { EVMAddress } from 'src/types/internal';

describe('waitForCallsStatus', () => {
  const mockMeeClient = {
    waitForSupertransactionReceipt: vi.fn(),
    request: vi.fn(),
    getSupertransactionReceipt: vi.fn(),
  } as unknown as MeeClient & {
    waitForSupertransactionReceipt: MockInstance;
    request: MockInstance;
    getSupertransactionReceipt: MockInstance;
  };

  const mockExtraParams = {
    currentRoute: {
      id: 'test-route',
      fromChainId: 1,
      fromAmount: '1000000000000000000',
      fromAmountUSD: '1000',
      fromToken: { address: '0x0000000000000000000000000000000000000000' },
      toChainId: 1,
      toAmount: '1000000000000000000',
      toAmountMin: '1000000000000000000',
      toAmountUSD: '1000',
      toToken: { address: '0x0000000000000000000000000000000000000000' },
      steps: [],
    } as any,
    zapData: {} as any,
    projectData: {} as any,
    isEmbeddedWallet: false,
  };

  const mockReceipts = [
    // First receipt should be for the fee collection
    {
      transactionHash: '0x123',
      status: 'success',
    },
    {
      transactionHash: '0x456',
      status: 'success',
    },
    {
      transactionHash: '0x789',
      status: 'success',
    },
  ];

  const createMockReceipt = (receipts = mockReceipts) => ({
    transactionStatus: 'SUCCESS',
    receipts: [...JSON.parse(JSON.stringify(receipts))],
    paymentInfo: { chainId: 1 },
  });

  const createTestParams = (id: string, timeout = 60000) => ({
    id,
    timeout,
    method: 'wallet_waitForCallsStatus' as const,
  });

  const createUserOp = (status: string, isCleanUpUserOp = false) => {
    return { isCleanUpUserOp, executionStatus: status };
  };

  const getExplorerRequestOptions = (txHash: string) => ({
    path: `explorer/${txHash}`,
    method: 'GET',
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return success when waitForSupertransactionReceipt succeeds', async () => {
    const originalTxHash = '0x000';
    const biconomyTxHash = `${originalTxHash}_biconomy`;
    const mockReceipt = createMockReceipt();

    mockMeeClient.waitForSupertransactionReceipt.mockResolvedValue(mockReceipt);

    const result = await waitForCallsStatus(
      {
        id: biconomyTxHash,
        timeout: 60000,
        method: 'wallet_waitForCallsStatus',
      },
      mockMeeClient,
      undefined,
      mockExtraParams,
    );

    const lastReceiptIndex = mockReceipts.length - 1;

    expect(mockMeeClient.waitForSupertransactionReceipt).toHaveBeenCalledWith({
      hash: originalTxHash,
    });
    expect(result.status).toBe('success');
    expect(result.statusCode).toBe(200);
    expect(result.receipts).toHaveLength(mockReceipts.length);

    result.receipts.forEach((receipt) => {
      expect(receipt.status).toBe('success');
    });

    expect(result.receipts[lastReceiptIndex].transactionHash).toBe(
      biconomyTxHash,
    );
    expect(result.receipts[lastReceiptIndex].transactionLink).toContain(
      mockReceipts[1].transactionHash,
    );
  });

  it('should retry if waitForSupertransactionReceipt fails but explorer returns pending status', async () => {
    const originalTxHash = '0x000';
    const biconomyTxHash = `${originalTxHash}_biconomy`;

    // First call fails, second call succeeds
    mockMeeClient.waitForSupertransactionReceipt.mockRejectedValueOnce(
      new Error('waitForSupertransactionReceipt failed'),
    );

    // Explorer responds with pending status (should trigger retry)
    mockMeeClient.request
      .mockResolvedValueOnce({
        userOps: [createUserOp('PENDING', true)],
      })
      .mockResolvedValueOnce({
        userOps: [createUserOp('MINED_SUCCESS', true)],
      });

    const result = await waitForCallsStatus(
      createTestParams(biconomyTxHash),
      mockMeeClient,
      undefined,
      mockExtraParams,
    );

    expect(result.status).toBe('success');
    expect(result.statusCode).toBe(200);
    expect(result.receipts).toHaveLength(1);
    expect(mockMeeClient.request).toHaveBeenCalledTimes(2);
    expect(mockMeeClient.request).toHaveBeenLastCalledWith({
      path: `explorer/${originalTxHash}`,
      method: 'GET',
    });
  }, 5000);

  it('should return fallback if waitForSupertransactionReceipt fails and explorer returns FAILED status for destination chain', async () => {
    const originalTxHash = '0x000';
    const biconomyTxHash = `${originalTxHash}_biconomy`;

    // First call fails
    mockMeeClient.waitForSupertransactionReceipt.mockRejectedValueOnce(
      new Error('First attempt failed'),
    );

    // Explorer responds with FAILED status (should stop retry)
    mockMeeClient.request.mockResolvedValue({
      userOps: [
        createUserOp('MINED_SUCCESS'),
        createUserOp('MINED_SUCCESS'),
        createUserOp('FAILED'),
      ],
    });

    const result = await waitForCallsStatus(
      createTestParams(biconomyTxHash),
      mockMeeClient,
      undefined,
      mockExtraParams,
    );

    expect(result.status).toBe('success');
    expect(result.receipts).toHaveLength(1);
    expect(result.receipts[0].status).toBe('success');
    expect(result.receipts[0].transactionHash).toBe(biconomyTxHash);
    expect(result.receipts[0].transactionLink).toContain(originalTxHash);
    expect(mockMeeClient.waitForSupertransactionReceipt).toHaveBeenCalledTimes(
      1,
    );
    expect(mockMeeClient.request).toHaveBeenCalledWith(
      getExplorerRequestOptions(originalTxHash),
    );
  });

  it('should return fallback if waitForSupertransactionReceipt fails and explorer returns FAILED status', async () => {
    const originalTxHash = '0x000';
    const biconomyTxHash = `${originalTxHash}_biconomy`;

    // First call fails
    mockMeeClient.waitForSupertransactionReceipt.mockRejectedValueOnce(
      new Error('First attempt failed'),
    );

    // Explorer responds with FAILED status (should stop retry)
    mockMeeClient.request.mockResolvedValue({
      userOps: [createUserOp('FAILED')],
    });

    const result = await waitForCallsStatus(
      createTestParams(biconomyTxHash),
      mockMeeClient,
      undefined,
      mockExtraParams,
    );

    expect(result.status).toBe('failed');
    expect(result.receipts).toHaveLength(1);
    expect(result.receipts[0].status).toBe('reverted');
    expect(result.receipts[0].transactionHash).toBe(biconomyTxHash);
    expect(result.receipts[0].transactionLink).toContain(originalTxHash);
    expect(mockMeeClient.waitForSupertransactionReceipt).toHaveBeenCalledTimes(
      1,
    );
    expect(mockMeeClient.request).toHaveBeenCalledWith(
      getExplorerRequestOptions(originalTxHash),
    );
  });

  it('should return fallback if waitForSupertransactionReceipt fails but explorer returns MINED_SUCCESS status for cleanup op', async () => {
    const originalTxHash = '0x000';
    const biconomyTxHash = `${originalTxHash}_biconomy`;

    mockMeeClient.waitForSupertransactionReceipt.mockRejectedValueOnce(
      new Error('First attempt failed'),
    );

    mockMeeClient.request.mockResolvedValue({
      userOps: [createUserOp('FAILED'), createUserOp('MINED_SUCCESS', true)],
    });

    const result = await waitForCallsStatus(
      createTestParams(biconomyTxHash),
      mockMeeClient,
      undefined,
      mockExtraParams,
    );

    expect(result.status).toBe('failed');
    expect(result.receipts).toHaveLength(1);
    expect(result.receipts[0].status).toBe('reverted');
    expect(result.receipts[0].transactionHash).toBe(biconomyTxHash);
    expect(result.receipts[0].transactionLink).toContain(originalTxHash);
    expect(mockMeeClient.waitForSupertransactionReceipt).toHaveBeenCalledTimes(
      1,
    );
    expect(mockMeeClient.request).toHaveBeenCalledWith(
      getExplorerRequestOptions(originalTxHash),
    );
  });

  it('should return fallback if waitForSupertransactionReceipt fails and explorer returns MINED_FAIL status for cleanup op', async () => {
    const originalTxHash = '0x000';
    const biconomyTxHash = `${originalTxHash}_biconomy`;

    mockMeeClient.waitForSupertransactionReceipt.mockRejectedValueOnce(
      new Error('First attempt failed'),
    );

    mockMeeClient.request.mockResolvedValue({
      userOps: [createUserOp('FAILED'), createUserOp('MINED_FAIL', true)],
    });

    const result = await waitForCallsStatus(
      createTestParams(biconomyTxHash),
      mockMeeClient,
      undefined,
      mockExtraParams,
    );

    expect(result.status).toBe('failed');
    expect(result.receipts).toHaveLength(1);
    expect(result.receipts[0].status).toBe('reverted');
    expect(result.receipts[0].transactionHash).toBe(biconomyTxHash);
    expect(result.receipts[0].transactionLink).toContain(originalTxHash);
    expect(mockMeeClient.waitForSupertransactionReceipt).toHaveBeenCalledTimes(
      1,
    );
    expect(mockMeeClient.request).toHaveBeenCalledWith(
      getExplorerRequestOptions(originalTxHash),
    );
  });
});
