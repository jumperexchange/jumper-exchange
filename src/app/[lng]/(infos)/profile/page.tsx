import { getProfileBannerCampaigns } from '@/app/lib/getProfileBannerCampaigns';
import ProfilePage from '@/app/ui/profile/ProfilePage';
import { getSiteUrl } from '@/const/urls';
import type { Metadata } from 'next';
import { getQuestsWithNoCampaignAttached } from 'src/app/lib/getQuestsWithNoCampaignAttached';
import { fetchQuestOpportunitiesByRewardsIds } from 'src/utils/merkl/fetchQuestOpportunities';

export const metadata: Metadata = {
  title: 'Jumper Loyalty Pass',
  description:
    'Jumper Loyalty Pass is the page explaining the Loyalty Pass sytem.',
  alternates: {
    canonical: `${getSiteUrl()}/profile`,
  },
};

export default async function Page() {
  const [{ data: campaigns }, { data: questsData }] = await Promise.all([
    getProfileBannerCampaigns(),
    getQuestsWithNoCampaignAttached(),
  ]);

  // Fetch max APY for all quests and add to quest data
  questsData.data = await fetchQuestOpportunitiesByRewardsIds(questsData.data);

  return <ProfilePage quests={questsData.data} campaigns={campaigns} />;
}
