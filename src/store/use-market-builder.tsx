import { create } from 'zustand';

import { z } from 'zod';
import {
  Abi as ZodAbi,
  Address as ZodAddress,
  AbiFunction as ZodAbiFunction,
  SolidityAddress as ZodSolidityAddress,
} from 'abitype/zod';

import type { AbiFunction } from 'abitype';
import { Abi, SolidityAddress, IsAbi } from 'abitype';
import type { AbiParameter } from 'viem';
import { isAddress, ParseAbi } from 'viem';
import { isAbiValid, isSolidityAddressValid } from 'src/sdk/utils';

export const MarketBuilderMarketBuilderFormSchema = z.object({
  functions: z.array(
    z.object({
      contract_address: ZodSolidityAddress,
      contract_function: ZodAbiFunction,
    }),
  ),
});

export const MarketBuilderFunctionFormSchema = z.object({
  contract_address: z.string().refine(
    (value) => {
      return isSolidityAddressValid('address', value);
    },
    {
      message: 'Invalid address',
    },
  ),
  contract_abi: z.string().refine(
    (value) => {
      return isAbiValid(value);
    },
    {
      message: 'Invalid ABI format',
    },
  ),
  contract_function: ZodAbiFunction,

  // contract_function: ZodAbiFunction,
  // proxy_type: z.string().optional(),
  // proxy_address: ZodSolidityAddress.optional(),
  // proxy_abi: ZodAbi.optional(),
});

export interface MarketBuilderState {
  functionFormSchema: typeof MarketBuilderFunctionFormSchema;
  marketFormSchema: typeof MarketBuilderMarketBuilderFormSchema;

  availableFunctions: Array<AbiFunction>;
  setAvailableFunctions: (availableFunctions: Array<AbiFunction>) => void;

  marketBuilderFunctionFormFunctionList: Array<AbiFunction>;
  setMarketBuilderFunctionFormFunctionList: (
    marketBuilderFunctionFormFunctionList: Array<AbiFunction>,
  ) => void;

  chainId: number;
  setChainId: (chainId: number) => void;

  dragData: any;
  setDragData: (dragData: any) => void;

  availableOutputs: Array<AbiParameter>;
  setAvailableOutputs: (availableOutputs: Array<AbiParameter>) => void;

  dummyContractAddress: string | null;
  setDummyContractAddress: (dummyContractAddress: string) => void;
}

export const useMarketBuilder = create<MarketBuilderState>((set) => ({
  functionFormSchema: MarketBuilderFunctionFormSchema,
  marketFormSchema: MarketBuilderMarketBuilderFormSchema,

  availableFunctions: [],
  setAvailableFunctions: (availableFunctions) => set({ availableFunctions }),

  availableOutputs: [],
  setAvailableOutputs: (availableOutputs) => set({ availableOutputs }),

  chainId: 11155111,
  setChainId: (chainId) => set({ chainId }),

  marketBuilderFunctionFormFunctionList: [],
  setMarketBuilderFunctionFormFunctionList: (
    marketBuilderFunctionFormFunctionList,
  ) => set({ marketBuilderFunctionFormFunctionList }),

  dragData: null,
  setDragData: (dragData) => set({ dragData }),

  dummyContractAddress: null,
  setDummyContractAddress: (dummyContractAddress) =>
    set({ dummyContractAddress }),
}));
