// todo: adjust metadata for quests-page
// export const metadata: Metadata = {
//   title: 'Jumper | Quests',
//   description: 'Dive into the Quests',
//   alternates: {
//     canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/quests/`,
//   },
// };

import { notFound } from 'next/navigation';
import { getQuestBySlug } from '../../../lib/getQuestBySlug';
import QuestPage from '../../../ui/quests/QuestMissionPage';

export default async function Page({ params }: { params: { slug: string } }) {
  const { data, url } = await getQuestBySlug(params.slug);
  if (!data) {
    return notFound();
  }
  return <QuestPage quest={data} url={url} />;
}
