import { useQueryClient } from '@tanstack/react-query';
import { useSettingsStore } from 'src/stores/settings';
import { useSpindlStore } from 'src/stores/spindl';
import type { SpindlFetchParams, SpindlItem } from 'src/types/spindl';
import { shallow } from 'zustand/shallow';
import { fetchSpindl } from './fetchSpindl';

export const useSpindlFetch = () => {
  const queryClient = useQueryClient();
  const [setSpindl] = useSpindlStore((state) => [state.setSpindl]);
  const disabledFeatureCards = useSettingsStore(
    (state) => state.disabledFeatureCards,
    shallow,
  );

  const fetchSpindlData = (params: SpindlFetchParams) => {
    queryClient.fetchQuery({
      queryKey: Object.values(params),
      queryFn: async ({ queryKey }) => {
        const [, params] = queryKey as ['spindl-cards', SpindlFetchParams];
        if (!params) {
          return null;
        }

        const { data } = await fetchSpindl(params);
        if (data && data.length) {
          const items = data
            .filter((item: SpindlItem) => {
              return !disabledFeatureCards.includes(item.id);
            })
            .map((item: SpindlItem) => {
              return {
                id: item.id,
                attributes: {
                  Title: item.title,
                  Subtitle: item.description,
                  CTACall: item.ctas[0]?.title || '',
                  URL: item.ctas[0]?.href || '',
                  DisplayConditions: { mode: item.mode || 'light' },
                  createdAt: Date.now().toString(),
                  updatedAt: Date.now().toString(),
                  PersonalizedFeatureCard: true,
                  publishedAt: Date.now().toString(),
                  uid: item.id,
                  BackgroundImageLight: {
                    data: {
                      id: 0,
                      attributes: {
                        alternativeText: 'Spindl ad img',
                        width: 384,
                        height: 160,
                        url: item.imageUrl,
                      },
                    },
                  },
                  BackgroundImageDark: {
                    data: {
                      id: 1,
                      attributes: {
                        alternativeText: `${item.imageAltText || item.advertiser?.name || ''} image`,
                        width: 384,
                        height: 160,
                        url: item.imageUrl,
                      },
                    },
                  },
                  spindleData: {
                    impression_id: item.impressionId,
                    ad_creative_id: item.advertiserId,
                  },
                },
              };
            });
          setSpindl(items.length ? items.slice(0, 1) : []);
          return items;
        }
        return null;
      },
    });
  };

  return { fetchSpindlData };
};
