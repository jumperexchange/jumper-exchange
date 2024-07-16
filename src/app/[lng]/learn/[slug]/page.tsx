import { getArticleBySlug } from '@/app/lib/getArticleBySlug';
import { getCookies } from '@/app/lib/getCookies';
import type { Metadata } from 'next';
import { getArticlesByTag } from 'src/app/lib/getArticlesByTag';
import LearnArticlePage from 'src/app/ui/learn/LearnArticlePage';
import { sliceStrToXChar } from 'src/utils/splitStringToXChar';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const article = await getArticleBySlug(params.slug);
    if (!article.data) {
      throw new Error();
    }

    const articleData = article.data[0].attributes;

    const openGraph: Metadata['openGraph'] = {
      title: `Jumper Learn | ${sliceStrToXChar(articleData.Title, 45)}`,
      description: `${sliceStrToXChar(articleData.Subtitle, 60)}`,
      images: [
        {
          url: `${article.url}${articleData.Image.data.attributes?.url}`,
          width: 900,
          height: 450,
          alt: 'banner image',
        },
      ],
      type: 'article',
    };

    return {
      title: `Jumper Learn | ${sliceStrToXChar(articleData.Title, 45)}`,
      description: articleData.Subtitle,
      twitter: openGraph,
      openGraph,
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
  const currentTags = article.data[0].attributes?.tags.data.map(
    (tag) => tag?.id,
  );
  const relatedArticles = await getArticlesByTag(
    article.data[0]?.id,
    currentTags,
  );

  return (
    <LearnArticlePage
      article={article.data}
      url={article.url}
      articles={relatedArticles.data}
      activeTheme={activeTheme}
    />
  );
}
