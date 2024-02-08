import { useQuery } from '@tanstack/react-query';
import type { BannerData } from 'src/types';

export interface UseBannerProps {
  banner: BannerData | undefined;
  url: URL;
  isSuccess: boolean;
}

const STRAPI_CONTENT_TYPE = 'top-banners';
// Query Content-Type "TopBanners" from Strapi
export const useBanner = (): UseBannerProps => {
  const apiBaseUrl =
    import.meta.env.VITE_STRAPI_DEVELOP === 'true'
      ? import.meta.env.VITE_LOCAL_STRAPI_URL
      : import.meta.env.VITE_STRAPI_URL;
  const apiUrl = new URL(`${apiBaseUrl}/${STRAPI_CONTENT_TYPE}`);
  apiUrl.searchParams.set('populate[0]', 'Image');
  apiUrl.searchParams.set('filters[ShowToAll][$eq]', 'true');
  apiUrl.searchParams.set('filters[Enabled][$eq]', 'true');
  import.meta.env.MODE !== 'production' &&
    apiUrl.searchParams.set('publicationState', 'preview');
  const apiAccesToken =
    import.meta.env.VITE_STRAPI_DEVELOP === 'true'
      ? import.meta.env.VITE_LOCAL_STRAPI_API_TOKEN
      : import.meta.env.VITE_STRAPI_API_TOKEN;

  console.log(apiUrl.href);

  const { data, isSuccess } = useQuery({
    queryKey: ['topBanner'],

    queryFn: async () => {
      const response = await fetch(decodeURIComponent(apiUrl.href), {
        headers: {
          Authorization: `Bearer ${apiAccesToken}`,
        },
      });
      const result = await response.json();
      return result.data;
    },
    enabled: true,
    refetchInterval: 1000 * 60 * 60,
  });

  return {
    banner: data && data.length > 0 ? data[0] : undefined,
    url: apiUrl,
    isSuccess,
  };
};
