import { questSlugSchema } from '@/utils/validation-schemas';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getQuestsWithNoCampaignAttached } from 'src/app/lib/getQuestsWithNoCampaignAttached';
import { siteName } from 'src/app/lib/metadata';
import { getSiteUrl, JUMPER_QUESTS_PATH } from 'src/const/urls';
import { fetchOpportunitiesByRewardsIds } from 'src/utils/merkl/fetchQuestOpportunities';
import { fetchTaskOpportunities } from 'src/utils/merkl/fetchTaskOpportunities';
import { filterUniqueByIdentifier } from 'src/utils/merkl/merklHelper';
import { sliceStrToXChar } from 'src/utils/splitStringToXChar';
import { getStrapiBaseUrl } from 'src/utils/strapi/strapiHelper';
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
    const baseUrl = getStrapiBaseUrl();

    const openGraph: Metadata['openGraph'] = {
      title: `Jumper Quest | ${sliceStrToXChar(questData.Title, 45)}`,
      description: `${sliceStrToXChar(questData.Information || 'Quest description', 60)}`,
      siteName: siteName,
      url: `${getSiteUrl()}${JUMPER_QUESTS_PATH}/${slug}`,
      images: [
        {
          url: `${baseUrl}${questData.Image?.url}`,
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

export async function generateStaticParams() {
  const { data } = await getQuestsWithNoCampaignAttached();

  return data.data.map((quest) => ({ slug: quest.Slug }));
}

export const dynamicParams = true;
export const revalidate = 300;

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;

  // Validate slug
  const slugResult = questSlugSchema.safeParse(slug);
  if (!slugResult.success) {
    return notFound();
  }

  const { data } = await getQuestBySlug(slugResult.data);
  if (!data) {
    return notFound();
  }

  // fetch merkl opportunities if rewardsIds are present
  const rewardsIds = data.CustomInformation?.['rewardsIds'];
  const merklOpportunities = await fetchOpportunitiesByRewardsIds(
    rewardsIds,
  ).then((el) => filterUniqueByIdentifier(el));

  // fetches and add apy to task_verification items:
  data.tasks_verification = await fetchTaskOpportunities(
    data.tasks_verification,
  );

  return <QuestPage quest={data} merklOpportunities={merklOpportunities} />;
}
