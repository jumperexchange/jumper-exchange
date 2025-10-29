import { MeeClient, MultichainSmartAccount } from '@biconomy/abstractjs';
import { AbiFunction } from 'viem';

// Type definitions for better type safety
export interface AbiInput {
  name: string;
  type: string;
  indexed?: boolean;
}

export interface WalletCall {
  to: `0x${string}`;
  data: `0x${string}`;
  value?: string;
  chainId: number;
}

export interface ContractComposableConfig {
  address: string;
  chainId: number;
  abi: AbiFunction;
  functionName: string;
  args: unknown[];
  gasLimit?: bigint;
}

export interface GetCapabilitiesResponse {
  atomic: { status: 'supported' | 'ready' | 'unsupported' };
}

export interface SendCallsResponse {
  id: string;
}

export interface CommonCallsStatusResponse {
  atomic: boolean;
  chainId?: string;
  id: string;
  status: string; // 'success' | 'failed' - string status as expected by LiFi SDK
  statusCode: number; // 200 | 400 - numeric status code
  receipts: Array<{
    transactionHash: `0x${string}`;
    status: 'success' | 'reverted';
  }>;
}

export interface GetCallsStatusResponse extends CommonCallsStatusResponse {}

export interface WaitCallsStatusResponse extends CommonCallsStatusResponse {}
