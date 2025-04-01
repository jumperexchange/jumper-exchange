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
    if (Array.isArray(data?.items) && data.items.length > 0) {
      const items = data.items
        .filter((item: SpindlItem) => !disabledFeatureCards.includes(item.id))
        .map((item: SpindlItem, index: number) => ({
          id: item.id,
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
          // TODO: Needs to be refactored
          BackgroundImageLight: {
            id: index.toString(), // Change this to a number
            name: `${item.imageAltText || item.advertiser?.name || ''} image`,
            alternativeText: `${item.imageAltText || item.advertiser?.name || ''} image`,
            width: 384,
            height: 160,
            formats: {},
            url: item.imageUrl,
          } as SpindlMediaAttributes,
          BackgroundImageDark: {
            id: index.toString(), // Change this to a number
            name: `${item.imageAltText || item.advertiser?.name || ''} image`,
            alternativeText: `${item.imageAltText || item.advertiser?.name || ''} image`,
            width: 384,
            height: 160,
            formats: {},
            url: item.imageUrl,
          } as SpindlMediaAttributes,
          spindlData: {
            impression_id: item.impressionId,
            ad_creative_id: item.advertiserId,
          },
        }));
      setSpindl(items.length ? items.slice(0, 1) : []);
    }
  };

  return processSpindlData;
};
