import { useQuery } from '@tanstack/react-query';
import type { EnrichedOfferDataType } from '../queries';
import {
  getTokenQuotesQueryOptions,
  getHighestOffersRecipeQueryOptions,
} from '../queries';
import { RoycoClient, useRoycoClient } from '../client';
import { getSupportedToken, SupportedToken } from '../constants';
import { useEnrichedOffers } from './use-enriched-offers';
import { RoycoMarketOfferType } from '../market';

export const useHighestOffers = ({
  chain_id,
  market_id,
  market_type,
}: {
  chain_id: number;
  market_id: string;
  market_type: number;
}) => {
  const propsEnrichedOffersAP = useEnrichedOffers({
    chain_id,
    market_id,
    market_type,
    can_be_filled: true,
    filters: [
      {
        id: 'offer_side',
        value: 0,
      },
    ],
    sorting: [
      {
        id: 'annual_change_ratio',
        desc: false,
      },
    ],
  });

  const propsEnrichedOffersIP = useEnrichedOffers({
    chain_id,
    market_id,
    market_type,
    can_be_filled: true,
    filters: [
      {
        id: 'offer_side',
        value: 1,
      },
    ],
    sorting: [
      {
        id: 'annual_change_ratio',
        desc: true,
      },
    ],
  });

  const isLoading =
    propsEnrichedOffersAP.isLoading || propsEnrichedOffersIP.isLoading;
  const isRefetching =
    propsEnrichedOffersAP.isRefetching || propsEnrichedOffersIP.isRefetching;
  const isError =
    propsEnrichedOffersAP.isError || propsEnrichedOffersIP.isError;

  const data = {
    ap_offers:
      !!propsEnrichedOffersAP.data &&
      !!propsEnrichedOffersAP.data &&
      !!propsEnrichedOffersAP.data.count &&
      propsEnrichedOffersAP.data.count !== 0 &&
      !!propsEnrichedOffersAP.data.data
        ? // @ts-ignore
          (propsEnrichedOffersAP.data.data as Array<EnrichedOfferDataType>)
        : [],
    ip_offers:
      !!propsEnrichedOffersIP.data &&
      !!propsEnrichedOffersIP.data &&
      !!propsEnrichedOffersIP.data.count &&
      propsEnrichedOffersIP.data.count !== 0 &&
      !!propsEnrichedOffersIP.data.data
        ? // @ts-ignore
          (propsEnrichedOffersIP.data.data as Array<EnrichedOfferDataType>)
        : [],
  };

  return {
    isLoading,
    isRefetching,
    isError,
    data,
  };
};
