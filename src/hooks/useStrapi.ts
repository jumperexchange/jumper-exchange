import { useQuery } from '@tanstack/react-query';
import { BLOG, FEATURE_CARDS } from 'src/const';

export interface UseStrapiProps {
  data: any | undefined;
  url: URL;
  isSuccess: boolean;
}
interface ContentTypeProps {
  contentType: 'feature-cards' | 'blog-articles';
  filterSlug?: string;
}

// Query passed Content-Type var from Strapi
export const useStrapiQuery = ({
  contentType,
  filterSlug,
}: ContentTypeProps): UseStrapiProps => {
  const apiBaseUrl =
    import.meta.env.VITE_STRAPI_DEVELOP === 'true'
      ? import.meta.env.VITE_LOCAL_STRAPI_URL
      : import.meta.env.VITE_STRAPI_URL;
  const apiUrl = new URL(`${apiBaseUrl}/${contentType}`);
  if (filterSlug) {
    apiUrl.searchParams.set('filters[Slug][$eq]', filterSlug);
  }
  if (contentType === FEATURE_CARDS) {
    apiUrl.searchParams.set('populate[0]', 'BackgroundImageLight');
    apiUrl.searchParams.set('populate[1]', 'BackgroundImageDark');
  }

  if (contentType === BLOG) {
    apiUrl.searchParams.set('populate[0]', 'Image');
    apiUrl.searchParams.set('populate[1]', 'tags');
  }

  import.meta.env.MODE !== 'production' &&
    apiUrl.searchParams.set('publicationState', 'preview');
  const apiAccesToken =
    import.meta.env.VITE_STRAPI_DEVELOP === 'true'
      ? import.meta.env.VITE_LOCAL_STRAPI_API_TOKEN
      : import.meta.env.VITE_STRAPI_API_TOKEN;
  const { data, isSuccess } = useQuery({
    queryKey: ['featureCard'],

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
    data: data ?? undefined,
    url: apiUrl,
    isSuccess,
  };
};
