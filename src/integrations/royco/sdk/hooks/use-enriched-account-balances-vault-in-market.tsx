import { useQuery } from '@tanstack/react-query';
import type {
  EnrichedAccountBalanceRecipeInMarketDataType,
  EnrichedMarketDataType,
} from '../queries';
import { getEnrichedAccountBalancesVaultInMarketQueryOptions } from '../queries';
import type { RoycoClient } from '../client';
import { useRoycoClient } from '../client';
import type { CustomTokenData } from '../types';
import { useEnrichedMarkets } from './use-enriched-markets';
import { RoycoMarketType } from '../market';
import { useEnrichedAccountBalanceVault } from './use-enriched-account-balance-vault';
import { getSupportedToken } from '../constants';

export const useEnrichedAccountBalancesVaultInMarket = ({
  chain_id,
  market_id,
  account_address,
  custom_token_data,
  enabled = true,
}: {
  chain_id: number;
  market_id: string;
  account_address: string;
  custom_token_data?: CustomTokenData;
  enabled?: boolean;
}) => {
  const client: RoycoClient = useRoycoClient();

  let data: EnrichedAccountBalanceRecipeInMarketDataType | null = null;

  const propsEnrichedMarket = useEnrichedMarkets({
    chain_id,
    market_type: RoycoMarketType.vault.value,
    market_id,
  });

  const propsEnrichedAccountBalancesVaultInMarketIP = useQuery({
    ...getEnrichedAccountBalancesVaultInMarketQueryOptions(
      client,
      chain_id,
      market_id,
      account_address,
      custom_token_data,
    ),
    enabled,
  });

  const propsEnrichedAccountBalancesVaultInMarketAP =
    useEnrichedAccountBalanceVault({
      account_address,
      market: propsEnrichedMarket.data?.[0] as
        | EnrichedMarketDataType
        | undefined,
    });

  const isLoading =
    propsEnrichedMarket.isLoading ||
    propsEnrichedAccountBalancesVaultInMarketIP.isLoading ||
    propsEnrichedAccountBalancesVaultInMarketAP.isLoading;

  const isRefetching =
    propsEnrichedMarket.isRefetching ||
    propsEnrichedAccountBalancesVaultInMarketIP.isRefetching ||
    propsEnrichedAccountBalancesVaultInMarketAP.isRefetching;

  const isError =
    propsEnrichedMarket.isError ||
    propsEnrichedAccountBalancesVaultInMarketIP.isError ||
    propsEnrichedAccountBalancesVaultInMarketAP.isError;

  const isSuccess =
    propsEnrichedMarket.isSuccess &&
    propsEnrichedAccountBalancesVaultInMarketIP.isSuccess &&
    propsEnrichedAccountBalancesVaultInMarketAP.isSuccess;

  if (!isLoading && !!propsEnrichedMarket.data) {
    let apData = propsEnrichedAccountBalancesVaultInMarketAP.data;
    let ipData = propsEnrichedAccountBalancesVaultInMarketIP.data;

    try {
      data = {
        input_token_data_ap: apData.input_token_data_ap,
        input_token_data_ip: ipData?.input_token_data_ip ?? {
          ...getSupportedToken(propsEnrichedMarket.data[0].input_token_id),
          raw_amount: '0',
          token_amount: 0,
          token_amount_usd: 0,
        },
        incentives_ap_data: apData.incentives_ap_data,
        incentives_ip_data: ipData?.incentives_ip_data ?? [],
        balance_usd_ap: apData.balance_usd_ap,
        balance_usd_ip: ipData?.balance_usd_ip ?? 0,
      };
    } catch (err) {}
  }

  return {
    data,
    isLoading,
    isRefetching,
    isError,
    isSuccess,
  };
};
