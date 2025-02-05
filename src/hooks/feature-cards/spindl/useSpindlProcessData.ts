import { useSettingsStore } from 'src/stores/settings';
import { useSpindlStore } from 'src/stores/spindl';
import type {
  SpindlFetchData,
  SpindlItem,
  SpindlMediaAttributes,
} from 'src/types/spindl';
import { shallow } from 'zustand/shallow';

export const useSpindlProcessData = () => {
  const setSpindl = useSpindlStore((state) => state.setSpindl);
  const disabledFeatureCards = useSettingsStore(
    (state) => state.disabledFeatureCards,
    shallow,
  );

  const processSpindlData = (data?: SpindlFetchData) => {
    if (data && data.items?.length) {
      const items = data.items
        .filter((item: SpindlItem) => !disabledFeatureCards.includes(item.id))
        .map((item: SpindlItem, index: number) => ({
          id: item.id,
          attributes: {
            Title: item.title,
            Subtitle: item.description,
            CTACall: item.ctas[0]?.title || 'Learn more',
            URL: item.ctas[0]?.href || '',
            DisplayConditions: { mode: item.mode || 'dark' },
            TitleColor: item.titleColor,
            SubtitleColor: item.descriptionColor,
            CTAColor: item.ctas[0]?.color,
            createdAt: Date.now().toString(),
            updatedAt: Date.now().toString(),
            PersonalizedFeatureCard: true,
            publishedAt: Date.now().toString(),
            uid: item.id,
            BackgroundImageLight: {
              data: {
                id: index, // Change this to a number
                attributes: {
                  alternativeText: 'Spindl ad img',
                  width: 384,
                  height: 160,
                  url: item.imageUrl,
                } as SpindlMediaAttributes,
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
                } as SpindlMediaAttributes,
              },
            },
            spindleData: {
              impression_id: item.impressionId,
              ad_creative_id: item.advertiserId,
            },
          },
        }));
      setSpindl(items.length ? items.slice(0, 1) : []);
    }
  };

  return processSpindlData;
};
