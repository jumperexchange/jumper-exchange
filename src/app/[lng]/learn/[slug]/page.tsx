import { LearnArticlePage } from 'src/app/ui/learn/LearnArticlePage';
import { ArticleStrapiApi } from 'src/utils/strapi/StrapiApi';

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

export default async function Page({ params }: { params: { slug: string } }) {
  console.log('SLUG', params);
  const article = await getArticle(params.slug);

  return (
    <>
      <LearnArticlePage article={article.data.data} url={article.url} />
    </>
  );
}
