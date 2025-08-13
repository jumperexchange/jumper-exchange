import { MeeClient, MultichainSmartAccount } from '@biconomy/abstractjs';
import { AbiFunction } from 'viem';
import { SendCallsExtraParams } from './ModularZaps/base';

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
  method: WalletMethod;
  params?: unknown[];
}

export type WalletMethod = keyof WalletMethodsRef;

export interface SendCallsArgs extends WalletMethodArgs {
  method: 'wallet_sendCalls';
  account: {
    address: string;
    type: string;
  };
  calls: WalletCall[];
}

export interface GetCallsStatusArgs extends WalletMethodArgs {
  method: 'wallet_getCallsStatus';
  params: [string]; // hash
}

export interface GetCapabilitiesArgs extends WalletMethodArgs {
  method: 'wallet_getCapabilities';
  params?: never;
}

export interface WaitCallsStatusArgs extends WalletMethodArgs {
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

export type WalletMethodDefinition<TArgs, TResult> = (
  args: TArgs,
  meeClient: MeeClient | undefined,
  oNexus: MultichainSmartAccount | undefined,
  extraParams: SendCallsExtraParams,
) => Promise<TResult>;

export interface WalletMethodsRef {
  wallet_getCapabilities: WalletMethodDefinition<
    GetCapabilitiesArgs,
    GetCapabilitiesResponse
  >;
  wallet_getCallsStatus: WalletMethodDefinition<
    GetCallsStatusArgs,
    GetCallsStatusResponse
  >;
  wallet_waitForCallsStatus: WalletMethodDefinition<
    WaitCallsStatusArgs,
    WaitCallsStatusResponse
  >;
  wallet_sendCalls: WalletMethodDefinition<SendCallsArgs, SendCallsResponse>;
}

export type WalletMethodArgsType<T extends WalletMethod> = Parameters<
  WalletMethodsRef[T]
>[0];

export type WalletMethodReturnType<T extends WalletMethod> = ReturnType<
  WalletMethodsRef[T]
>;
