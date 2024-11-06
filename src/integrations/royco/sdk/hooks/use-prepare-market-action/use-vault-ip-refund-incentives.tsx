import { RoycoMarketType } from '../../market';
import {
  isSolidityAddressValid,
  parseRawAmountToTokenAmount,
  parseTokenAmountToTokenAmountUsd,
} from '../../utils';
import { BigNumber } from 'ethers';
import type { EnrichedMarketDataType } from '../../queries';
import { getTokenQuote, useTokenQuotes } from '../use-token-quotes';
import { getSupportedToken } from '../../constants';
import { ContractMap } from '../../contracts';
import type { CustomTokenData, TransactionOptionsType } from '../../types';
import type {
  TypedMarketActionIncentiveDataElement,
  TypedMarketActionInputTokenData,
} from './types';
import { useDefaultMarketData } from './use-default-market-data';
import type { ReadMarketDataType } from '../use-read-market';

export const isVaultIPRefundIncentivesValid = ({
  baseMarket,
  enrichedMarket,
  token_ids,
  enabled,
}: {
  baseMarket: ReadMarketDataType | undefined;
  enrichedMarket: EnrichedMarketDataType | undefined;
  token_ids: string[] | undefined;
  enabled?: boolean;
}) => {
  try {
    // Check if enabled
    if (!enabled) {
      throw new Error('Market action is not enabled');
    }

    // Check market
    if (!enrichedMarket || !baseMarket) {
      throw new Error('Market is missing');
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

    /**
     * @note Below code is adapted directly from the smart contract source code
     */
    for (let i = 0; i < token_ids.length; i++) {
      const token_id = token_ids[i];
      const reward = token_id.split('-')[1];

      const existing_reward_index =
        enrichedMarket.base_incentive_ids?.findIndex((id) => id === token_id) ??
        -1;

      if (existing_reward_index === -1) {
        throw new Error('Invalid reward token');
      }

      const rewardsInterval = {
        start: BigNumber.from(enrichedMarket.base_start_timestamps?.[i] ?? '0'),
        end: BigNumber.from(enrichedMarket.base_end_timestamps?.[i] ?? '0'),
      };

      const blockTimestamp = BigNumber.from(
        Math.floor(Date.now() / 1000).toString(),
      );

      if (blockTimestamp.gte(rewardsInterval.start)) {
        throw new Error('Interval in progress');
      }
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

export const calculateVaultIPRefundIncentivesTokenData = ({
  enrichedMarket,
  propsTokenQuotes,
  tokenIds,
  enabled,
}: {
  enrichedMarket: EnrichedMarketDataType | undefined;
  propsTokenQuotes: ReturnType<typeof useTokenQuotes>;
  tokenIds: string[];
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
  const action_incentive_token_ids: string[] = tokenIds;

  // Get action incentive token amounts
  // here, amount is calculated as incentives over the time duration of 1 year
  const action_incentive_token_amounts: string[] =
    enrichedMarket?.base_incentive_amounts ?? [];

  // Get input token quote
  const input_token_quote = getTokenQuote({
    token_id: enrichedMarket?.input_token_id ?? '',
    token_quotes: propsTokenQuotes,
  });

  // Get input token data
  const input_token_data: TypedMarketActionInputTokenData = {
    ...input_token_quote,
    raw_amount: '0',
    token_amount: 0,
    token_amount_usd: 0,
  };

  if (!!enrichedMarket) {
    // Calculate incentive data
    incentiveData = action_incentive_token_ids.map(
      (incentive_token_id, index) => {
        const existing_incentive_index =
          enrichedMarket.base_incentive_ids?.indexOf(incentive_token_id) ?? 0;

        // Get incentive token quote
        const incentive_token_quote = getTokenQuote({
          token_id: incentive_token_id,
          token_quotes: propsTokenQuotes,
        });

        // Get incentive token raw amount
        const incentive_token_raw_amount =
          action_incentive_token_amounts[existing_incentive_index];

        // Get incentive token amount
        const incentive_token_amount = parseRawAmountToTokenAmount(
          incentive_token_raw_amount,
          incentive_token_quote.decimals,
        );

        // Get incentive token amount in USD
        const incentive_token_amount_usd = parseTokenAmountToTokenAmountUsd(
          incentive_token_amount,
          incentive_token_quote.price,
        );

        // Get per input token
        const per_input_token = 0;

        // Get annual change ratio
        let annual_change_ratio = Math.pow(10, 18); // 10^18 refers to N/D

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

export const getVaultIPRefundIncentivesTransactionOptions = ({
  enrichedMarket,
  chain_id,
  token_ids,
}: {
  enrichedMarket: EnrichedMarketDataType | undefined;
  chain_id: number;
  token_ids: string[];
}) => {
  // Get contract address and ABI
  const address = enrichedMarket?.market_id ?? '';
  const abi =
    ContractMap[chain_id as keyof typeof ContractMap]['WrappedVault'].abi;

  // Get refund reward transaction options
  let refundRewardTxOptions: TransactionOptionsType[] = [];

  // Refund Rewards
  for (let i = 0; i < token_ids.length; i++) {
    const token_id = token_ids[i];
    const token_address = token_id.split('-')[1];
    const token_data = getSupportedToken(token_id);

    const existing_reward_index =
      enrichedMarket?.base_incentive_ids?.findIndex((id) => id === token_id) ??
      -1;

    if (token_data.type !== 'point' && existing_reward_index !== -1) {
      const rewardsOwed = BigNumber.from(
        enrichedMarket?.base_incentive_rates?.[existing_reward_index] ?? '0',
      )
        .mul(
          BigNumber.from(
            enrichedMarket?.base_end_timestamps?.[existing_reward_index] ?? '0',
          ).sub(
            BigNumber.from(
              enrichedMarket?.base_start_timestamps?.[existing_reward_index] ??
                '0',
            ),
          ),
        )
        .sub(BigNumber.from(1));

      const rewardsOwedInToken = parseRawAmountToTokenAmount(
        rewardsOwed.toString(),
        token_data.decimals,
      );

      const newTxOptions: TransactionOptionsType = {
        contractId: 'WrappedVault',
        chainId: chain_id,
        id: `refund_reward_${token_address}`,
        label: `Refund Reward ${token_data?.symbol.toUpperCase()}`,
        address,
        abi,
        functionName: 'refundRewardsInterval',
        marketType: RoycoMarketType.vault.id,
        args: [token_address],
        txStatus: 'idle',
        txHash: null,
        tokensOut: [
          {
            ...token_data,
            raw_amount: rewardsOwedInToken.toString(),
            token_amount: rewardsOwedInToken,
          },
        ],
      };

      refundRewardTxOptions.push(newTxOptions);
    }
  }
  // Combine all transaction options
  const txOptions = [...refundRewardTxOptions];

  return txOptions;
};

export const useVaultIPRefundIncentives = ({
  chain_id,
  market_id,
  token_ids,
  custom_token_data,
  enabled,
}: {
  account: string | undefined;
  chain_id: number;
  market_id: string;
  token_ids: string[] | undefined;
  custom_token_data?: CustomTokenData;
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
  const isValid = isVaultIPRefundIncentivesValid({
    baseMarket,
    enrichedMarket,
    token_ids,
    enabled,
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
    calculateVaultIPRefundIncentivesTokenData({
      enrichedMarket,
      propsTokenQuotes,
      tokenIds: token_ids ?? [],
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
    const offerTxOptions: TransactionOptionsType[] =
      getVaultIPRefundIncentivesTransactionOptions({
        enrichedMarket,
        chain_id,
        token_ids: token_ids ?? [],
      });

    // Set offer transaction options
    postContractOptions = offerTxOptions;

    // Set approval transaction options
    preContractOptions = [];

    writeContractOptions = [...preContractOptions, ...postContractOptions];
  }

  // Check if loading
  const isLoading = isLoadingDefaultMarketData || propsTokenQuotes.isLoading;

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
