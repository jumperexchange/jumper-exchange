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
}

export interface WalletMethodArgs {
  method: string;
  params?: unknown[];
}

export interface WalletSendCallsArgs extends WalletMethodArgs {
  method: 'wallet_sendCalls';
  account: {
    address: string;
    type: string;
  };
  calls: WalletCall[];
}

export interface WalletGetCallsStatusArgs extends WalletMethodArgs {
  method: 'wallet_getCallsStatus';
  params: [string]; // hash
}

export interface WalletCapabilitiesArgs extends WalletMethodArgs {
  method: 'wallet_getCapabilities';
  params?: never;
}

export interface WalletWaitForCallsStatusArgs extends WalletMethodArgs {
  method: 'wallet_waitForCallsStatus';
  id: string;
  timeout?: number;
}

export interface ContractComposableConfig {
  address: string;
  chainId: number;
  abi: AbiFunction;
  functionName: string;
  args: unknown[];
  gasLimit?: bigint;
}

export interface CallsStatusResponse {
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
