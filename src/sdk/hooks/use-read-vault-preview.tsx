/**
 * @TODO Fix it
 */

import { useReadContract, useReadContracts } from 'wagmi';
import { ContractMap } from '../contracts';
import { BigNumber, ethers } from 'ethers';
import { NULL_ADDRESS } from '../constants';
import {
  RoycoMarketRewardStyle,
  RoycoMarketType,
  TypedRoycoMarketRewardStyle,
  TypedRoycoMarketType,
} from '../market';
import type { Abi, Address } from 'abitype';
import type { EnrichedMarketDataType } from '../queries';

export const useReadVaultPreview = ({
  market,
  quantity,
  enabled,
}: {
  market: EnrichedMarketDataType | undefined;
  quantity: string;
  enabled?: boolean;
}) => {
  let incentive_token_ids: string[] = [];
  let incentive_token_rates: string[] = [];
  let incentive_token_amounts: string[] = [];
  let incentive_time_left: string[] = [];

  // @ts-ignore
  let vaultContracts = [];

  if (!!market && enabled) {
    market.incentive_tokens_data.map((incentive) => {
      return {
        chainId: market.chain_id,
        address: market.market_id as Address,
        abi: ContractMap[market.chain_id as keyof typeof ContractMap][
          'WrappedVault'
        ].abi as Abi,
        functionName: 'previewRateAfterDeposit',
        args: [incentive.contract_address, quantity],
      };
    });
  }

  // @ts-ignore
  const contractsToRead = vaultContracts;

  const propsReadContracts = useReadContracts({
    // @ts-ignore
    contracts: contractsToRead,
  });

  if (
    enabled &&
    !propsReadContracts.isLoading &&
    propsReadContracts.data &&
    !!market
  ) {
    try {
      for (let i = 0; i < propsReadContracts.data.length; i++) {
        const result = propsReadContracts.data[i].result as BigNumber;

        const incentive_token_id = market.incentive_tokens_data[i].id;
        const incentive_token_rate = result.toString();

        const incentive_index = market.incentive_tokens_data.findIndex(
          (incentive) => incentive.id === incentive_token_id,
        );

        const incentive_end_timestamp =
          market.base_end_timestamps?.[incentive_index];
        const current_time = Math.floor(Date.now() / 1000).toString();

        const time_left: BigNumber = BigNumber.from(
          incentive_end_timestamp,
        ).sub(current_time);

        const incentive_token_amount: string = BigNumber.from(
          incentive_token_rate,
        )
          .mul(BigNumber.from(time_left))
          .toString();

        incentive_token_ids.push(incentive_token_id);
        incentive_token_rates.push(incentive_token_rate);
        incentive_token_amounts.push(incentive_token_amount);
        incentive_time_left.push(time_left.toString());
      }
    } catch (error) {
      // console.log("useReadVaultPreview error", error);
    }
  }

  // console.log("incentive_token_ids", incentive_token_ids);
  // console.log("incentive_token_amounts", incentive_token_amounts);

  return {
    ...propsReadContracts,
    incentive_token_ids,
    incentive_token_rates,
    incentive_token_amounts,
    incentive_time_left,
  };
};
