import { getArticles } from '@/app/lib/getArticles';
import { draftMode } from 'next/headers';
import { siteName } from '@/app/lib/metadata';
import LearnArticlePage from '@/app/ui/learn/LearnArticlePage';
import { getSiteUrl } from '@/const/urls';
import type { BlogArticleData, StrapiMediaData } from '@/types/strapi';
import { sliceStrToXChar } from '@/utils/splitStringToXChar';
import { learnSlugSchema } from '@/utils/validation-schemas';
import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { getStrapiBaseUrl } from 'src/utils/strapi/strapiHelper';
import { getArticleBySlug } from '../../../../lib/getArticleBySlug';
import { getArticlesByTag } from '../../../../lib/getArticlesByTag';

const FALLBACK_METADATA: Metadata = {
  title: 'Jumper Learn',
  description: 'Learn about blockchain and crypto on Jumper.',
  alternates: { canonical: `${getSiteUrl()}/learn` },
};

function getStrapiImageUrl(
  image: StrapiMediaData | undefined,
  baseUrl: string,
): string | undefined {
  return image?.url ? `${baseUrl}${image.url}` : undefined;
}

function getPageTitle(title: string) {
  return `${title} | Jumper Learn`;
}

function buildOgImage(
  image: StrapiMediaData | undefined,
  imageUrl: string | undefined,
): NonNullable<Metadata['openGraph']>['images'] {
  if (!imageUrl) {
    return undefined;
  }
  return [
    {
      url: imageUrl,
      width: image?.width ?? 900,
      height: image?.height ?? 450,
      alt: image?.alternativeText ?? 'banner image',
    },
  ];
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;

  const parsed = learnSlugSchema.safeParse(slug);
  if (!parsed.success) {
    return FALLBACK_METADATA;
  }

  const validatedSlug = parsed.data;
  const article = await getArticleBySlug(validatedSlug);
  const articleData = article.data?.data?.[0];

  if (!articleData) {
    return FALLBACK_METADATA;
  }

  const seo = articleData.seo;

  const pageUrl = `${getSiteUrl()}/learn/${validatedSlug}`;
  const baseUrl = getStrapiBaseUrl();

  const ogImage =
    seo?.openGraph?.ogImage ?? seo?.metaImage ?? articleData.Image;
  const ogImageUrl = getStrapiImageUrl(ogImage, baseUrl);

  const title = getPageTitle(
    seo?.metaTitle ?? sliceStrToXChar(articleData.Title, 45),
  );
  const description = seo?.metaDescription ?? articleData.Subtitle;
  const canonical = seo?.canonicalURL ?? pageUrl;

  return {
    title,
    description,
    keywords: seo?.keywords ?? undefined,
    alternates: { canonical },
    openGraph: {
      title: getPageTitle(
        seo?.openGraph?.ogTitle ??
          seo?.metaTitle ??
          sliceStrToXChar(articleData.Title, 45),
      ),
      description:
        seo?.openGraph?.ogDescription ??
        seo?.metaDescription ??
        sliceStrToXChar(articleData.Subtitle, 60),
      siteName,
      url: seo?.openGraph?.ogUrl ?? canonical,
      images: buildOgImage(ogImage, ogImageUrl),
      type: (seo?.openGraph?.ogType as 'article' | 'website') ?? 'article',
    },
    twitter: {
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
  };
}

export default async function Page({ params }: { params: Params }) {
  const [{ slug }, { isEnabled: isDraftMode }] = await Promise.all([
    params,
    draftMode(),
  ]);

  // Validate learn page slug
  const result = learnSlugSchema.safeParse(slug);
  if (!result.success) {
    return notFound();
  }

  const validatedSlug = result.data;
  const article = await getArticleBySlug(validatedSlug, isDraftMode);

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
