import { MeeClient, MultichainSmartAccount } from '@biconomy/abstractjs';
import { Route } from '@lifi/sdk';
import { ProjectData } from 'src/types/questDetails';
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

export interface WalletPendingOperation {
  operation: (
    meeClientParam: MeeClient,
    oNexusParam: MultichainSmartAccount,
    extraParams?: {
      chainId: number | undefined;
      currentRoute: Route | null;
      zapData: any;
      projectData: ProjectData;
      address: string | undefined;
    },
  ) => Promise<any>;
  timestamp: number;
  resolve?: (value: any) => void;
  reject?: (error: any) => void;
}

export type WalletPendingOperations = {
  [K in WalletMethods]?: WalletPendingOperation;
} & {
  [key: string]: never;
};
