import { getProfileBannerCampaigns } from '@/app/lib/getProfileBannerCampaigns';
import ProfilePage from '@/app/ui/profile/ProfilePage';
import { getSiteUrl } from '@/const/urls';
import type { Metadata } from 'next';
import { getQuestsWithNoCampaignAttached } from 'src/app/lib/getQuestsWithNoCampaignAttached';

export const metadata: Metadata = {
  title: 'Jumper Loyalty Pass',
  description:
    'Jumper Loyalty Pass is the page explaining the Loyalty Pass sytem.',
  alternates: {
    canonical: `${getSiteUrl()}/profile`,
  },
};

export default async function Page() {
  const { data: campaigns } = await getProfileBannerCampaigns();
  const { data: questsData } = await getQuestsWithNoCampaignAttached();

  return (
    <>
      <pre>{JSON.stringify(questsData, null, 2)}</pre>
      <p>Rendered at: {new Date().toISOString()}</p>
      <ProfilePage quests={questsData.data} campaigns={campaigns} />
    </>
  );
}
