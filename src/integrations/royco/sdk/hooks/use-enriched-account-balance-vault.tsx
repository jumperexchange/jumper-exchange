import type { EnrichedMarketDataType } from '../queries';
import { useTokenQuotes } from './use-token-quotes';
import { ContractMap } from '../contracts';
import type { Abi, Address } from 'abitype';
import { useReadContracts } from 'wagmi';
import type { SupportedToken } from '../constants';
import { getSupportedToken } from '../constants';
import type { BigNumber } from 'ethers';
import { ethers } from 'ethers';
import {
  parseRawAmountToTokenAmount,
  parseTokenAmountToTokenAmountUsd,
} from '../utils';

export const useEnrichedAccountBalanceVault = ({
  account_address,
  market,
  enabled = true,
}: {
  account_address: string;
  market: EnrichedMarketDataType | undefined;
  enabled?: boolean;
}) => {
  let data = {
    input_token_data_ap: {
      ...getSupportedToken(''),
      raw_amount: '',
      token_amount: 0,
      token_amount_usd: 0,
    },
    incentives_ap_data: Array<
      SupportedToken & {
        raw_amount: string;
        token_amount: number;
        token_amount_usd: number;
      }
    >(),
    balance_usd_ap: 0,
  };

  const token_ids = !!market
    ? [
        market.input_token_id ?? '',
        ...(market.base_incentive_ids ?? []).map((incentive) => incentive),
      ]
    : [];

  const propsTokenQuotes = useTokenQuotes({
    token_ids,
  });

  const vaultContracts = !!market
    ? [
        {
          chainId: market.chain_id,
          address: market.market_id as Address,
          abi: ContractMap[market.chain_id as keyof typeof ContractMap][
            'WrappedVault'
          ].abi as Abi,
          functionName: 'balanceOf',
          args: [account_address],
        },
        ...(market.base_incentive_ids ?? []).map((incentive) => {
          const [chain_id, contract_address] = incentive.split('-');

          return {
            chainId: market.chain_id,
            address: market.market_id as Address,
            abi: ContractMap[market.chain_id as keyof typeof ContractMap][
              'WrappedVault'
            ].abi as Abi,
            functionName: 'currentUserRewards',
            args: [contract_address, account_address],
          };
        }),
      ]
    : [];

  const contractsToRead = vaultContracts;

  const propsReadContracts = useReadContracts({
    // @ts-ignore
    contracts: contractsToRead,
    refetchInterval: 1000 * 60 * 1, // 1 min
  });

  if (!propsReadContracts.isLoading && propsReadContracts.data && !!market) {
    try {
      const input_token_data = getSupportedToken(market.input_token_id);

      let input_token_data_ap: SupportedToken & {
        raw_amount: string;
        token_amount: number;
        token_amount_usd: number;
      } = {
        ...input_token_data,
        raw_amount: '0',
        token_amount: 0,
        token_amount_usd: 0,
      };

      let incentives_ap_data: Array<
        SupportedToken & {
          raw_amount: string;
          token_amount: number;
          token_amount_usd: number;
        }
      > = [];

      let balance_usd_ap = 0;

      for (let i = 0; i < propsReadContracts.data.length; i++) {
        const token_quote = propsTokenQuotes.data?.find(
          (token) => token.id === token_ids[i],
        );

        if (!!token_quote) {
          const result = propsReadContracts.data[i].result as BigNumber;

          const token_id = token_ids[i];
          const token_data = getSupportedToken(token_id);
          const raw_amount = result.toString();
          const token_amount = parseRawAmountToTokenAmount(
            raw_amount,
            token_data.decimals,
          );
          const token_amount_usd = parseTokenAmountToTokenAmountUsd(
            token_amount,
            token_quote.price,
          );

          if (token_id === market.input_token_id) {
            input_token_data_ap = {
              ...token_data,
              raw_amount,
              token_amount,
              token_amount_usd,
            };
          } else {
            incentives_ap_data.push({
              ...token_data,
              raw_amount,
              token_amount,
              token_amount_usd,
            });
          }

          balance_usd_ap += token_amount_usd;
        }
      }

      data = {
        input_token_data_ap,
        incentives_ap_data,
        balance_usd_ap,
      };
    } catch (error) {
      console.log('useEnrichedAccountBalanceVault error', error);
    }
  }

  const isLoading = propsTokenQuotes.isLoading || propsReadContracts.isLoading;
  const isRefetching =
    propsTokenQuotes.isRefetching || propsReadContracts.isRefetching;
  const isError = propsTokenQuotes.isError || propsReadContracts.isError;
  const isSuccess = propsTokenQuotes.isSuccess && propsReadContracts.isSuccess;

  return {
    data,
    isLoading,
    isRefetching,
    isError,
    isSuccess,
  };
};
