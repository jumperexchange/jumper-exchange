import { getArticleBySlug } from '@/app/lib/getArticleBySlug';
import { getArticlesByTag } from '@/app/lib/getArticlesByTag';
import LearnArticlePage from '@/app/ui/learn/LearnArticlePage';
import type { BlogArticleData } from '@/types/strapi';

export default async function Page({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);

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
    />
  );
}
