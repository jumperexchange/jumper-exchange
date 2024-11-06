import { type TypedRoycoClient } from '../client';
import type { SupportedToken } from '../constants';
import { getSupportedToken } from '../constants';
import type {
  BaseQueryFilter,
  BaseSortingFilter,
  CustomTokenData,
  Database,
} from '../types';
import {
  constructBaseQueryFilterClauses,
  constructBaseSortingFilterClauses,
  parseRawAmount,
  parseRawAmountToTokenAmount,
  parseTokenAmountToTokenAmountUsd,
} from '../utils';

const constructOfferFilterClauses = (
  filters: BaseQueryFilter[] | undefined,
): string | undefined => {
  if (!filters) {
    return undefined;
  }

  let offerSideFilter = '';
  let isCancelledFilter = '';

  filters.forEach((filter) => {
    switch (filter.id) {
      case 'offer_side':
        if (offerSideFilter) {
          offerSideFilter += ' OR ';
        }
        if (filter.condition === 'NOT') {
          offerSideFilter += `offer_side <> ${filter.value}`;
        } else {
          offerSideFilter += `offer_side = ${filter.value}`;
        }
        break;
      case 'is_cancelled':
        if (isCancelledFilter) {
          isCancelledFilter += ' OR ';
        }
        if (filter.condition === 'NOT') {
          isCancelledFilter += `is_cancelled <> ${filter.value}`;
        } else {
          isCancelledFilter += `is_cancelled = ${filter.value}`;
        }
        break;
    }
  });

  let filterClauses = '';

  if (offerSideFilter) {
    filterClauses += `(${offerSideFilter}) AND `;
  }
  if (isCancelledFilter) {
    filterClauses += `(${isCancelledFilter}) AND `;
  }

  if (filterClauses) {
    filterClauses = filterClauses.slice(0, -5); // Remove the trailing " AND "
  }

  return filterClauses;
};

export type EnrichedOfferDataType =
  Database['public']['CompositeTypes']['enriched_offer_data_type'] & {
    tokens_data: Array<
      SupportedToken & {
        raw_amount: string;
        token_amount: number;
        token_amount_usd: number;
        price: number;
        fdv: number;
        total_supply: number;
        annual_change_ratio: number;
        per_input_token: number;
      }
    >;
    input_token_data: SupportedToken & {
      raw_amount: string;
      token_amount: number;
      token_amount_usd: number;
      price: number;
      fdv: number;
      total_supply: number;
    };
  };

export const getEnrichedOffersQueryOptions = (
  client: TypedRoycoClient,
  chain_id: number,
  market_type?: number,
  market_id?: string,
  creator?: string,
  can_be_filled?: boolean,
  page_index?: number,
  filters?: Array<BaseQueryFilter>,
  sorting?: Array<BaseSortingFilter>,
  custom_token_data?: CustomTokenData,
) => ({
  queryKey: [
    'enriched-offers',
    `${chain_id}-${market_type}-${market_id}-${creator}-${can_be_filled}-${page_index}`,
    ...(custom_token_data || []).map(
      (token) =>
        `${token.token_id}-${token.price}-${token.fdv}-${token.total_supply}`,
    ),
    ...(filters || []).map((filter) => `${filter.id}-${filter.value}`),
    ...(sorting || []).map(
      (sort) => `${sort.id}-${sort.desc ? 'desc' : 'asc'}`,
    ),
  ],
  queryFn: async () => {
    const filterClauses = constructOfferFilterClauses(filters);
    const sortingClauses = constructBaseSortingFilterClauses(sorting);

    const result = await client.rpc('get_enriched_offers', {
      chain_id,
      market_type,
      market_id,
      creator,
      can_be_filled,
      page_index,
      filters: filterClauses,
      sorting: sortingClauses,
      custom_token_data,
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
          const input_token_info: SupportedToken = getSupportedToken(
            row.input_token_id,
          );
          const input_token_price: number = row.input_token_price ?? 0;
          const input_token_fdv: number = row.input_token_fdv ?? 0;
          const input_token_total_supply: number =
            row.input_token_total_supply ?? 0;
          const input_token_raw_amount: string = parseRawAmount(
            row.quantity_remaining ?? '0',
          );

          const input_token_token_amount: number = parseRawAmountToTokenAmount(
            row.quantity_remaining ?? '0',
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
              row.token_amounts?.[tokenIndex],
            );

            const token_amount: number = parseRawAmountToTokenAmount(
              row.token_amounts?.[tokenIndex],
              token_info.decimals,
            );

            const token_amount_usd = parseTokenAmountToTokenAmountUsd(
              token_amount,
              token_price,
            );

            const per_input_token =
              token_amount / input_token_data.token_amount;

            const annual_change_ratio =
              row.annual_change_ratios?.[tokenIndex] ?? 0;

            return {
              ...token_info,
              raw_amount,
              token_amount,
              token_amount_usd,
              price: token_price,
              fdv: token_fdv,
              total_supply: token_total_supply,
              annual_change_ratio,
              per_input_token,
            };
          });

          return {
            ...row,
            tokens_data,
            input_token_data,
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
