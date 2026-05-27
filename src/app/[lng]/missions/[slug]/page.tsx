import { notFound } from 'next/navigation';
import type { Metadata } from 'next/types';
import { Suspense } from 'react';
import { getQuestBySlug } from 'src/app/lib/getQuestBySlug';
import { getQuestsWithNoCampaignAttached } from 'src/app/lib/getQuestsWithNoCampaignAttached';
import { siteName } from 'src/app/lib/metadata';
import { sliceStrToXChar } from 'src/utils/splitStringToXChar';
import { resolveStrapiMediaUrl } from 'src/utils/strapi/strapiHelper';
import { questSlugSchema } from 'src/utils/validation-schemas';
import { AppPaths, getSiteUrl } from 'src/const/urls';
import { MissionPageSkeleton } from 'src/app/ui/mission/MissionPageSkeleton';
import { MissionPage } from 'src/app/ui/mission/MissionPage';
import { UPCOMING_DAYS_AHEAD } from 'src/const/quests';
import envConfig from '@/config/env-config';

type Params = Promise<{ slug: string }>;

const pageTitlePrepend = 'Jumper Mission | ';

const getPageTitle = (title: string) => {
  return `${pageTitlePrepend}${sliceStrToXChar(title, 45)}`;
};

const formatSlugToTitle = (slug: string) => slug.replaceAll('-', ' ');

export async function generateStaticParams() {
  if (envConfig.NEXT_PUBLIC_ENVIRONMENT !== 'production') {
    return [];
  }

  const pageSize = 25;

  const { data: firstPage } = await getQuestsWithNoCampaignAttached(
    { page: 1, pageSize, withCount: true },
    UPCOMING_DAYS_AHEAD,
  );

  const { pageCount } = firstPage.meta.pagination;

  const remainingPages =
    pageCount > 1
      ? await Promise.all(
          Array.from({ length: pageCount - 1 }, (_, i) =>
            getQuestsWithNoCampaignAttached(
              { page: i + 2, pageSize },
              UPCOMING_DAYS_AHEAD,
            ),
          ),
        )
      : [];

  const allMissions = [
    ...firstPage.data,
    ...remainingPages.flatMap(({ data }) => data.data),
  ];

  return allMissions
    .filter((mission) => mission.Slug)
    .map((mission) => ({ slug: mission.Slug! }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    // Validate slug
    const slugResult = questSlugSchema.safeParse(slug);

    if (!slugResult.success) {
      throw new Error('Invalid mission slug');
    }

    const mission = await getQuestBySlug(slugResult.data);

    if (!mission || !mission.data) {
      throw new Error('Mission not found');
    }

    const missionData = mission.data;
    const imageUrl = resolveStrapiMediaUrl(missionData.Image?.url);

    const pageUrl = `${getSiteUrl()}${AppPaths.Missions}/${slug}`;

    const openGraph: Metadata['openGraph'] = {
      title: getPageTitle(missionData.Title),
      description: `${sliceStrToXChar(missionData.Information || 'Mission description', 60)}`,
      siteName: siteName,
      url: pageUrl,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 900,
              height: 450,
              alt: 'banner image',
            },
          ]
        : undefined,
      type: 'article',
    };

    return {
      title: getPageTitle(missionData.Title),
      description: missionData.Subtitle,
      alternates: {
        canonical: pageUrl,
      },
      twitter: openGraph,
      openGraph,
    };
  } catch (err) {
    const formattedSlug = formatSlugToTitle(slug);
    return {
      title: getPageTitle(formattedSlug),
      description: `This is the description for the mission "${formattedSlug}".`,
    };
  }
}

export const dynamicParams = true;
export const revalidate = 3600;

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;

  if (!slug) {
    return notFound();
  }

  return (
    <Suspense fallback={<MissionPageSkeleton />}>
      <MissionPage slug={slug} />
    </Suspense>
  );
}
