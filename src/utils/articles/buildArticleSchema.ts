import { getSiteUrl } from '@/const/urls';
import type { BlogArticleData } from '@/types/strapi';
import { getStrapiBaseUrl } from '../strapi/strapiHelper';

export function buildArticleSchema(articleData: BlogArticleData) {
  const baseUrl = getStrapiBaseUrl();
  const pageUrl = `${getSiteUrl()}/learn/${articleData.Slug}`;
  const imageUrl = articleData.Image?.url
    ? `${baseUrl}${articleData.Image.url}`
    : undefined;

  return (
    articleData.seo?.structuredData ?? {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: articleData.Title,
      image: imageUrl,
      datePublished: articleData.publishedAt ?? articleData.createdAt,
      dateModified: articleData.updatedAt ?? articleData.createdAt,
      url: pageUrl,
      author: {
        '@type': articleData.author?.Name ? 'Person' : 'Organization',
        name: articleData.author?.Name ?? 'Jumper',
        url: articleData.author?.Name ? undefined : getSiteUrl(),
      },
      publisher: {
        '@type': 'Organization',
        name: 'Jumper',
        url: getSiteUrl(),
        logo: {
          '@type': 'ImageObject',
          url: `${getSiteUrl()}/logo-512x512.png`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': pageUrl,
      },
    }
  );
}
