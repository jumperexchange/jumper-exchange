/**
 * @TODO Fix this
 */

import { RoycoMarketType, RoycoMarketUserType } from '../../market';
import { isSolidityIntValid } from '../../utils';
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

export const isVaultIPMarketOfferValid = ({
  quantity,
  enabled,
}: {
  quantity: string | undefined;
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

export const calculateVaultIPMarketOfferTokenData = ({
  baseMarket,
  enrichedMarket,
  propsMarketOffers,
  propsTokenQuotes,
  enabled,
}: {
  baseMarket: ReadMarketDataType | undefined;
  enrichedMarket: EnrichedMarketDataType | undefined;
  propsMarketOffers: ReturnType<typeof useMarketOffers>;
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

  const total_quantity_filled: string =
    propsMarketOffers.data
      ?.reduce(
        (acc, offer) => acc.add(BigNumber.from(offer.fill_quantity)),
        BigNumber.from(0),
      )
      ?.toString() ?? '0';

  let incentiveData: Array<TypedMarketActionIncentiveDataElement> = [];

  // Get market offers
  const market_offers = propsMarketOffers.data ?? [];

  // Get the token ID to amount map
  const token_id_to_amount_map =
    market_offers.reduce(
      (acc, offer) => {
        offer.token_ids.forEach((token_id, index) => {
          const base_amount: BigNumber = BigNumber.from(
            offer.token_amounts[index].toString(),
          );

          const actual_amount: BigNumber = base_amount
            .mul(BigNumber.from(offer.fill_quantity))
            .div(BigNumber.from(offer.quantity));

          if (acc[token_id]) {
            acc[token_id] = acc[token_id].add(actual_amount);
          } else {
            acc[token_id] = actual_amount; // Initialize with the BigNumber amount
          }
        });
        return acc;
      },
      {} as Record<string, BigNumber>,
    ) ?? {};

  // Get the unique token IDs
  const action_incentive_token_ids = Object.keys(token_id_to_amount_map);

  // Get input token quote
  const input_token_quote = getTokenQuote({
    token_id: enrichedMarket?.input_token_id ?? '',
    token_quotes: propsTokenQuotes,
  });

  // Get input token data
  const input_token_data: TypedMarketActionInputTokenData = {
    ...input_token_quote,
    raw_amount: total_quantity_filled ?? '0',
    token_amount: parseFloat(
      ethers.utils.formatUnits(
        total_quantity_filled,
        input_token_quote.decimals,
      ),
    ),
    token_amount_usd:
      input_token_quote.price *
      parseFloat(
        ethers.utils.formatUnits(
          total_quantity_filled,
          input_token_quote.decimals,
        ),
      ),
  };

  if (!!enrichedMarket) {
    // Calculate incentive data
    incentiveData = action_incentive_token_ids.map((incentive_token_id) => {
      // Get incentive token quote
      const incentive_token_quote = getTokenQuote({
        token_id: incentive_token_id,
        token_quotes: propsTokenQuotes,
      });

      // Get incentive token raw amount
      const incentive_token_raw_amount =
        token_id_to_amount_map[incentive_token_id].toString();

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
    });
  }

  return {
    incentiveData,
    inputTokenData: input_token_data,
  };
};

export const getVaultIPMarketOfferTransactionOptions = ({
  chain_id,
  offers,
  fill_amounts,
}: {
  chain_id: number;
  offers: Array<{
    offerID: string;
    targetVault: string;
    ap: string;
    fundingVault: string;
    expiry: string;
    incentivesRequested: string[];
    incentivesRatesRequested: string[];
  }>;
  fill_amounts: string[];
}) => {
  // Get contract address and ABI
  const address =
    ContractMap[chain_id as keyof typeof ContractMap]['VaultMarketHub'].address;
  const abi =
    ContractMap[chain_id as keyof typeof ContractMap]['VaultMarketHub'].abi;

  // Get transaction options
  const txOptions: TransactionOptionsType = {
    contractId: 'RecipeMarketHub',
    chainId: chain_id,
    id: 'allocate_ap_offers',
    label: 'Allocate AP Offers',
    address: address,
    abi: abi,
    functionName: 'allocateOffers',
    marketType: RoycoMarketType.recipe.id,
    args: [offers, fill_amounts],
    txStatus: 'idle',
    txHash: null,
  };

  return txOptions;
};

export const useVaultIPMarketOffer = ({
  account,
  chain_id,
  market_id,
  quantity,
  custom_token_data,
  frontend_fee_recipient,
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
    market_type: RoycoMarketType.recipe.id,
    enabled,
  });

  // Check if market action is valid
  const isValid = isVaultIPMarketOfferValid({
    quantity,
    enabled,
  });

  // Get market offers
  const propsMarketOffers = useMarketOffers({
    chain_id,
    market_type: RoycoMarketType.recipe.value,
    market_id,
    offer_side: RoycoMarketUserType.ap.value,
    quantity: quantity ?? '0',
    enabled: isValid.status,
  });

  // Get token quotes
  const propsTokenQuotes = useTokenQuotes({
    token_ids: Array.from(
      new Set([
        enrichedMarket?.input_token_id ?? '',
        ...(propsMarketOffers.data?.flatMap((offer) => offer.token_ids) ?? []),
      ]),
    ),
    custom_token_data,
    enabled: isValid.status,
  });

  // Get incentive data
  const { incentiveData, inputTokenData } =
    calculateVaultIPMarketOfferTokenData({
      baseMarket,
      enrichedMarket,
      propsMarketOffers,
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
    // Get incentive data with fees
    const incentiveDataWithFees = incentiveData.map((incentive, index) => {
      // Get base raw amount without fees
      const base_raw_amount: BigNumber = BigNumber.from(incentive.raw_amount);

      // Get protocol fee
      const protocol_fee = base_raw_amount
        .mul(BigNumber.from(baseMarket?.protocol_fee ?? 0))
        .div(BigNumber.from(10).pow(18));

      // Get frontend fee
      const frontend_fee = base_raw_amount
        .mul(BigNumber.from(baseMarket?.frontend_fee ?? 0))
        .div(BigNumber.from(10).pow(18));

      // Get raw amount with fees
      const raw_amount: BigNumber = base_raw_amount
        .add(protocol_fee)
        .add(frontend_fee);

      // Get token amount
      const token_amount: number = parseFloat(
        ethers.utils.formatUnits(raw_amount, incentive.decimals),
      );

      // Get token amount in USD
      const token_amount_usd = incentive.price * token_amount;

      return {
        ...incentive,
        raw_amount: raw_amount.toString(),
        token_amount: token_amount,
        token_amount_usd: token_amount_usd,
      };
    });

    // Get offer transaction options
    const offerTxOptions: TransactionOptionsType =
      getVaultIPMarketOfferTransactionOptions({
        chain_id,
        offers:
          propsMarketOffers.data?.map((offer) => ({
            offerID: offer.offer_id,
            targetVault: offer.market_id,
            ap: offer.creator,
            fundingVault: offer.funding_vault,
            expiry: offer.expiry,
            incentivesRequested: offer.token_ids.map((token_id) => {
              const token_address = token_id.split('-')[1];
              return token_address;
            }),
            incentivesRatesRequested: offer.token_amounts,
          })) ?? [],
        fill_amounts:
          propsMarketOffers.data?.map((offer) => offer.fill_quantity) ?? [],
      });

    // Set offer transaction options
    postContractOptions = [
      {
        ...offerTxOptions,
        tokensIn: [inputTokenData],
        tokensOut: incentiveDataWithFees,
      },
    ];

    // Get approval transaction options
    const approvalTxOptions: TransactionOptionsType[] =
      getApprovalContractOptions({
        market_type: RoycoMarketType.recipe.id,
        token_ids: incentiveDataWithFees.map((incentive) => incentive.id),
        required_approval_amounts: incentiveDataWithFees.map(
          (incentive) => incentive.raw_amount,
        ),
        spender:
          ContractMap[chain_id as keyof typeof ContractMap]['RecipeMarketHub']
            .address,
      });

    // Set approval transaction options
    preContractOptions = approvalTxOptions;
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
    propsMarketOffers.isLoading ||
    propsTokenAllowance.isLoading ||
    propsTokenQuotes.isLoading;

  // Check if ready
  const isReady = writeContractOptions.length > 0;

  // Check if offer can be performed completely or partially
  if (isReady) {
    if (BigNumber.from(inputTokenData?.raw_amount ?? 0).lte(0)) {
      canBePerformedCompletely = false;
      canBePerformedPartially = false;
    } else if (
      BigNumber.from(inputTokenData?.raw_amount ?? 0).eq(
        BigNumber.from(quantity ?? 0),
      )
    ) {
      canBePerformedCompletely = true;
      canBePerformedPartially = true;
    } else {
      canBePerformedCompletely = false;
      canBePerformedPartially = true;
    }
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
