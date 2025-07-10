import { PAGE_SIZE } from 'src/const/quests';
import { MissionsList } from './MissionsList';
import { MissionsPageContainer } from './MissionsPageContainer';
import { getQuestsWithNoCampaignAttached } from 'src/app/lib/getQuestsWithNoCampaignAttached';
import { getProfileBannerCampaigns } from 'src/app/lib/getProfileBannerCampaigns';
import { CampaignCarousel } from './Campaign/CampaignCarousel';
import { MissionsPageContentContainer } from './MissionsPageContentContainer';

export const MissionsPage = async () => {
  const [{ data: campaigns }, { data: missionsResponse }] = await Promise.all([
    getProfileBannerCampaigns(),
    getQuestsWithNoCampaignAttached({
      page: 1,
      pageSize: PAGE_SIZE,
      withCount: true,
    }),
  ]);
  const missions = missionsResponse.data;
  const totalMissions = missionsResponse.meta.pagination?.total || 0;
  const hasMoreMissions = totalMissions > missions.length;
  return (
    <MissionsPageContainer>
      <CampaignCarousel campaigns={campaigns} />
      <MissionsPageContentContainer>
        <MissionsList
          initialMissions={missions}
          shouldLoadMore={hasMoreMissions}
        />
      </MissionsPageContentContainer>
    </MissionsPageContainer>
  );
};
