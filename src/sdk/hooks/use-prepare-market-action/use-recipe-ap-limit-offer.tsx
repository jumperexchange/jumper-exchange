import { RoycoMarketType } from '../../market';
import {
  isSolidityAddressValid,
  isSolidityIntValid,
  parseRawAmountToTokenAmount,
  parseTokenAmountToTokenAmountUsd,
} from '../../utils';
import { BigNumber } from 'ethers';
import type { EnrichedMarketDataType } from '../../queries';
import { getTokenQuote, useTokenQuotes } from '../use-token-quotes';
import { NULL_ADDRESS } from '../../constants';
import { ContractMap } from '../../contracts';
import type { TransactionOptionsType } from '../../types';
import {
  getApprovalContractOptions,
  getVaultApprovalContractOptions,
  refineTransactionOptions,
  refineVaultTransactionOptions,
} from './utils';
import { useTokenAllowance } from '../use-token-allowance';
import type { Address } from 'abitype';
import type {
  TypedMarketActionIncentiveDataElement,
  TypedMarketActionInputTokenData,
} from './types';
import { useDefaultMarketData } from './use-default-market-data';
import type { ReadMarketDataType } from '../use-read-market';
import { useVaultAllowance } from '../use-vault-allowance';

export const isRecipeAPLimitOfferValid = ({
  quantity,
  funding_vault,
  token_ids,
  token_amounts,
  expiry,
  enabled,
}: {
  quantity: string | undefined;
  funding_vault: string | undefined;
  token_ids: string[] | undefined;
  token_amounts: string[] | undefined;
  expiry: string | undefined;
  enabled?: boolean;
}) => {
  try {
    // Check if enabled
    if (!enabled) {
      throw new Error('Market action is not enabled');
    }

    // Check quantity
    if (!quantity) {
      throw new Error('Quantity is missing');
    }

    // Check quantity for validity
    if (!isSolidityIntValid('uint256', quantity)) {
      throw new Error('Quantity is invalid');
    }

    // Check quantity is greater than 0
    if (BigNumber.from(quantity).lte(0)) {
      throw new Error('Quantity must be greater than 0');
    }

    // Check funding vault
    if (!funding_vault) {
      throw new Error('Funding vault is missing');
    }

    // Check funding vault for validity
    if (!isSolidityAddressValid('address', funding_vault)) {
      throw new Error('Funding vault is invalid');
    }

    // Check token IDs
    if (!token_ids) {
      throw new Error('Incentive ids are missing');
    }

    // Check token IDs for validity
    for (let i = 0; i < token_ids.length; i++) {
      const token_address = token_ids[i].split('-')[1];

      if (!isSolidityAddressValid('address', token_address)) {
        throw new Error('Incentive address is invalid');
      }
    }

    // Check if at least one token ID is provided
    if (token_ids.length === 0) {
      throw new Error('No incentives added');
    }

    // Check token amounts
    if (!token_amounts) {
      throw new Error('Incentive amounts are missing');
    }

    // Check token amounts for validity
    for (let i = 0; i < token_amounts.length; i++) {
      if (!isSolidityIntValid('uint256', token_amounts[i])) {
        throw new Error('Incentive amount is invalid');
      }

      if (BigNumber.from(token_amounts[i]).lte(0)) {
        throw new Error('Incentive amount must be greater than 0');
      }
    }

    // Check if lengths match
    if (token_ids.length !== token_amounts.length) {
      throw new Error('Incentive ids and amounts do not match');
    }

    // Check expiry
    if (!expiry) {
      throw new Error('Expiry is missing');
    }

    // Check expiry for validity
    if (!isSolidityIntValid('uint256', expiry)) {
      throw new Error('Expiry is invalid');
    }

    // Check if expiry is in the future
    if (
      !BigNumber.from(expiry).eq(BigNumber.from('0')) &&
      BigNumber.from(expiry).lte(BigNumber.from(Math.floor(Date.now() / 1000)))
    ) {
      throw new Error('Expiry must be in the future');
    }

    return {
      status: true,
      message: 'Valid market action',
    };
  } catch (error: any) {
    return {
      status: false,
      message: error.message
        ? (error.message as string)
        : 'Invalid market action',
    };
  }
};

