import { type TypedRoycoClient } from '../client';

import type { SupportedToken } from '../constants';
import { getSupportedToken } from '../constants';
import { BigNumber } from 'ethers';

import type {
  BaseQueryFilter,
  BaseSortingFilter,
  CustomTokenData,
  Database,
} from '../types';
import {
  parseNumber,
  parseRawAmount,
  parseRawAmountToTokenAmount,
  parseTokenAmountToTokenAmountUsd,
} from '../utils';

export type EnrichedPositionsRecipeDataType =
  Database['public']['CompositeTypes']['enriched_positions_recipe_data_type'] & {
    tokens_data: Array<
      SupportedToken & {
        raw_amount: string;
        token_amount: number;
        token_amount_usd: number;
        price: number;
        fdv: number;
        total_supply: number;
      }
    >;
    input_token_data: Array<
      SupportedToken & {
        raw_amount: string;
        token_amount: number;
        token_amount_usd: number;
        price: number;
        fdv: number;
        total_supply: number;
      }
    >;
    change_ratio: number;
    annual_change_ratio: number;
  };

const constructEnrichedPositionsRecipeFilterClauses = (
  filters: Array<BaseQueryFilter>,
): string => {
  let filterClauses = '';

  /**
   * @note To filter string: wrap in single quotes
   * @note To filter number: no quotes
   */
  filters.forEach((filter, filterIndex) => {
    filterClauses += ` ${filter.id} = ${filter.value} `;

    if (filterIndex !== filters.length - 1) {
      filterClauses += ` ${filter.join ?? 'OR'} `;
    }
  });

  return filterClauses;
};

export const getEnrichedPositionsRecipeQueryOptions = (
  client: TypedRoycoClient,
  account_address: string,
  chain_id: number,
  market_id: string,
  custom_token_data?: CustomTokenData,
  page_index: number = 0,
  filters: Array<BaseQueryFilter> = [],
  sorting?: Array<BaseSortingFilter>,
) => ({
  queryKey: [
    'enriched-positions-recipe',
    account_address,
    chain_id,
    market_id,
    custom_token_data,
    page_index,
    ...filters.map((filter) => `${filter.id}:${filter.value}`),
    ...(sorting?.map((sorting) => `${sorting.id}:${sorting.desc}`) ?? []),
  ],
  queryFn: async () => {
    const filterClauses =
      constructEnrichedPositionsRecipeFilterClauses(filters);

    const result = await client.rpc('get_enriched_positions_recipe', {
      account_address: account_address,
      chain_id: chain_id,
      market_id: market_id,
      custom_token_data,
      page_index: page_index,
      filters: filterClauses,
      sorting: undefined, // @TODO Update this
    });

    if (!!result.data && !!result.data.data && result.data.data.length > 0) {
      const rows = result.data.data;

      const new_rows = rows.map((row) => {
        if (
          !!row.input_token_id &&
          !!row.token_ids &&
          !!row.token_amounts &&
          !!row.protocol_fee_amounts &&
          !!row.frontend_fee_amounts
        ) {
          const tokens_data = row.token_ids.map((tokenId, tokenIndex) => {
            const token_price: number = row.token_price_values
              ? row.token_price_values[tokenIndex]
              : 0;
            const token_fdv: number = row.token_fdv_values
              ? row.token_fdv_values[tokenIndex]
              : 0;
            const token_total_supply: number = row.token_total_supply_values
              ? row.token_total_supply_values[tokenIndex]
              : 0;

            const token_info: SupportedToken = getSupportedToken(tokenId);

            const raw_amount: string = parseRawAmount(
              row.token_amounts && row.token_amounts[tokenIndex],
            );

            const token_amount: number = parseRawAmountToTokenAmount(
              raw_amount,
              token_info.decimals,
            );

            const token_amount_usd = parseTokenAmountToTokenAmountUsd(
              token_amount,
              token_price,
            );

            return {
              ...token_info,
              raw_amount,
              token_amount,
              token_amount_usd,
              price: token_price,
              fdv: token_fdv,
              total_supply: token_total_supply,
            };
          });

          const input_token_info: SupportedToken = getSupportedToken(
            row.input_token_id,
          );
          const input_token_price: number = row.input_token_price ?? 0;
          const input_token_fdv: number = row.input_token_fdv ?? 0;
          const input_token_total_supply: number =
            row.input_token_total_supply ?? 0;
          const input_token_raw_amount: string = parseRawAmount(row.quantity);

          const input_token_token_amount: number = parseRawAmountToTokenAmount(
            input_token_raw_amount,
            input_token_info.decimals,
          );

          const input_token_token_amount_usd = parseTokenAmountToTokenAmountUsd(
            input_token_token_amount,
            input_token_price,
          );

          const input_token_data = {
            ...input_token_info,
            raw_amount: input_token_raw_amount,
            token_amount: input_token_token_amount,
            token_amount_usd: input_token_token_amount_usd,
            price: input_token_price,
            fdv: input_token_fdv,
            total_supply: input_token_total_supply,
          };

          const total_value_in_usd = input_token_data.token_amount_usd;
          const total_value_out_usd = tokens_data.reduce(
            (acc, token) => acc + token.token_amount_usd,
            0,
          );

          const change_ratio =
            total_value_in_usd > 0
              ? total_value_out_usd / total_value_in_usd
              : 0;

          let lockup_time = Number(row.lockup_time ?? '0');

          if (lockup_time === 0) {
            lockup_time = 365 * 24 * 60 * 60;
          }

          const annual_change_ratio =
            (change_ratio * lockup_time) / (60 * 60 * 24 * 365);

          return {
            ...row,
            tokens_data,
            input_token_data,
            change_ratio,
            annual_change_ratio,
          };
        }
      });

      return {
        count: result.data.count,
        data: new_rows,
      };
    }

    return result;
  },
  keepPreviousData: true,
  placeholderData: (previousData: any) => previousData,
  refetchInterval: 1000 * 60 * 1, // 1 min
  refetchOnWindowFocus: false,
  refreshInBackground: true,
});
