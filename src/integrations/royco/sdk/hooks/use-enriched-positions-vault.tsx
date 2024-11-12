import { useQuery } from '@tanstack/react-query';
import { RoycoClient, useRoycoClient } from '../client';
import { getEnrichedPositionsRecipeQueryOptions } from '../queries/get-enriched-positions-recipe';
import type { CustomTokenData } from '../types';
import { BaseQueryFilter, BaseSortingFilter } from '../types';
import { useEnrichedMarkets } from './use-enriched-markets';
import { useEnrichedAccountBalancesVaultInMarket } from './use-enriched-account-balances-vault-in-market';
import { RoycoMarketUserType, TypedRoycoMarketUserType } from '../market';

export const useEnrichedPositionsVault = ({
  account_address,
  chain_id,
  market_id,
  custom_token_data,
  offer_side,
}: {
  account_address: string;
  chain_id: number;
  market_id: string;
  custom_token_data?: CustomTokenData;
  offer_side?: number;
}) => {
  let data = null;

  const propsEnrichedMarket = useEnrichedMarkets({
    chain_id,
    market_id,
    custom_token_data,
  });

  const market = propsEnrichedMarket.data?.[0];

  const propsEnrichedAccountBalancesVaultInMarket =
    useEnrichedAccountBalancesVaultInMarket({
      chain_id,
      market_id,
      account_address,
      custom_token_data,
    });

  const balances = propsEnrichedAccountBalancesVaultInMarket.data;

  if (!!market && !!balances) {
    const position_ap = {
      id: `${market.chain_id}_${market.market_type}_${market.market_id}_${RoycoMarketUserType.ap.value}`,
      offer_side: RoycoMarketUserType.ap.value,
      annual_change_ratio: market.annual_change_ratio,
      reward_style: 0,
      tokens_data: balances.incentives_ap_data,
      input_token_data: balances.input_token_data_ap,
    };

    const position_ip = {
      id: `${market.chain_id}_${market.market_type}_${market.market_id}_${RoycoMarketUserType.ip.value}`,
      offer_side: RoycoMarketUserType.ip.value,
      annual_change_ratio: market.annual_change_ratio,
      reward_style: 0,
      tokens_data: balances.incentives_ip_data,
      input_token_data: balances.input_token_data_ip,
    };

    let new_data = [];

    if (
      (balances.incentives_ap_data.length > 0 ||
        balances.input_token_data_ap.token_amount > 0) &&
      (!offer_side || offer_side === RoycoMarketUserType.ap.value)
    ) {
      new_data.push(position_ap);
    } else if (
      (balances.incentives_ip_data.length > 0 ||
        balances.input_token_data_ip.token_amount > 0) &&
      (!offer_side || offer_side === RoycoMarketUserType.ip.value)
    ) {
      new_data.push(position_ip);
    }

    data = new_data;
  }

  const isLoading =
    propsEnrichedMarket.isLoading ||
    propsEnrichedAccountBalancesVaultInMarket.isLoading;
  const isRefetching =
    propsEnrichedMarket.isRefetching ||
    propsEnrichedAccountBalancesVaultInMarket.isRefetching;
  const isError =
    propsEnrichedMarket.isError ||
    propsEnrichedAccountBalancesVaultInMarket.isError;
  const isSuccess =
    propsEnrichedMarket.isSuccess &&
    propsEnrichedAccountBalancesVaultInMarket.isSuccess;

  return {
    data,
    isLoading,
    isRefetching,
    isError,
    isSuccess,
  };
};