export const calculateRecipeAPLimitOfferTokenData = ({
  baseMarket,
  quantity,
  enrichedMarket,
  tokenIds,
  tokenAmounts,
  propsTokenQuotes,
  enabled,
}: {
  baseMarket: ReadMarketDataType | undefined;
  enrichedMarket: EnrichedMarketDataType | undefined;
  quantity: string | undefined;
  tokenIds: string[];
  tokenAmounts: string[];
  propsTokenQuotes: ReturnType<typeof useTokenQuotes>;
  enabled?: boolean;
}) => {
  // Check if enabled
  if (!enabled) {
    return {
      incentiveData: [],
      inputTokenData: undefined,
    };
  }

  let incentiveData: Array<TypedMarketActionIncentiveDataElement> = [];

  // Get the unique token IDs
  const action_incentive_token_ids = tokenIds;

  // Get input token quote
  const input_token_quote = getTokenQuote({
    token_id: enrichedMarket?.input_token_id ?? '',
    token_quotes: propsTokenQuotes,
  });

  // Get input token data
  const input_token_data: TypedMarketActionInputTokenData = {
    ...input_token_quote,
    raw_amount: quantity === '' ? '0' : (quantity ?? '0'),
    token_amount: parseRawAmountToTokenAmount(
      quantity ?? '0',
      input_token_quote.decimals,
    ),
    token_amount_usd: parseTokenAmountToTokenAmountUsd(
      parseRawAmountToTokenAmount(quantity ?? '0', input_token_quote.decimals),
      input_token_quote.price,
    ),
  };

  if (!!enrichedMarket) {
    // Calculate incentive data
    incentiveData = action_incentive_token_ids.map(
      (incentive_token_id, index) => {
        // Get incentive token quote
        const incentive_token_quote = getTokenQuote({
          token_id: incentive_token_id,
          token_quotes: propsTokenQuotes,
        });

        // Get incentive token raw amount
        const incentive_token_raw_amount = tokenAmounts[index];

        // Get incentive token amount
        const incentive_token_amount = parseFloat(
          ethers.utils.formatUnits(
            incentive_token_raw_amount || '0',
            incentive_token_quote.decimals,
          ),
        );

        // Get incentive token amount in USD
        const incentive_token_amount_usd =
          incentive_token_quote.price * incentive_token_amount;

        // Get per input token
        const per_input_token =
          incentive_token_amount / input_token_data.token_amount;

        // Get annual change ratio
        let annual_change_ratio = 0;

        // Calculate annual change ratio
        if (!enrichedMarket.lockup_time || enrichedMarket.lockup_time === '0') {
          annual_change_ratio = Math.pow(10, 18); // 10^18 refers to N/D
        } else {
          annual_change_ratio =
            (incentive_token_amount_usd / input_token_data.token_amount_usd) *
            ((365 * 24 * 60 * 60) / parseInt(enrichedMarket.lockup_time));
        }

        // Get incentive token data
        const incentive_token_data = {
          ...incentive_token_quote,
          raw_amount: incentive_token_raw_amount,
          token_amount: incentive_token_amount,
          token_amount_usd: incentive_token_amount_usd,
          per_input_token,
          annual_change_ratio,
        };

        return incentive_token_data;
      },
    );
  }

  return {
    incentiveData,
    inputTokenData: input_token_data,
  };
};

export const getRecipeAPLimitOfferTransactionOptions = ({
  market_id,
  chain_id,
  funding_vault,
  quantity,
  token_ids,
  token_amounts,
  expiry,
}: {
  chain_id: number;
  market_id: string;
  funding_vault: string;
  quantity: string;
  token_ids: string[];
  token_amounts: string[];
  expiry: string;
}) => {
  // Get contract address and ABI
  const address =
    ContractMap[chain_id as keyof typeof ContractMap]['RecipeMarketHub']
      .address;
  const abi =
    ContractMap[chain_id as keyof typeof ContractMap]['RecipeMarketHub'].abi;

  const token_addresses = token_ids.map((id) => id.split('-')[1]);

  // Sort the tokens based on the address in ascending order
  const sortedTokens = token_addresses.map((address, index) => {
    return {
      address,
      amount: token_amounts[index],
    };
  });

  // Sort the tokens based on the address in ascending order
  sortedTokens.sort((a, b) => (a.address > b.address ? 1 : -1));

  // Extract the sorted addresses and amounts
  const sortedTokenAddresses = sortedTokens.map((token) => token.address);
  const sortedTokenAmounts = sortedTokens.map((token) => token.amount);

  // Get transaction options
  const txOptions: TransactionOptionsType = {
    contractId: 'RecipeMarketHub',
    chainId: chain_id,
    id: 'create_ap_offer',
    label: 'Create AP Offer',
    address: address,
    abi: abi,
    functionName: 'createAPOffer',
    marketType: RoycoMarketType.recipe.id,
    args: [
      market_id,
      funding_vault,
      quantity,
      expiry,
      sortedTokenAddresses,
      sortedTokenAmounts,
    ],
    txStatus: 'idle',
    txHash: null,
  };

  return txOptions;
};

