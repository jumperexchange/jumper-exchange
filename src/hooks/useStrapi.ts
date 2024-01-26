import { useQuery } from '@tanstack/react-query';
import { STRAPI_BLOG_ARTICLES, STRAPI_FEATURE_CARDS } from 'src/const';
import type { StrapiMeta, StrapiResponseData } from 'src/types';

export interface UseStrapiProps<T> {
  data: StrapiResponseData<T>;
  meta: StrapiMeta;
  url: URL;
  isSuccess: boolean;
}

interface PaginationProps {
  page: number;
  pageSize: number;
  withCount?: boolean;
}
interface ContentTypeProps {
  contentType: 'feature-cards' | 'blog-articles' | 'faq-items' | 'tags';
  filterSlug?: string;
  filterTag?: number;
  sort?: 'desc' | 'asc';
  pagination?: PaginationProps;
  filterDisplayed?: boolean;
  queryKey: string | string[] | number;
}

// Query passed Content-Type var from Strapi
export const useStrapi = <T>({
  contentType,
  filterSlug,
  sort,
  filterTag,
  pagination,
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
  if (filterTag) {
    apiUrl.searchParams.set('filters[tags][id][$eq]', `${filterTag}`);
  }
  if (sort) {
    switch (sort) {
      case 'asc':
        apiUrl.searchParams.set('sort', 'createdAt:ASC');
        break;
      case 'desc':
        apiUrl.searchParams.set('sort', 'createdAt:DESC');
        break;
    }
  }
  if (pagination) {
    apiUrl.searchParams.set('pagination[page]', `${pagination.page}`);
    apiUrl.searchParams.set('pagination[pageSize]', `${pagination.pageSize}`);
    apiUrl.searchParams.set(
      'pagination[withCount]',
      pagination.withCount === false ? 'false' : 'true',
    );
  }
  if (filterDisplayed) {
    apiUrl.searchParams.set('filters[displayOnBlogPage][$eq]', 'true');
  }
  if (contentType === STRAPI_FEATURE_CARDS) {
    apiUrl.searchParams.set('populate[0]', 'BackgroundImageLight');
    apiUrl.searchParams.set('populate[1]', 'BackgroundImageDark');
  }

  if (contentType === STRAPI_BLOG_ARTICLES) {
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
      return result;
    },
    enabled: true,
    refetchInterval: 1000 * 60 * 60,
  });

  return {
    data: data?.data ?? undefined,
    meta: data?.meta ?? undefined,
    url: apiUrl,
    isSuccess,
  };
};
