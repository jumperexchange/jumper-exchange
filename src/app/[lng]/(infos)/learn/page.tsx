'use server';
import { getArticles } from '@/app/lib/getArticles';
import { getFeaturedArticle } from '@/app/lib/getFeaturedArticle';
import LearnPage from '@/app/ui/learn/LearnPage';
import type { Metadata } from 'next';
import { getTags } from 'src/app/lib/getTags';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Jumper Learn',
    description: 'Jumper Learn is the blog of Jumper Exchange.',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/learn/`,
    },
  };
}

// `app/ui/learn/page.tsx` is the UI for the `/learn` URL
export default async function Page() {
  // TODO: make this component client side by removing async, a hook should do the job, will permit us to pre-render the pages
  const featuredArticle = await getFeaturedArticle();
  const carouselArticles = await getArticles(featuredArticle.data.id, 5);
  const tags = await getTags();

  return (
    <LearnPage
      tags={tags}
      carouselArticles={carouselArticles}
      featuredArticle={featuredArticle.data}
      url={carouselArticles.url}
    />
  );
}
