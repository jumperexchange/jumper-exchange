import type { BlogArticleData, StrapiMeta } from 'src/types/strapi';
import { strapi } from 'src/utils/strapi/StrapiInitSDK';
import type { StrapiResponse } from 'strapi-sdk-js';

export async function getArticlesByTag(
  excludeId: number,
  tag: number | number[],
) {
  const res: StrapiResponse<BlogArticleData[]> = await strapi.find(
    'blog-articles',
    {
      filters: { id: { $ne: excludeId }, tags: { id: { $eq: tag } } },
      populate: ['Image', 'tags', 'author.Avatar', 'faq_items'],
      publicationState:
        process.env.NEXT_PUBLIC_ENVIRONMENT === 'development'
          ? 'preview'
          : 'live',
    },
  );

  // const urlParams = new ArticleStrapiApi().filterByTag(tag);
  // const apiBaseUrl = urlParams.getApiBaseUrl();
  // const apiUrl = urlParams.getApiUrl();
  // const accessToken = urlParams.getApiAccessToken();
  // const res = await fetch(decodeURIComponent(apiUrl), {
  //   cache: 'force-cache',
  //   headers: {
  //     Authorization: `Bearer ${accessToken}`,
  //   },
  // });

  // if (!res.ok) {
  //   throw new Error('Failed to fetch data');
  // }

  // const data = await res.json().then((output) =>
  //   // exclude current article id
  //   output.data.filter((el: BlogArticleData) => el.id !== excludeId),
  // ); // Extract data from the response

  return {
    data: res.data,
    meta: res.meta as unknown as StrapiMeta,
    url: 'https://strapi.li.finance' as string,
  }; // Return a plain object
}
