import { getArticleBySlug } from '@/app/lib/getArticleBySlug';
import { getArticlesByTag } from '@/app/lib/getArticlesByTag';
import LearnArticlePage from '@/app/ui/learn/LearnArticlePage';
import type { BlogArticleAttributes, BlogArticleData } from '@/types/strapi';
import { getCookies } from '@/app/lib/getCookies';
import { Metadata } from 'next';
import { sliceStrToXChar } from 'src/utils/splitStringToXChar';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const article = await getArticleBySlug(params.slug);

    if (!article.data || !article.data.data?.[0]) {
      throw new Error();
    }

    const articleData = article.data.data?.[0]
      .attributes as BlogArticleAttributes;

    return {
      title: `Jumper Learn | ${sliceStrToXChar(articleData.Title, 45)}`,
      description: articleData.Subtitle,
    };
  } catch (err) {
    return {
      title: `Jumper Learn | ${sliceStrToXChar(params.slug.replaceAll('-', ' '), 45)}`,
      description: `This is the description for the article "${params.slug.replaceAll('-', ' ')}".`,
    };
  }
}

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
