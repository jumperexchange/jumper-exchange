// todo: adjust metadata for quests-page
// export const metadata: Metadata = {
//   title: 'Jumper | Quests',
//   description: 'Dive into the Quests',
//   alternates: {
//     canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/quests/`,
//   },
// };

import { getQuestBySlug } from '../../../lib/getQuestBySlug';
import QuestPage from '../../../ui/quests/QuestMissionPage';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { slug: string } }) {
  const { data, url } = await getQuestBySlug(params.slug);

  if (!data?.data?.[0]) {
    return notFound();
  }

  return <QuestPage quest={data?.data?.[0]} url={url} />;
}
