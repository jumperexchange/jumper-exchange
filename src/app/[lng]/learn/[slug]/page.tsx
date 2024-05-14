import { getArticleBySlug } from '@/app/lib/getArticleBySlug';
import { getArticlesByTag } from '@/app/lib/getArticlesByTag';
import LearnArticlePage from '@/app/ui/learn/LearnArticlePage';
import type { BlogArticleData } from '@/types/strapi';
import { getCookies } from '@/app/lib/getCookies';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);
  const { activeTheme } = getCookies();

  const currentTags = (
    article.data as BlogArticleData
  ).attributes?.tags.data.map((el) => el?.id);

  const relatedArticles = await getArticlesByTag(
    article.data[0]?.id,
    currentTags,
  );

  return (
    <LearnArticlePage
      article={article.data.data}
      url={article.url}
      articles={relatedArticles.data}
      activeTheme={activeTheme}
    />
  );
}
