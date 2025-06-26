import { notFound } from 'next/navigation';
import { Metadata } from 'next/types';
import { Suspense } from 'react';
import { getFeatureFlag } from 'src/app/lib/getFeatureFlag';
import { getQuestBySlug } from 'src/app/lib/getQuestBySlug';
import { getQuestsWithNoCampaignAttached } from 'src/app/lib/getQuestsWithNoCampaignAttached';
import { MissionsPage } from 'src/app/ui/missions/MissionsPage';
import { MissionsPageSkeleton } from 'src/app/ui/missions/MissionsPageSkeleton';
import { siteName } from 'src/app/lib/metadata';
import { GlobalFeatureFlags } from 'src/const/abtests';
import { sliceStrToXChar } from 'src/utils/splitStringToXChar';
import { getStrapiBaseUrl } from 'src/utils/strapi/strapiHelper';
import { questSlugSchema } from 'src/utils/validation-schemas';
import { AppPaths, getSiteUrl } from 'src/const/urls';
import { MissionPageSkeleton } from 'src/app/ui/mission/MissionPageSkeleton';
import { MissionPage } from 'src/app/ui/mission/MissionPage';

type Params = Promise<{ slug: string }>;

const pageTitlePrepend = 'Jumper Mission | ';

const getPageTitle = (title: string) => {
  return `${pageTitlePrepend}${sliceStrToXChar(title, 45)}`;
};

const formatSlugToTitle = (slug: string) => slug.replaceAll('-', ' ');

export async function generateStaticParams() {
  const { data: missionsResponse } = await getQuestsWithNoCampaignAttached({
    page: 1,
    pageSize: 12,
  });

  return missionsResponse.data.map((mission) => ({ slug: mission.Slug }));
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
    const baseUrl = getStrapiBaseUrl();

    const pageUrl = `${getSiteUrl()}${AppPaths.Missions}/${slug}`;

    const openGraph: Metadata['openGraph'] = {
      title: getPageTitle(missionData.Title),
      description: `${sliceStrToXChar(missionData.Information || 'Mission description', 60)}`,
      siteName: siteName,
      url: pageUrl,
      images: [
        {
          url: `${baseUrl}${missionData.Image?.url}`,
          width: 900,
          height: 450,
          alt: 'banner image',
        },
      ],
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
export const revalidate = 300;

export default async function Page({ params }: { params: Params }) {
  const [isPageEnabled, { slug }] = await Promise.all([
    getFeatureFlag(
      GlobalFeatureFlags.MissionsPage,
      // Placeholder distinctId required by the API call.
      // This global feature flag is not tied to any specific user.
      'distinct-id',
    ),
    params,
  ]);

  if (!isPageEnabled || !slug) {
    return notFound();
  }

  return (
    <Suspense fallback={<MissionPageSkeleton />}>
      <MissionPage slug={slug} />
    </Suspense>
  );
}
