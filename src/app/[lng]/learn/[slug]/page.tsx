import type { BlogArticleData } from '@/types/strapi';
import { getArticleBySlug } from 'src/app/lib/getArticleBySlug';
import { getArticlesByTag } from 'src/app/lib/getArticlesByTag';

import LearnArticlePage from 'src/app/ui/learn/LearnArticlePage';

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
