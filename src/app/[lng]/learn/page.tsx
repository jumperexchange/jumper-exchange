import { getCarouselArticles } from 'src/app/lib/getArticles';
import { getFeaturedArticle } from 'src/app/lib/getFeaturedArticle';
import { LearnPage } from 'src/app/ui/learn/LearnPage';

// `app/ui/learn/page.tsx` is the UI for the `/learn` URL
export default async function Page({
  params: { lng },
}: {
  params: {
    lng: string;
  };
}) {
  const featuredArticle = await getFeaturedArticle();
  const carouselArticles = await getCarouselArticles(featuredArticle.data.id);

  return (
    <LearnPage
      carouselArticles={carouselArticles.data}
      featuredArticle={featuredArticle.data}
      url={carouselArticles.url}
    />
  );
}
