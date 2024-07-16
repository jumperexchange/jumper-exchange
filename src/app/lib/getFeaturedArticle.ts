import type { BlogArticleData } from 'src/types/strapi';
import { strapi } from 'src/utils/strapi/StrapiInitSDK';
import type { StrapiResponse } from 'strapi-sdk-js';
// interface BlogArticleResponse extends StrapiResponse<BlogArticleData[]> {
//   url: string;
// }

export async function getFeaturedArticle() {
  const res: StrapiResponse<BlogArticleData[]> = await strapi.find(
    'blog-articles',
    {
      filters: { featured: true },
      populate: ['Image', 'tags', 'author.Avatar', 'faq_items'],
      publicationState:
        process.env.NEXT_PUBLIC_ENVIRONMENT === 'development'
          ? 'preview'
          : 'live',
    },
  );

  if (!res) {
    throw new Error('Failed to fetch data');
  }

  return {
    data: res.data,
    meta: res.meta,
    url: 'https://strapi.li.finance',
  }; // Return a plain object
}
