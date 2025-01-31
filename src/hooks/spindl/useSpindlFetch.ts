import { useCallback } from 'react';
import { useSpindlStore } from 'src/stores/spindl';
import type { SpindlFetchParams } from 'src/types/spindl';
import type { FeatureCardData } from 'src/types/strapi';
import { fetchSpindl } from './fetchSpindl';

export const useSpindlFetch = () => {
  const setSpindl = useSpindlStore((state) => state.setSpindl);

  const fetchSpindlData = useCallback(
    async ({ country, chainId, tokenAddress, address }: SpindlFetchParams) => {
      const { data } = await fetchSpindl({
        country,
        chainId,
        tokenAddress,
        address,
      });

      if (data && data.length) {
        const featureCardsSpindle: FeatureCardData[] = data.map(
          (spindlCard: any, index: number) => {
            return {
              id: `spindl-${index}`,
              attributes: {
                Title: spindlCard.title,
                Subtitle: spindlCard.description,
                CTACall: spindlCard.ctas[0]?.title || '',
                URL: spindlCard.ctas[0]?.href || '',
                DisplayConditions: { mode: 'light', showOnce: true },
                createdAt: Date.now().toString(),
                updatedAt: Date.now().toString(),
                PersonalizedFeatureCard: true,
                publishedAt: Date.now().toString(),
                uid: spindlCard.id,
                BackgroundImageLight: {
                  data: {
                    id: 0,
                    attributes: {
                      alternativeText: 'Spindl ad img',
                      width: 384,
                      height: 160,
                      url: spindlCard.imageUrl,
                    },
                  },
                },
                BackgroundImageDark: {
                  data: {
                    id: 1,
                    attributes: {
                      alternativeText: `${spindlCard.imageAltText || spindlCard.advertiser?.name || ''} image`,
                      width: 384,
                      height: 160,
                      url: spindlCard.imageUrl,
                    },
                  },
                },
                spindleData: {
                  impression_id: spindlCard.impressionId,
                  ad_creative_id: spindlCard.advertiserId,
                },
              },
            };
          },
        );
        setSpindl(featureCardsSpindle);
      }
    },
    [setSpindl],
  );

  return fetchSpindlData;
};
