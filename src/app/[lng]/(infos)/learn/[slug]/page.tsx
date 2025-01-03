import { getArticles } from '@/app/lib/getArticles';
import { siteName } from '@/app/lib/metadata';
import LearnArticlePage from '@/app/ui/learn/LearnArticlePage';
import type { BlogArticleAttributes, BlogArticleData } from '@/types/strapi';
import { sliceStrToXChar } from '@/utils/splitStringToXChar';
import type { Metadata } from 'next';
import { getArticleBySlug } from '../../../../lib/getArticleBySlug';
import { getArticlesByTag } from '../../../../lib/getArticlesByTag';
import { getCookies } from '../../../../lib/getCookies';
import { getSiteUrl } from '@/const/urls';

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

    const openGraph: Metadata['openGraph'] = {
      title: `Jumper Learn | ${sliceStrToXChar(articleData.Title, 45)}`,
      description: `${sliceStrToXChar(articleData.Subtitle, 60)}`,
      siteName: siteName,
      url: `${getSiteUrl()}/learn/${params.slug}`,
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
      alternates: {
        canonical: `${getSiteUrl()}/learn/${params.slug}`,
      },
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
  const { activeThemeMode } = getCookies();

  const currentTags = (
    article?.data?.data[0] as BlogArticleData
  )?.attributes?.tags.data.map((el) => el?.id);
  const relatedArticles = await getArticlesByTag(
    article?.data?.data[0]?.id,
    currentTags,
  );

  return (
    <LearnArticlePage
      article={article.data.data}
      url={article.url}
      articles={relatedArticles.data}
      activeThemeMode={activeThemeMode}
    />
  );
}

export async function generateStaticParams() {
  const articles = await getArticles();

  const data = articles.data.map((article) => ({
    slug: article.attributes.Slug,
  }));

  return data;
}
