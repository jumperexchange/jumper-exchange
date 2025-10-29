import { AnnouncementStrapiApi } from '@/utils/strapi/StrapiApi';
import type { StrapiResponse } from '@/types/strapi';
import type { AnnouncementData } from '@/types/announcement';
import { getStrapiApiAccessToken } from '@/utils/strapi/strapiHelper';

export async function getAnnouncements() {
  const urlParams = new AnnouncementStrapiApi().sort('desc');
  const apiUrl = urlParams.getApiUrl();
  const accessToken = getStrapiApiAccessToken();

  const res = await fetch(decodeURIComponent(apiUrl), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
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
