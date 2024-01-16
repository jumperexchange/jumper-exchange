import { useQuery } from '@tanstack/react-query';
import { BLOG_ARTICLES, FEATURE_CARDS } from 'src/const';
import type { StrapiResponseData } from 'src/types';

export interface UseStrapiProps<T> {
  data: StrapiResponseData<T>;
  url: URL;
  isSuccess: boolean;
}
interface ContentTypeProps {
  contentType: 'feature-cards' | 'blog-articles' | 'faq-items';
  filterSlug?: string;
  filterDisplayed?: boolean;
  queryKey: string | string[] | number;
}

// Query passed Content-Type var from Strapi
export const useStrapi = <T>({
  contentType,
  filterSlug,
  filterDisplayed,
  queryKey,
}: ContentTypeProps): UseStrapiProps<T> => {
  const apiBaseUrl =
    import.meta.env.VITE_STRAPI_DEVELOP === 'true'
      ? import.meta.env.VITE_LOCAL_STRAPI_URL
      : import.meta.env.VITE_STRAPI_URL;
  const apiUrl = new URL(`${apiBaseUrl}/${contentType}`);
  if (filterSlug) {
    apiUrl.searchParams.set('filters[Slug][$eq]', filterSlug);
  }
  if (filterDisplayed) {
    apiUrl.searchParams.set('filters[displayOnBlogPage][$eq]', 'true');
  }
  if (contentType === FEATURE_CARDS) {
    apiUrl.searchParams.set('populate[0]', 'BackgroundImageLight');
    apiUrl.searchParams.set('populate[1]', 'BackgroundImageDark');
  }

  if (contentType === BLOG_ARTICLES) {
    apiUrl.searchParams.set('populate[0]', 'Image');
    apiUrl.searchParams.set('populate[1]', 'tags');
    apiUrl.searchParams.set('populate[2]', 'author.Avatar');
    apiUrl.searchParams.set('populate[3]', 'faq_items');
  }
  // if (contentType === FAQ_ITEMS) {
  //   apiUrl.searchParams.set('populate[0]', 'faqItems');
  // }

  import.meta.env.MODE !== 'production' &&
    apiUrl.searchParams.set('publicationState', 'preview');
  const apiAccesToken =
    import.meta.env.VITE_STRAPI_DEVELOP === 'true'
      ? import.meta.env.VITE_LOCAL_STRAPI_API_TOKEN
      : import.meta.env.VITE_STRAPI_API_TOKEN;
  const { data, isSuccess } = useQuery({
    queryKey: [queryKey],

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
