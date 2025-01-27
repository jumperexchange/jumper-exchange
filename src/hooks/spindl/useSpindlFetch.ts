import { useSpindlStore } from 'src/stores/spindl';
import type { SpindlFetchParams, SpindlItem } from 'src/types/spindl';
import type { FeatureCardData } from 'src/types/strapi';
import { fetchSpindl } from './fetchSpindl';

export const useSpindlFetch = () => {
  const [setSpindl] = useSpindlStore((state) => [state.setSpindl]);

  const fetch = async ({
    country,
    chainId,
    tokenAddress,
    address,
  }: SpindlFetchParams) => {
    const { data } = await fetchSpindl({
      country,
      chainId,
      tokenAddress,
      address,
    });
    // console.log('DATA', data);
    if (data && data.length) {
      const firstItem = (data as SpindlItem[])[0]; // Get the first item from the array
      if (firstItem) {
        const featureCardsSpindle: FeatureCardData[] = [
          {
            id: `spindle-0`,
            attributes: {
              Title: firstItem.title, // used to set the title of the feature card
              Subtitle: firstItem.description, // used to set the subtitle of the feature card
              CTACall: firstItem.ctas[0]?.title || '', // used to set the CTA label of the feature card
              URL: firstItem.ctas[0]?.href || '', // used to set the URL of the feature card
              // TitleColor?: string, // @spindl: you can make use of this to set the color of the title
              // CTAColor?: string, // @spindl: you can make use this to set the color of the CTA
              DisplayConditions: { mode: 'light', showOnce: true },
              createdAt: Date.now().toString(),
              updatedAt: Date.now().toString(),
              PersonalizedFeatureCard: true,
              publishedAt: Date.now().toString(),
              uid: firstItem.id,
              // @spindl: @spindl: do we support two versions of one card (light and dark mode) or only show either of them per card?
              BackgroundImageLight: {
                // @spindl: this would be the place for a light image bg
                data: {
                  id: 0,
                  attributes: {
                    alternativeText: 'Spindl ad img', // @spindl: can we supply an alternative text or use advertiser.name?
                    width: 384, // @spindl: bg img must have this width
                    height: 160, // @spindl: bg img must have this height
                    url: firstItem.imageUrl, // !!!! @spindl: problem: Images have texts baked in! We need to remove this and apply texts via Title, Subtitle and CTACall
                  },
                },
              },
              BackgroundImageDark: {
                // @spindl: this would be the place for a dark image bg
                data: {
                  id: 1,
                  attributes: {
                    alternativeText: `${firstItem.advertiser.name} image`, // @spindl: can we supply an alternative text or use advertiser.name?
                    width: 384, // @spindl: bg img must have this width
                    height: 160, // @spindl: bg img must have this height
                    url: firstItem.imageUrl, // !!!! @spindl: problem: Images have texts baked in! We need to remove this and apply texts via Title, Subtitle and CTACall
                  },
                },
              },
              spindleData: {
                impression_id: firstItem.impressionId,
                ad_creative_id: firstItem.advertiserId,
              },
            },
          },
        ];
        setSpindl(featureCardsSpindle);
      }
    }
  };

  return fetch;
};
