import { getSiteUrl } from '@/const/urls';
import type { MetadataRoute } from 'next';
import { getCampaigns } from 'src/app/lib/getCampaigns';
import { slugify } from 'src/utils/validation-schemas';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await getCampaigns();
  return data.map((campaign) => ({
    url: `${getSiteUrl()}/campaign/${slugify(campaign.Slug)}`,
    lastModified: new Date().toISOString().split('T')[0],
    priority: 0.8,
  }));
}
