import { questSlugSchema } from '@/utils/validation-schemas';
import type { Metadata } from 'next';
import { redirect, RedirectType } from 'next/navigation';
import { AppPaths, getSiteUrl } from 'src/const/urls';
import { sliceStrToXChar } from 'src/utils/splitStringToXChar';

type Params = Promise<{ slug: string }>;

/**
 * Legacy `/quests/:slug` URLs redirect to `/missions/:slug`.
 * Keep metadata cheap (no Strapi): canonical points at missions so crawlers
 * and previews prefer the real URL; avoid indexing the redirect hop.
 */
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const slugResult = questSlugSchema.safeParse(slug);
  const pathSlug = slugResult.success ? slugResult.data : slug;
  const missionUrl = `${getSiteUrl()}${AppPaths.Missions}/${pathSlug}`;
  const titleFromSlug = sliceStrToXChar(pathSlug.replaceAll('-', ' '), 45);

  return {
    title: `Jumper Mission | ${titleFromSlug}`,
    alternates: {
      canonical: missionUrl,
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;

  redirect(`${AppPaths.Missions}/${slug}`, RedirectType.replace);
}
