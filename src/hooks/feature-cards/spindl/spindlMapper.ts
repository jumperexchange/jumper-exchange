import type {
  SpindlCardData,
  SpindlMediaAttributes,
  SpindlItem,
} from '@/types/spindl';

export function spindlItemToCardData(
  item: SpindlItem,
  index: number,
): SpindlCardData {
  return {
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
  };
}
