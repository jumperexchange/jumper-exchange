import { AnnouncementStrapiApi } from '@/utils/strapi/StrapiApi';
import type { StrapiResponse } from '@/types/strapi';
import type { AnnouncementData } from '@/types/announcement';

export async function getAnnouncements() {
  const urlParams = new AnnouncementStrapiApi().sort('desc');
  const apiUrl = urlParams.getApiUrl();

  const res = await fetch(decodeURIComponent(apiUrl), {
    next: {
      revalidate: 60 * 10,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch announcements');
  }

  const data: StrapiResponse<AnnouncementData> = await res.json();

  return data;
}
