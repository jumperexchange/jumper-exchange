import { getQuestBySlug } from 'src/app/lib/getQuestBySlug';
import QuestPage from 'src/app/ui/quests/QuestMissionPage';

// todo: adjust metadata for quests-page
// export const metadata: Metadata = {
//   title: 'Jumper | Quests',
//   description: 'Dive into the Quests',
//   alternates: {
//     canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/quests/`,
//   },
// };

export default async function Page({ params }: { params: { slug: string } }) {
  const { data, url } = await getQuestBySlug(params.slug);

  return <QuestPage quest={data?.data?.[0]} url={url} />;
}
