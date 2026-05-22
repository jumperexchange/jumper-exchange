import { getSiteUrl } from '@/const/urls';
import type { BlogArticleData } from '@/types/strapi';
import { resolveStrapiMediaUrl } from '../strapi/strapiHelper';

export function buildArticleSchema(articleData: BlogArticleData) {
  const pageUrl = `${getSiteUrl()}/learn/${articleData.Slug}`;
  const imageUrl = resolveStrapiMediaUrl(articleData.Image?.url);

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
