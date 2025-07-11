'use client';
import { useQuery } from '@tanstack/react-query';
import type { StrapiTokenInfo } from 'src/types/tokenList';
import {
  getStrapiApiAccessToken,
  getStrapiBaseUrl,
} from 'src/utils/strapi/strapiHelper';
import config from '@/config/env-config';

export interface UseMemelistProps {
  tokens?: StrapiTokenInfo[];
  isSuccess: boolean;
}

export interface UseMemeProps {
  enabled: boolean;
}

const STRAPI_CONTENT_TYPE = 'token-lists';
export const useMemelist = ({ enabled }: UseMemeProps): UseMemelistProps => {
  const apiBaseUrl = getStrapiBaseUrl();
  const apiUrl = new URL(`${apiBaseUrl}/api/${STRAPI_CONTENT_TYPE}`);
  //filter url
  apiUrl.searchParams.set('filters[uid][$eq]', 'memecoins');
  config.NEXT_PUBLIC_ENVIRONMENT !== 'production' &&
    apiUrl.searchParams.set('status', 'draft');
  const apiAccesToken = getStrapiApiAccessToken();
  const { data, isSuccess } = useQuery({
    queryKey: ['memelist'],
    queryFn: async () => {
      const response = await fetch(decodeURIComponent(apiUrl.href), {
        headers: {
          Authorization: `Bearer ${apiAccesToken}`,
        },
      });
      const result = await response.json();
      return result.data;
    },
    refetchInterval: 1000 * 60 * 60,
    enabled: enabled,
  });

  const tokenList = data?.[0]?.['DATA'] || {};
  return {
    tokens: tokenList,
    isSuccess,
  };
};
