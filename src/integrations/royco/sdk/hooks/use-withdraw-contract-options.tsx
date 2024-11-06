import type { SupportedToken } from '../constants';
import { ContractMap } from '../contracts';
import { RoycoMarketType } from '../market';
import type { TransactionOptionsType } from '../types';

export const getRecipeInputTokenWithdrawalTransactionOptions = ({
  chain_id,
  position,
}: {
  chain_id: number;
  position:
    | {
        weiroll_wallet: string;
        token_data: SupportedToken & {
          raw_amount: string;
          token_amount: number;
          token_amount_usd: number;
        };
      }
    | undefined
    | null;
}) => {
  // Get contract address and ABI
  const address =
    ContractMap[chain_id as keyof typeof ContractMap]['RecipeMarketHub']
      .address;
  const abi =
    ContractMap[chain_id as keyof typeof ContractMap]['RecipeMarketHub'].abi;

  // Get transaction options
  const txOptions: TransactionOptionsType = {
    contractId: 'RecipeMarketHub',
    chainId: chain_id,
    id: 'withdraw_input_token',
    label: 'Withdraw Input Token',
    address,
    abi,
    functionName: 'executeWithdrawalScript',
    marketType: RoycoMarketType.recipe.id,
    args: [position?.weiroll_wallet],
    txStatus: 'idle',
    txHash: null,
    tokensIn: position ? [position.token_data] : [],
  };

  return txOptions;
};

export const getRecipeIncentiveTokenWithdrawalTransactionOptions = ({
  account,
  chain_id,
  position,
}: {
  account: string;
  chain_id: number;
  position:
    | {
        weiroll_wallet: string;
        token_data: SupportedToken & {
          raw_amount: string;
          token_amount: number;
          token_amount_usd: number;
        };
      }
    | undefined
    | null;
}) => {
  // Get contract address and ABI
  const address =
    ContractMap[chain_id as keyof typeof ContractMap]['RecipeMarketHub']
      .address;
  const abi =
    ContractMap[chain_id as keyof typeof ContractMap]['RecipeMarketHub'].abi;

  // Get transaction options
  const txOptions: TransactionOptionsType = {
    contractId: 'RecipeMarketHub',
    chainId: chain_id,
    id: 'withdraw_incentive_token',
    label: 'Withdraw Incentive',
    address,
    abi,
    functionName: 'claim',
    marketType: RoycoMarketType.recipe.id,
    args: [
      position?.weiroll_wallet,
      position?.token_data.contract_address,
      account,
    ],
    txStatus: 'idle',
    txHash: null,
    tokensIn: position ? [position.token_data] : [],
  };

  return txOptions;
};

export const getVaultInputTokenWithdrawalTransactionOptions = ({
  account,
  market_id,
  chain_id,
  position,
}: {
  account: string;
  market_id: string;
  chain_id: number;
  position:
    | {
        token_data: SupportedToken & {
          raw_amount: string;
          token_amount: number;
          token_amount_usd: number;
        };
      }
    | undefined
    | null;
}) => {
  // Get contract address and ABI
  const address = market_id;
  const abi =
    ContractMap[chain_id as keyof typeof ContractMap]['WrappedVault'].abi;

  // Get transaction options
  const txOptions: TransactionOptionsType = {
    contractId: 'WrappedVault',
    chainId: chain_id,
    id: 'withdraw_input_token',
    label: 'Withdraw Input Token',
    address,
    abi,
    functionName: 'withdraw',
    marketType: RoycoMarketType.vault.id,
    args: [position?.token_data.raw_amount, account, account],
    txStatus: 'idle',
    txHash: null,
    tokensIn: position ? [position.token_data] : [],
  };

  return txOptions;
};

export const getVaultIncentiveTokenWithdrawalTransactionOptions = ({
  account,
  market_id,
  chain_id,
  position,
}: {
  account: string;
  market_id: string;
  chain_id: number;
  position:
    | {
        token_data: SupportedToken & {
          raw_amount: string;
          token_amount: number;
          token_amount_usd: number;
        };
      }
    | undefined
    | null;
}) => {
  // Get contract address and ABI
  const address = market_id;
  const abi =
    ContractMap[chain_id as keyof typeof ContractMap]['WrappedVault'].abi;

  // Get transaction options
  const txOptions: TransactionOptionsType = {
    contractId: 'WrappedVault',
    chainId: chain_id,
    id: 'withdraw_incentive_token',
    label: 'Withdraw Incentive',
    address,
    abi,
    functionName: 'claim',
    marketType: RoycoMarketType.vault.id,
    args: [account, position?.token_data.contract_address],
    txStatus: 'idle',
    txHash: null,
    tokensIn: position ? [position.token_data] : [],
  };

  return txOptions;
};
