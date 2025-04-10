import type { CampaignData } from '@/types/strapi';
import { useQuery } from '@tanstack/react-query';

export interface UseCampaignsProps {
  campaigns: CampaignData[] | undefined;
  url: URL;
  isSuccess: boolean;
  isLoading: boolean;
}

const STRAPI_CONTENT_TYPE = 'campaigns';

export const useCampaigns = (
  showProfileBanner?: boolean,
): UseCampaignsProps => {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_STRAPI_DEVELOP === 'true'
      ? process.env.NEXT_PUBLIC_LOCAL_STRAPI_URL
      : `${process.env.NEXT_PUBLIC_STRAPI_URL}`;
  const apiUrl = new URL(`${apiBaseUrl}/api/${STRAPI_CONTENT_TYPE}`);

  // Selected needed fields
  apiUrl.searchParams.set('fields[0]', 'Title');
  apiUrl.searchParams.set('fields[1]', 'Description');
  apiUrl.searchParams.set('fields[2]', 'BenefitLabel');
  apiUrl.searchParams.set('fields[3]', 'BenefitValue');
  apiUrl.searchParams.set('fields[4]', 'InfoUrl');
  apiUrl.searchParams.set('fields[5]', 'Slug');
  apiUrl.searchParams.set('fields[6]', 'ShowProfileBanner');

  // Populate relations and media
  apiUrl.searchParams.set('populate[0]', 'quests');
  apiUrl.searchParams.set('populate[1]', 'Background');
  apiUrl.searchParams.set('populate[2]', 'Icon');
  apiUrl.searchParams.set('populate[3]', 'ProfileBannerImage');

  // Sort by most recent
  apiUrl.searchParams.set('sort[0]', 'createdAt:desc');

  // Pagination
  apiUrl.searchParams.set('pagination[pageSize]', '50');

  // Filter by ShowProfileBanner if specified
  if (showProfileBanner) {
    apiUrl.searchParams.set('filters[ShowProfileBanner][$eq]', 'true');
  }

  // Show drafts in non-production environments
  process.env.NEXT_PUBLIC_ENVIRONMENT !== 'production' &&
    apiUrl.searchParams.set('status', 'draft');

  const apiAccessToken =
    process.env.NEXT_PUBLIC_STRAPI_DEVELOP === 'true'
      ? process.env.NEXT_PUBLIC_LOCAL_STRAPI_API_TOKEN
      : process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['campaigns', showProfileBanner],
    queryFn: async () => {
      const response = await fetch(decodeURIComponent(apiUrl.href), {
        headers: {
          Authorization: `Bearer ${apiAccessToken}`,
        },
      });
      const result = await response.json();
      return result.data;
    },
    refetchInterval: 1000 * 60 * 60, // Refetch every hour
  });

  return {
    campaigns: data,
    isLoading,
    url: apiUrl,
    isSuccess,
  };
};
