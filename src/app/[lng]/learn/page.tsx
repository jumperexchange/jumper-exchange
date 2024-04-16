import { getArticles } from '@/app/lib/getArticles';
import { getFeaturedArticle } from '@/app/lib/getFeaturedArticle';
import LearnPage from '@/app/ui/learn/LearnPage';

// `app/ui/learn/page.tsx` is the UI for the `/learn` URL
export default async function Page() {
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
