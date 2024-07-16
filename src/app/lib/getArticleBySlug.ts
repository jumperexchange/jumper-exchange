import type { BlogArticleData, StrapiMeta } from 'src/types/strapi';
import { strapi } from 'src/utils/strapi/StrapiInitSDK';
import type { StrapiResponse } from 'strapi-sdk-js';

export async function getArticleBySlug(slug: string) {
  // const res = await strapi.find('blog-articles', { filters: { slug } });
  const res: StrapiResponse<BlogArticleData[]> = await strapi.find(
    'blog-articles',
    {
      filters: { Slug: slug },
      populate: ['Image', 'tags', 'author.Avatar', 'faq_items'],
      publicationState:
        process.env.NEXT_PUBLIC_ENVIRONMENT === 'development'
          ? 'preview'
          : 'live',
    },
  );
  // const urlParams = new ArticleStrapiApi().filterBySlug(slug);
  // const apiBaseUrl = urlParams.getApiBaseUrl();
  // const apiUrl = urlParams.getApiUrl();
  // const accessToken = urlParams.getApiAccessToken();
  // const res = await fetch(decodeURIComponent(apiUrl), {
  //   cache: 'force-cache',
  //   headers: {
  //     Authorization: `Bearer ${accessToken}`,
  //   },
  // });

  if (!res) {
    throw new Error('Failed to fetch data');
  }

  // const data = await res.json(); // Extract data from the response

  return {
    data: res.data as unknown as BlogArticleData[],
    meta: res.meta as unknown as StrapiMeta,
    url: 'https://strapi.li.finance' as string,
  }; // Return a plain object
}
