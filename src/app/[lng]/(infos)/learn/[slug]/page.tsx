import { getArticles } from '@/app/lib/getArticles';
import { siteName } from '@/app/lib/metadata';
import LearnArticlePage from '@/app/ui/learn/LearnArticlePage';
import { getSiteUrl } from '@/const/urls';
import type { BlogArticleAttributes, BlogArticleData } from '@/types/strapi';
import { sliceStrToXChar } from '@/utils/splitStringToXChar';
import { learnSlugSchema } from '@/utils/validation-schemas';
import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { getStrapiBaseUrl } from 'src/utils/strapi/strapiHelper';
import { getArticleBySlug } from '../../../../lib/getArticleBySlug';
import { getArticlesByTag } from '../../../../lib/getArticlesByTag';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;

  // Validate learn page slug
  const result = learnSlugSchema.safeParse(slug);
  if (!result.success) {
    return {
      title: 'Learn',
      description: 'Learn about blockchain and crypto on Jumper Exchange.',
      alternates: {
        canonical: `${getSiteUrl()}/learn`,
      },
    };
  }

  const validatedSlug = result.data;
  const article = await getArticleBySlug(validatedSlug);

  if (!article.data || !article.data.data?.[0]) {
    return {
      title: 'Learn',
      description: 'Learn about blockchain and crypto on Jumper Exchange.',
      alternates: {
        canonical: `${getSiteUrl()}/learn`,
      },
    };
  }

  const articleData: BlogArticleAttributes = article.data.data?.[0];

  const openGraph: Metadata['openGraph'] = {
    title: `Jumper Learn | ${sliceStrToXChar(articleData.Title, 45)}`,
    description: `${sliceStrToXChar(articleData.Subtitle, 60)}`,
    siteName: siteName,
    url: `${getSiteUrl()}/learn/${validatedSlug}`,
    images: [
      {
        url: `${getStrapiBaseUrl()}${articleData.Image?.url}`,
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
      canonical: `${getSiteUrl()}/learn/${validatedSlug}`,
    },
    twitter: openGraph,
    openGraph,
  };
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;

  // Validate learn page slug
  const result = learnSlugSchema.safeParse(slug);
  if (!result.success) {
    return notFound();
  }

  const validatedSlug = result.data;
  const article = await getArticleBySlug(validatedSlug);

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
    <LearnArticlePage article={articleData} articles={relatedArticles.data} />
  );
}

export async function generateStaticParams() {
  const articles = await getArticles();

  const data = articles.data.map((article) => ({
    slug: article?.Slug,
  }));

  return data;
}
