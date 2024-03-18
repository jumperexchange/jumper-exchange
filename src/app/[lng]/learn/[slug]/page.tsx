import type { BlogArticleData } from '@/types/strapi';
import { ArticleStrapiApi } from '@/utils/strapi/StrapiApi';
import { LearnArticlePage } from 'src/app/ui/learn/LearnArticlePage';

async function getArticle(slug: string) {
  const urlParams = new ArticleStrapiApi().filterBySlug(slug);
  const apiBaseUrl = urlParams.getApiBaseUrl();
  const apiUrl = urlParams.getApiUrl();
  const accessToken = urlParams.getApiAccessToken();
  const res = await fetch(decodeURIComponent(apiUrl), {
    cache: 'force-cache',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  const data = await res.json(); // Extract data from the response

  return { data, url: apiBaseUrl }; // Return a plain object
}

async function getArticles(tag: number | number[]) {
  const urlParams = new ArticleStrapiApi().filterByTag(tag);
  const apiBaseUrl = urlParams.getApiBaseUrl();
  const apiUrl = urlParams.getApiUrl();
  const accessToken = urlParams.getApiAccessToken();
  const res = await fetch(decodeURIComponent(apiUrl), {
    cache: 'force-cache',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  const data = await res.json(); // Extract data from the response

  return { data, url: apiBaseUrl }; // Return a plain object
}

export default async function Page({ params }: { params: { slug: string } }) {
  console.log('SLUG', params);
  const article = await getArticle(params.slug);

  const currentTags = (
    article.data as BlogArticleData
  ).attributes.tags.data.map((el) => el?.id);

  const relatedArticles = await getArticles(currentTags);

  return (
    <>
      <LearnArticlePage
        article={article.data.data}
        url={article.url}
        articles={relatedArticles.data}
      />
    </>
  );
}
