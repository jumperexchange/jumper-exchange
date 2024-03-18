import { ArticleStrapiApi } from '@/utils/strapi/StrapiApi';
import { LearnPage } from 'src/app/ui/learn/LearnPage';

async function getCarouselArticles() {
  const urlParams = new ArticleStrapiApi().sort('desc');
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

async function getFeaturedArticle() {
  const urlParams = new ArticleStrapiApi().sort('desc').filterByFeatured();
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

// `app/ui/learn/page.tsx` is the UI for the `/learn` URL
export default async function Page({
  params: { lng },
}: {
  params: {
    lng: string;
  };
}) {
  console.log('params', lng);
  const carouselArticles = await getCarouselArticles();
  const featuredArticle = await getFeaturedArticle();

  return (
    <LearnPage
      carouselArticles={carouselArticles.data}
      featuredArticle={featuredArticle.data}
      url={carouselArticles.url}
    />
  );
}
