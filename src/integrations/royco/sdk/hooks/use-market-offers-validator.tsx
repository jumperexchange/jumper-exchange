import { getMarketOffersValidatorQueryOptions } from '../queries';
import { useQuery } from '@tanstack/react-query';

export const useMarketOffersValidator = ({
  offer_ids,
  offerValidationUrl,
  enabled = true,
}: {
  offer_ids: string[];
  offerValidationUrl: string;
  enabled?: boolean;
}) => {
  return useQuery({
    ...getMarketOffersValidatorQueryOptions({
      offer_ids,
      offerValidationUrl,
    }),
    enabled,
  });
};
