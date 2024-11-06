import { RoycoMarketType, RoycoMarketUserType } from '../../market';
import { isSolidityAddressValid, isSolidityIntValid } from '../../utils';
import { BigNumber } from 'ethers';
import type { EnrichedMarketDataType } from '../../queries';
import { useMarketOffers } from '../use-market-offers';
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

export const isVaultAPLimitOfferValid = ({
  quantity,
  expiry,
  token_ids,
  token_rates,
  funding_vault,
  enabled,
}: {
  quantity: string | undefined;
  expiry: string | undefined;
  token_ids: string[] | undefined;
  token_rates: string[] | undefined;
  funding_vault: string | undefined;
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
      throw new Error('Incentive IDs are missing');
    }

    // Check if at least one token ID is provided
    if (token_ids.length === 0) {
      throw new Error('No incentives added');
    }

    // Check token IDs for validity
    for (let i = 0; i < token_ids.length; i++) {
      const token_address = token_ids[i].split('-')[1];

      if (!isSolidityAddressValid('address', token_address)) {
        throw new Error('Incentive address is invalid');
      }
    }

    // Check token rates
    if (!token_rates) {
      throw new Error('Incentive rates are missing');
    }

    // Check token rates for validity
    for (let i = 0; i < token_rates.length; i++) {
      if (!isSolidityIntValid('uint256', token_rates[i])) {
        throw new Error('Incentive rate is invalid');
      }

      if (BigNumber.from(token_rates[i]).lte(0)) {
        throw new Error('Incentive rate must be greater than 0');
      }
    }

    // Check if lengths match
    if (token_ids.length !== token_rates.length) {
      throw new Error('Incentive ids and rates do not match');
    }

    // Check expiry
    if (!expiry) {
      throw new Error('Expiry is missing');
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

export const calculateVaultAPLimitOfferTokenData = ({
  baseMarket,
  enrichedMarket,
  tokenIds,
  tokenRates,
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
  tokenIds: string[];
  tokenRates: string[];
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

  // Get action incentive token amounts
  // here, amount is calculated as incentives over the time duration of 1 year
  const action_incentive_token_amounts = tokenRates.map((rate) => {
    return BigNumber.from(rate)
      .mul(365 * 24 * 60 * 60)
      .toString();
  });

  // Get action incentive token rates
  const action_incentive_token_rates = tokenRates;

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

        if (input_token_data.token_amount_usd <= 0) {
          annual_change_ratio = Math.pow(10, 18); // 10^18 refers to N/D
        } else {
          annual_change_ratio =
            incentive_token_amount_usd / input_token_data.token_amount_usd;
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

export const getVaultAPLimitOfferTransactionOptions = ({
  chain_id,
  market_id,
  funding_vault,
  quantity,
  expiry,
  token_ids,
  token_rates,
  account,
}: {
  chain_id: number;
  market_id: string;
  funding_vault: string;
  quantity: string;
  expiry: string;
  token_ids: string[];
  token_rates: string[];
  account: string;
}) => {
  // Get contract address and ABI
  const address =
    ContractMap[chain_id as keyof typeof ContractMap]['VaultMarketHub'].address;
  const abi =
    ContractMap[chain_id as keyof typeof ContractMap]['VaultMarketHub'].abi;

  // Sort the tokens based on the address in ascending order
  const sortedTokens = (token_ids as string[]).map((id, index) => {
    const address = id.split('-')[1];
    const amount = token_rates[index];

    return {
      address,
      amount,
    };
  });

  // Sort the tokens based on the address in ascending order
  sortedTokens.sort((a, b) => (a.address > b.address ? 1 : -1));

  // Extract the sorted addresses and amounts
  const sortedTokenAddresses = sortedTokens.map((token) => token.address);
  const sortedTokenAmounts = sortedTokens.map((token) => token.amount);

  // Get transaction options
  const txOptions: TransactionOptionsType = {
    contractId: 'VaultMarketHub',
    chainId: chain_id,
    id: 'create_ap_offer',
    label: 'Create AP Offer',
    address,
    abi,
    functionName: 'createAPOffer',
    marketType: RoycoMarketType.vault.id,
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

export const useVaultAPLimitOffer = ({
  account,
  chain_id,
  market_id,
  expiry,
  quantity,
  funding_vault,
  token_ids,
  token_rates,
  custom_token_data,
  enabled,
}: {
  account: string | undefined;
  chain_id: number;
  market_id: string;
  expiry: string | undefined;
  quantity: string | undefined;
  funding_vault: string | undefined;
  token_ids: string[] | undefined;
  token_rates: string[] | undefined;
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
  const isValid = isVaultAPLimitOfferValid({
    quantity,
    funding_vault,
    token_ids,
    token_rates,
    expiry,
    enabled,
  });

  // Get incentives after deposit
  const propsReadVaultPreview = useReadVaultPreview({
    market: enrichedMarket as EnrichedMarketDataType,
    quantity: quantity ?? '0',
    enabled: isValid.status,
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
  const { incentiveData, inputTokenData } = calculateVaultAPLimitOfferTokenData(
    {
      baseMarket,
      enrichedMarket,
      propsTokenQuotes,
      propsReadVaultPreview,
      quantity: quantity ?? '0',
      tokenIds: token_ids ?? [],
      tokenRates: token_rates ?? [],
      enabled: isValid.status,
    },
  );

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
      getVaultAPLimitOfferTransactionOptions({
        chain_id,
        market_id,
        funding_vault: funding_vault ?? '',
        quantity: quantity ?? '0',
        expiry: expiry ?? '',
        token_ids: token_ids ?? [],
        token_rates: token_rates ?? [],
        account: account ?? '',
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
