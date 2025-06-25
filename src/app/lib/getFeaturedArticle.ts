import { ArticleStrapiApi } from '@/utils/strapi/StrapiApi';
import { BlogArticleData, StrapiResponse } from 'src/types/strapi';
import { getStrapiApiAccessToken } from 'src/utils/strapi/strapiHelper';

export async function getFeaturedArticle(): Promise<
  StrapiResponse<BlogArticleData>
> {
  const urlParams = new ArticleStrapiApi({
    excludeFields: ['Content'],
  })
    .sort('desc')
    .filterByFeatured();
  const apiUrl = urlParams.getApiUrl();
  const accessToken = getStrapiApiAccessToken();
  try {
    const res = await fetch(decodeURIComponent(apiUrl), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      next: {
        revalidate: 60 * 5, // revalidate every 5 minutes
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await res.json();

    return data;
  } catch (e) {
    console.error(`Error fetching featured article from ${apiUrl}:`, e);

    throw new Error((e as Error).message);
  }
}
