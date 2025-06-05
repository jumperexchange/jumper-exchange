import { questSlugSchema } from '@/utils/validation-schemas';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteName } from 'src/app/lib/metadata';
import { CTALinkInt } from 'src/components/QuestPage/CTA/MissionCTA';
import { getSiteUrl, JUMPER_QUESTS_PATH } from 'src/const/urls';
import { sliceStrToXChar } from 'src/utils/splitStringToXChar';
import { getMerklOpportunities } from '../../../lib/getMerklOpportunities';
import { getQuestBySlug } from '../../../lib/getQuestBySlug';
import QuestPage from '../../../ui/quests/QuestMissionPage';

type Params = Promise<{ slug: string }>;

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
      throw new Error('Invalid quest slug');
    }

    const quest = await getQuestBySlug(slugResult.data);

    if (!quest || !quest.data) {
      throw new Error();
    }

    const questData = quest.data;

    const openGraph: Metadata['openGraph'] = {
      title: `Jumper Quest | ${sliceStrToXChar(questData.Title, 45)}`,
      description: `${sliceStrToXChar(questData.Information || 'Quest description', 60)}`,
      siteName: siteName,
      url: `${getSiteUrl()}${JUMPER_QUESTS_PATH}/${slug}`,
      images: [
        {
          url: `${quest.url}${questData.Image?.url}`,
          width: 900,
          height: 450,
          alt: 'banner image',
        },
      ],
      type: 'article',
    };

    return {
      title: `Jumper Quest | ${sliceStrToXChar(questData.Title, 45)}`,
      description: questData.Subtitle,
      alternates: {
        canonical: `${getSiteUrl()}${JUMPER_QUESTS_PATH}/${slug}`,
      },
      twitter: openGraph,
      openGraph,
    };
  } catch (err) {
    return {
      title: `Jumper Quest | ${sliceStrToXChar(slug.replaceAll('-', ' '), 45)}`,
      description: `This is the description for the quest "${slug.replaceAll('-', ' ')}".`,
    };
  }
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;

  // Validate slug
  const slugResult = questSlugSchema.safeParse(slug);
  if (!slugResult.success) {
    return notFound();
  }

  const { data, url } = await getQuestBySlug(slugResult.data);
  if (!data) {
    return notFound();
  }

  // Fetch Merkl opportunities if rewardsIds are present
  const rewardsIds = data.CustomInformation?.['rewardsIds'] || [];
  const merklOpportunities =
    Array.isArray(rewardsIds) && rewardsIds.length > 0
      ? await getMerklOpportunities({ rewardsIds })
      : { data: [], url: '' };

  // Fetch Merkl opportunities for tasks if they have campaign IDs
  const taskOpportunities = await Promise.all(
    (data.tasks_verification || []).map(async (task) => {
      if (!task.CampaignId) return null;
      const opportunities = await getMerklOpportunities({
        campaignId: task.CampaignId,
      });
      return {
        taskId: task.uuid,
        opportunities: opportunities.data,
      };
    }),
  );

  // Convert to a map for easier lookup
  const taskOpportunitiesMap: Record<string, CTALinkInt[]> =
    taskOpportunities.reduce(
      (acc, curr) => {
        if (curr) {
          acc[curr.taskId] = curr.opportunities;
        }
        return acc;
      },
      {} as Record<string, CTALinkInt[]>,
    );

  return (
    <QuestPage
      quest={data}
      url={url}
      merklOpportunities={merklOpportunities.data}
      taskOpportunities={taskOpportunitiesMap}
    />
  );
}
