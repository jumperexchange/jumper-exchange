import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteName } from 'src/app/lib/metadata';
import { CampaignPage } from 'src/components/Campaign/CampaignPage';
import { getSiteUrl, JUMPER_LOYALTY_PATH } from 'src/const/urls';
import type { Quest, QuestAttributes } from 'src/types/loyaltyPass';
import { sliceStrToXChar } from 'src/utils/splitStringToXChar';

//Todo: put right metadata
// export async function generateMetadata({
//   params,
// }: {
//   params: { slug: string };
// }): Promise<Metadata> {
//   try {
//     // const quest = await getQuestBySlug(params.slug);

//     if (!quest || !quest.data) {
//       throw new Error();
//     }

//     const questData = (quest.data as any as Quest)
//       .attributes as QuestAttributes;

//     const openGraph: Metadata['openGraph'] = {
//       title: `Jumper Quest | ${sliceStrToXChar(questData.Title, 45)}`,
//       description: `${sliceStrToXChar(questData.Information || 'Quest description', 60)}`,
//       siteName: siteName,
//       url: `${getSiteUrl()}/quests/${params.slug}`,
//       images: [
//         {
//           url: `${quest.url}${questData.Image.data.attributes?.url}`,
//           width: 900,
//           height: 450,
//           alt: 'banner image',
//         },
//       ],
//       type: 'article',
//     };

//     return {
//       title: `Jumper Campaign | ${sliceStrToXChar(questData.Title, 45)}`,
//       description: questData.Subtitle,
//       alternates: {
//         canonical: `${getSiteUrl()}/quests/${params.slug}`,
//       },
//       twitter: openGraph,
//       openGraph,
//     };
//   } catch (err) {
//     return {
//       title: `Jumper Campaign | ${sliceStrToXChar(params.slug.replaceAll('-', ' '), 45)}`,
//       description: `This is the description for the quest "${params.slug.replaceAll('-', ' ')}".`,
//     };
//   }
// }

export default async function Page({ params }: { params: { slug: string } }) {
  return <CampaignPage label={params.slug} path={JUMPER_LOYALTY_PATH} />;
}
