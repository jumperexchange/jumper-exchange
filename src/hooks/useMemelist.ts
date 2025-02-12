'use client';
import { useQuery } from '@tanstack/react-query';
import type { StrapiTokenInfo } from 'src/types/tokenList';

export interface UseMemelistProps {
  tokens?: StrapiTokenInfo[];
  isSuccess: boolean;
}

export interface UseMemeProps {
  enabled: boolean;
}

const STRAPI_CONTENT_TYPE = 'token-lists';
export const useMemelist = ({ enabled }: UseMemeProps): UseMemelistProps => {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_STRAPI_DEVELOP === 'true'
      ? process.env.NEXT_PUBLIC_LOCAL_STRAPI_URL
      : `${process.env.NEXT_PUBLIC_STRAPI_URL}/api`;
  const apiUrl = new URL(`${apiBaseUrl}/${STRAPI_CONTENT_TYPE}`);
  //filter url
  apiUrl.searchParams.set('filters[uid][$eq]', 'memecoins');
  process.env.NEXT_PUBLIC_ENVIRONMENT !== 'production' &&
    apiUrl.searchParams.set('status', 'draft');
  const apiAccesToken =
    process.env.NEXT_PUBLIC_STRAPI_DEVELOP === 'true'
      ? process.env.NEXT_PUBLIC_LOCAL_STRAPI_API_TOKEN
      : process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const { data, isSuccess } = useQuery({
    queryKey: ['memelist'],
    queryFn: async () => {
      const response = await fetch(decodeURIComponent(apiUrl.href), {
        headers: {
          'Strapi-Response-Format': 'v4',
          Authorization: `Bearer ${apiAccesToken}`,
        },
      });
      const result = await response.json();
      return result.data;
    },
    refetchInterval: 1000 * 60 * 60,
    enabled: enabled,
  });

  const tokenList = data?.[0].attributes?.['DATA'] || {};
  return {
    tokens: tokenList,
    isSuccess,
  };
};