export const useRecipeAPLimitOffer = ({
  account,
  chain_id,
  market_id,
  quantity,
  token_ids,
  token_amounts,
  expiry,
  funding_vault,
  custom_token_data,
  enabled,
}: {
  account: string | undefined;
  chain_id: number;
  market_id: string;
  quantity: string | undefined;
  token_ids: string[] | undefined;
  token_amounts: string[] | undefined;
  expiry: string | undefined;
  funding_vault: string | undefined;
  custom_token_data?: Array<{
    token_id: string;
    price?: string;
    fdv?: string;
    total_supply?: string;
  }>;
  enabled?: boolean;
}) => {
  let preContractOptions: TransactionOptionsType[] = [];
  let postContractOptions: TransactionOptionsType[] = [];
  let writeContractOptions: TransactionOptionsType[] = [];
  let canBePerformedCompletely: boolean = false;
  let canBePerformedPartially: boolean = false;

  const {
    baseMarket,
    enrichedMarket,
    isLoading: isLoadingDefaultMarketData,
  } = useDefaultMarketData({
    chain_id,
    market_id,
    market_type: RoycoMarketType.recipe.id,
    enabled,
  });

  // Check if market action is valid
  const isValid = isRecipeAPLimitOfferValid({
    quantity,
    funding_vault,
    token_ids,
    token_amounts,
    expiry,
  });

  // Get token quotes
  const propsTokenQuotes = useTokenQuotes({
    token_ids: Array.from(
      new Set([enrichedMarket?.input_token_id ?? '', ...(token_ids ?? [])]),
    ),
    custom_token_data,
    enabled: isValid.status,
  });

  // Get incentive data
  const { incentiveData, inputTokenData } =
    calculateRecipeAPLimitOfferTokenData({
      baseMarket,
      enrichedMarket,
      quantity,
      tokenIds: token_ids ?? [],
      tokenAmounts: token_amounts ?? [],
      propsTokenQuotes,
      enabled: isValid.status,
    });

  // Create transaction options
  if (
    isValid.status &&
    !!baseMarket &&
    !!enrichedMarket &&
    !!incentiveData &&
    !!inputTokenData
  ) {
    // Get offer transaction options
    const offerTxOptions: TransactionOptionsType =
      getRecipeAPLimitOfferTransactionOptions({
        chain_id,
        market_id,
        funding_vault: funding_vault ?? NULL_ADDRESS,
        quantity: quantity ?? '0',
        token_ids: token_ids ?? [],
        token_amounts: token_amounts ?? [],
        expiry: expiry ?? '',
      });

    // Set offer transaction options
    postContractOptions = [
      {
        ...offerTxOptions,
      },
    ];

    // Get approval transaction options
    const approvalTxOptions: TransactionOptionsType[] =
      getApprovalContractOptions({
        market_type: RoycoMarketType.recipe.id,
        token_ids: [inputTokenData.id],
        required_approval_amounts: [inputTokenData.raw_amount],
        spender:
          ContractMap[chain_id as keyof typeof ContractMap]['RecipeMarketHub']
            .address,
      });

    // Get vault approval transaction options
    const vaultApprovalTxOptions: TransactionOptionsType[] =
      getVaultApprovalContractOptions({
        market_type: RoycoMarketType.recipe.id,
        token_ids: [inputTokenData.id],
        required_approval_amounts: [inputTokenData.raw_amount],
        funding_vault: funding_vault ?? NULL_ADDRESS,
        spender:
          ContractMap[chain_id as keyof typeof ContractMap]['RecipeMarketHub']
            .address,
      });

    // Set pre contract options
    if (funding_vault !== NULL_ADDRESS) {
      preContractOptions = [...vaultApprovalTxOptions];
    } else {
      preContractOptions = [...approvalTxOptions];
    }
  }

  // Get token allowance
  const propsTokenAllowance = useTokenAllowance({
    chain_id: chain_id,
    account: account ? (account as Address) : NULL_ADDRESS,
    spender:
      ContractMap[chain_id as keyof typeof ContractMap]['RecipeMarketHub']
        .address,
    tokens: preContractOptions.map((option) => {
      return option.address as Address;
    }),
    enabled: isValid.status,
  });

  // Get vault allowance
  const propsVaultAllowance = useVaultAllowance({
    chain_id,
    account: account ?? '',
    vault_address: funding_vault ?? '',
    spender:
      ContractMap[chain_id as keyof typeof ContractMap]['RecipeMarketHub']
        .address,
    enabled: isValid.status,
  });

  if (!propsTokenAllowance.isLoading && !propsVaultAllowance.isLoading) {
    if (funding_vault !== NULL_ADDRESS) {
      // Refine vault transaction options
      writeContractOptions = refineVaultTransactionOptions({
        propsVaultAllowance,
        preContractOptions,
        postContractOptions,
      });
    } else {
      // Refine wallet transaction options
      writeContractOptions = refineTransactionOptions({
        propsTokenAllowance,
        preContractOptions,
        postContractOptions,
      });
    }
  }

  // Check if loading
  const isLoading =
    isLoadingDefaultMarketData ||
    propsTokenAllowance.isLoading ||
    propsVaultAllowance.isLoading ||
    propsTokenQuotes.isLoading;

  // Check if ready
  const isReady = writeContractOptions.length > 0;

  // Check if offer can be performed completely or partially
  if (isReady) {
    canBePerformedCompletely = true;
    canBePerformedPartially = true;
  }

  return {
    isValid,
    isLoading,
    isReady,
    incentiveData,
    writeContractOptions,
    canBePerformedCompletely,
    canBePerformedPartially,
  };
};
