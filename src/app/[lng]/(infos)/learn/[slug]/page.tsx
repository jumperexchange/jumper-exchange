import { getArticles } from '@/app/lib/getArticles';
import { siteName } from '@/app/lib/metadata';
import LearnArticlePage from '@/app/ui/learn/LearnArticlePage';
import { getSiteUrl } from '@/const/urls';
import type { BlogArticleAttributes, BlogArticleData } from '@/types/strapi';
import { sliceStrToXChar } from '@/utils/splitStringToXChar';
import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { getArticleBySlug } from '../../../../lib/getArticleBySlug';
import { getArticlesByTag } from '../../../../lib/getArticlesByTag';
import { getCookies } from '../../../../lib/getCookies';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = await getArticleBySlug(slug);

    if (!article.data || !article.data.data?.[0]) {
      throw new Error();
    }

    const articleData: BlogArticleAttributes = article.data.data?.[0];

    const openGraph: Metadata['openGraph'] = {
      title: `Jumper Learn | ${sliceStrToXChar(articleData.Title, 45)}`,
      description: `${sliceStrToXChar(articleData.Subtitle, 60)}`,
      siteName: siteName,
      url: `${getSiteUrl()}/learn/${slug}`,
      images: [
        {
          url: `${article.url}${articleData.Image?.url}`,
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
        canonical: `${getSiteUrl()}/learn/${slug}`,
      },
      twitter: openGraph,
      openGraph,
    };
  } catch (err) {
    return {
      title: `Jumper Learn | ${sliceStrToXChar(slug.replaceAll('-', ' '), 45)}`,
      description: `This is the description for the article "${slug.replaceAll('-', ' ')}".`,
    };
  }
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;

  const article = await getArticleBySlug(slug);
  const { activeThemeMode } = await getCookies();

  const articleData: BlogArticleData = article.data.data?.[0];

  if (!articleData) {
    return notFound();
  }

  if (articleData?.RedirectURL) {
    return permanentRedirect(articleData?.RedirectURL);
  }

  const currentTags = articleData?.tags.map((el) => el?.id);
  const relatedArticles = await getArticlesByTag(articleData.id, currentTags);
  return (
    <LearnArticlePage
      article={articleData}
      url={article.url}
      articles={relatedArticles.data}
      activeThemeMode={activeThemeMode}
    />
  );
}

export async function generateStaticParams() {
  const articles = await getArticles();

  const data = articles.data.map((article) => ({
    slug: article?.Slug,
  }));

  return data;
}
