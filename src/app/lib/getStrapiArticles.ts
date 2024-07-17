import type { BlogArticleData } from 'src/types/strapi';
import { strapi } from 'src/utils/strapi/StrapiInitSDK';
import type { StrapiResponse } from 'strapi-sdk-js';

// export interface GetArticlesResponse extends StrapiResponse<BlogArticleData[]> {
//   url: string; // Define the shape of the URL
// }

export async function getStrapiArticles(excludeId?: number) {
  // const res = await strapi.find('blog-articles', { filters: { slug } });
  const res: StrapiResponse<BlogArticleData[]> = await strapi.find(
    'blog-articles',
    {
      ...(excludeId && { filters: { id: { $ne: excludeId } } }),
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

  return {
    data: res.data,
    meta: res.meta,
    url: 'https://strapi.li.finance' as string,
  }; // Return a plain object
}
