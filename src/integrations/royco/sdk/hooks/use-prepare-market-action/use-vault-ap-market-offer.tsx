import { RoycoMarketType } from '../../market';
import { isSolidityAddressValid, isSolidityIntValid } from '../../utils';
import { BigNumber } from 'ethers';
import type { EnrichedMarketDataType } from '../../queries';
import { getTokenQuote, useTokenQuotes } from '../use-token-quotes';
import { NULL_ADDRESS } from '../../constants';
import { ContractMap } from '../../contracts';
import type { TransactionOptionsType } from '../../types';
import { getApprovalContractOptions, refineTransactionOptions } from './utils';
import { useTokenAllowance } from '../use-token-allowance';
import type { Address } from 'abitype';
import type {
  TypedMarketActionIncentiveDataElement,
  TypedMarketActionInputTokenData,
} from './types';
import { useDefaultMarketData } from './use-default-market-data';
import type { ReadMarketDataType } from '../use-read-market';
import { useReadVaultPreview } from '../use-read-vault-preview';

export const isVaultAPMarketOfferValid = ({
  quantity,
  account,
  enabled,
}: {
  quantity: string | undefined;
  account: string | undefined;
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
    if (!account) {
      throw new Error('Wallet not connected');
    }

    // Check funding vault for validity
    if (!isSolidityAddressValid('address', account)) {
      throw new Error('Wallet address is invalid');
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

export const calculateVaultAPMarketOfferTokenData = ({
  baseMarket,
  enrichedMarket,
  propsTokenQuotes,
  propsReadVaultPreview,
  quantity,
  enabled,
}: {
  baseMarket: ReadMarketDataType | undefined;
  enrichedMarket: EnrichedMarketDataType | undefined;
  propsTokenQuotes: ReturnType<typeof useTokenQuotes>;
  propsReadVaultPreview: ReturnType<typeof useReadVaultPreview>;
  quantity: string;
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
  const action_incentive_token_ids = propsReadVaultPreview.incentive_token_ids;

  // Get action incentive token amounts
  const action_incentive_token_amounts =
    propsReadVaultPreview.incentive_token_amounts;

  // Get action incentive token rates
  const action_incentive_token_rates =
    propsReadVaultPreview.incentive_token_rates;

  // Get input token quote
  const input_token_quote = getTokenQuote({
    token_id: enrichedMarket?.input_token_id ?? '',
    token_quotes: propsTokenQuotes,
  });

  // Get input token data
  const input_token_data: TypedMarketActionInputTokenData = {
    ...input_token_quote,
    raw_amount: quantity || '0',
    token_amount: parseFloat(
      ethers.utils.formatUnits(quantity || '0', input_token_quote.decimals),
    ),
    token_amount_usd:
      input_token_quote.price *
      parseFloat(
        ethers.utils.formatUnits(quantity || '0', input_token_quote.decimals),
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
        const incentive_token_raw_amount =
          action_incentive_token_amounts[index];

        // Get incentive token amount
        const incentive_token_amount = parseFloat(
          ethers.utils.formatUnits(
            incentive_token_raw_amount,
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

        // Get time left
        const time_left = propsReadVaultPreview.incentive_time_left[index];

        if (time_left === '0' || input_token_data.token_amount_usd <= 0) {
          annual_change_ratio = Math.pow(10, 18); // 10^18 refers to N/D
        } else {
          annual_change_ratio =
            (incentive_token_amount_usd / input_token_data.token_amount_usd) *
            ((365 * 24 * 60 * 60) / parseInt(time_left));
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

export const getVaultAPMarketOfferTransactionOptions = ({
  chain_id,
  market_id,
  quantity,
  account,
}: {
  chain_id: number;
  market_id: string;
  quantity: string;
  account: string;
}) => {
  // Get contract address and ABI
  const address = market_id;
  const abi =
    ContractMap[chain_id as keyof typeof ContractMap]['WrappedVault'].abi;

  // Get transaction options
  const txOptions: TransactionOptionsType = {
    contractId: 'WrappedVault',
    chainId: chain_id,
    id: 'deposit',
    label: 'Deposit into Vault',
    address: address,
    abi: abi,
    functionName: 'deposit',
    marketType: RoycoMarketType.vault.id,
    args: [quantity, account],
    txStatus: 'idle',
    txHash: null,
  };

  return txOptions;
};

export const useVaultAPMarketOffer = ({
  account,
  chain_id,
  market_id,
  quantity,
  custom_token_data,
  enabled,
}: {
  account: string | undefined;
  chain_id: number;
  market_id: string;
  quantity: string | undefined;
  custom_token_data?: Array<{
    token_id: string;
    price?: string;
    fdv?: string;
    total_supply?: string;
  }>;
  frontend_fee_recipient?: string;
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
    market_type: RoycoMarketType.vault.id,
    enabled,
  });

  // Check if market action is valid
  const isValid = isVaultAPMarketOfferValid({
    quantity,
    account,
    enabled,
  });

  // Get incentives after deposit
  const propsReadVaultPreview = useReadVaultPreview({
    market: enrichedMarket as EnrichedMarketDataType,
    quantity: quantity || '0',
    enabled: isValid.status,
  });

  // Get token quotes
  const propsTokenQuotes = useTokenQuotes({
    token_ids: Array.from(
      new Set([
        enrichedMarket?.input_token_id ?? '',
        ...propsReadVaultPreview.incentive_token_ids,
      ]),
    ),
    custom_token_data,
    enabled: isValid.status,
  });

  // Get incentive data
  const { incentiveData, inputTokenData } =
    calculateVaultAPMarketOfferTokenData({
      baseMarket,
      enrichedMarket,
      propsTokenQuotes,
      propsReadVaultPreview,
      quantity: quantity || '0',
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
      getVaultAPMarketOfferTransactionOptions({
        chain_id,
        market_id,
        quantity: quantity || '0',
        account: account || '',
      });

    // Set offer transaction options
    postContractOptions = [
      {
        ...offerTxOptions,
        tokensIn: incentiveData,
        tokensOut: [inputTokenData],
      },
    ];

    // Get approval transaction options
    const approvalTxOptions: TransactionOptionsType[] =
      getApprovalContractOptions({
        market_type: RoycoMarketType.recipe.id,
        token_ids: [inputTokenData.id],
        required_approval_amounts: [inputTokenData.raw_amount],
        spender: market_id,
      });

    // Set approval transaction options
    preContractOptions = approvalTxOptions;
  }

  // Get token allowance
  const propsTokenAllowance = useTokenAllowance({
    chain_id: chain_id,
    account: account ? (account as Address) : NULL_ADDRESS,
    spender: market_id as Address,
    tokens: preContractOptions.map((option) => {
      return option.address as Address;
    }),
    enabled: isValid.status,
  });

  if (!propsTokenAllowance.isLoading) {
    // Refine transaction options
    writeContractOptions = refineTransactionOptions({
      propsTokenAllowance,
      preContractOptions,
      postContractOptions,
    });
  }

  // Check if loading
  const isLoading =
    isLoadingDefaultMarketData ||
    propsReadVaultPreview.isLoading ||
    propsTokenAllowance.isLoading ||
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
