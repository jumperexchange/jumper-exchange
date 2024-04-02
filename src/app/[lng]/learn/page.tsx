import dynamic from 'next/dynamic';
import { generateMetadata } from 'src/app/lib/generateMetadata';
import { getArticles } from 'src/app/lib/getArticles';
import { getFeaturedArticle } from 'src/app/lib/getFeaturedArticle';

const LearnPage = dynamic(() => import('../../ui/learn/LearnPage'), {
  ssr: false,
});

// `app/ui/learn/page.tsx` is the UI for the `/learn` URL
export default async function Page({
  params: { lng },
}: {
  params: {
    lng: string;
  };
}) {
  generateMetadata();
  const featuredArticle = await getFeaturedArticle();
  const carouselArticles = await getArticles(featuredArticle.data.id);
  return (
    <LearnPage
      carouselArticles={carouselArticles}
      featuredArticle={featuredArticle.data}
      url={carouselArticles.url}
    />
  );
}
