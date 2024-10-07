import { getQuestBySlug } from 'src/app/lib/getQuestBySlug';
import QuestMissionPage from 'src/app/ui/quests/QuestMissionPage';
import { JUMPER_LOYALTY_PATH } from 'src/const/urls';

// todo: adjust metadata for quests-page
// export async function generateMetadata(): Promise<Metadata> {
//   return {
//     title: 'Jumper | Quests',
//     description: 'Dive into the Quests',
//     alternates: {
//       canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/quests/`,
//     },
//   };
// }

export default async function Page({ params }: { params: { slug: string } }) {
  const { data, url } = await getQuestBySlug(params.slug);

  return (
    <QuestMissionPage
      quest={data?.data?.[0]}
      url={url}
      path={JUMPER_LOYALTY_PATH}
      platform={'Profile'}
    />
  );
}
