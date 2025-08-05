import { MeeClient, MultichainSmartAccount } from '@biconomy/abstractjs';
import { Route } from '@lifi/sdk';
import { ProjectData } from 'src/types/questDetails';
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
  method: string;
  params?: unknown[];
}

export enum WalletMethods {
  getCapabilities = 'wallet_getCapabilities',
  getCallsStatus = 'wallet_getCallsStatus',
  sendCalls = 'wallet_sendCalls',
  waitForCallsStatus = 'wallet_waitForCallsStatus',
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

export interface CapabilitiesResponse {
  atomic: { status: 'supported' | 'ready' | 'unsupported' };
}

export interface SendCallsResponse {
  id: string;
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

export type WalletMethodDefinition<TArgs, TResult> = (
  args: TArgs,
  meeClient: MeeClient | undefined,
  oNexus: MultichainSmartAccount | undefined,
  extraParams: SendCallsExtraParams,
) => Promise<TResult>;

export interface WalletMethodsRef {
  [WalletMethods.getCapabilities]: WalletMethodDefinition<
    WalletCapabilitiesArgs,
    CapabilitiesResponse
  >;
  [WalletMethods.getCallsStatus]: WalletMethodDefinition<
    WalletGetCallsStatusArgs,
    CallsStatusResponse
  >;
  [WalletMethods.waitForCallsStatus]: WalletMethodDefinition<
    WalletWaitForCallsStatusArgs,
    CallsStatusResponse
  >;
  [WalletMethods.sendCalls]: WalletMethodDefinition<
    WalletSendCallsArgs,
    SendCallsResponse
  >;
}

export type WalletMethodArgsType<T extends WalletMethods> = Parameters<
  WalletMethodsRef[T]
>[0];

export type WalletMethodReturnType<T extends WalletMethods> = ReturnType<
  WalletMethodsRef[T]
>;
