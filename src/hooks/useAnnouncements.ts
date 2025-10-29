import type {
  AnnouncementData,
  AnnouncementDisplay,
} from '@/types/announcement';
import { useQuery } from '@tanstack/react-query';
import { getAnnouncements } from '@/app/lib/getAnnouncements';
import { useAnnouncementStore } from '@/stores/announcements/AnnouncementStore';
import { useEffect, useMemo } from 'react';
import { getStrapiBaseUrl } from 'src/utils/strapi/strapiHelper';
import { TEN_MINUTES_MS, THIRTY_MINUTES_MS } from 'src/const/time';

interface UseAnnouncementsProps {
  data: AnnouncementData[];
  activeAnnouncements: AnnouncementDisplay[];
  isSuccess: boolean;
  isLoading: boolean;
  isFetching: boolean;
}

const mapToDisplayFormat = (
  announcement: AnnouncementData,
): AnnouncementDisplay => {
  const baseStrapiUrl = getStrapiBaseUrl();
  return {
    id: announcement.id,
    documentId: announcement.documentId,
    content: announcement.Content,
    severity: announcement.Severity,
    priority: announcement.Priority,
    startDate: announcement.StartDate,
    endDate: announcement.EndDate,
    logo: announcement.Logo
      ? {
          ...announcement.Logo,
          url: `${baseStrapiUrl}${announcement.Logo?.url}`,
        }
      : undefined,
    dismissible: announcement.Dismissible,
    createdAt: announcement.createdAt,
    updatedAt: announcement.updatedAt,
    publishedAt: announcement.publishedAt,
  };
};

export const useAnnouncements = (): UseAnnouncementsProps => {
  const { dismissedAnnouncements, setLastFetchDate } = useAnnouncementStore(
    (state) => ({
      dismissedAnnouncements: state.dismissedAnnouncements,
      setLastFetchDate: state.setLastFetchDate,
    }),
  );

  const { data, dataUpdatedAt, isSuccess, isLoading, isFetching } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const result = await getAnnouncements();
      return result.data;
    },
    refetchInterval: TEN_MINUTES_MS,
    staleTime: THIRTY_MINUTES_MS,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const activeAnnouncements = useMemo(() => {
    if (!data) return [];

    return data
      .filter(
        (announcement) =>
          !dismissedAnnouncements.includes(announcement.documentId),
      )
      .map(mapToDisplayFormat);
  }, [data, dismissedAnnouncements]);

  useEffect(() => {
    if (dataUpdatedAt) {
      setLastFetchDate(dataUpdatedAt);
    }
  }, [dataUpdatedAt]);

  return {
    data: data || [],
    activeAnnouncements,
    isSuccess,
    isLoading,
    isFetching,
  };
};
