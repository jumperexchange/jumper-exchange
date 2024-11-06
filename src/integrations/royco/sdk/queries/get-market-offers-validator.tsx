import { createHash } from 'crypto';

export const getMarketOffersValidatorQueryOptions = ({
  offer_ids,
  offerValidationUrl,
}: {
  offer_ids: string[];
  offerValidationUrl: string;
}) => ({
  queryKey: [
    'simulate',
    createHash('sha256')
      .update(offer_ids.map((offer_id) => `offer:${offer_id}`).join(''))
      .digest('hex'),
  ],
  queryFn: async () => {
    const response = await fetch(offerValidationUrl ?? '', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        offer_ids,
      }),
    });

    const res = await response.json();
    const data = res.data as string[];
    return data;
  },
});
