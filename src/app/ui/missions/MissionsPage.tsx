import { PAGE_SIZE } from 'src/const/quests';
import { MissionsList } from './MissionsList';
import { MissionsPageContainer } from './MissionsPageContainer';
import { getQuestsWithNoCampaignAttached } from 'src/app/lib/getQuestsWithNoCampaignAttached';
import { getProfileBannerCampaigns } from 'src/app/lib/getProfileBannerCampaigns';
import { MissionsPageContentContainer } from './MissionsPageContentContainer';
import { isBannerCampaign } from 'src/utils/isBannerCampaign';
import { BannerCampaignCarousel } from './Campaign/BannerCampaignCarousel';

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

  const validBannerCampaigns = campaigns?.filter(isBannerCampaign) || [];

  return (
    <MissionsPageContainer>
      <BannerCampaignCarousel campaigns={validBannerCampaigns} />
      <MissionsPageContentContainer>
        <MissionsList
          initialMissions={missions}
          shouldLoadMore={hasMoreMissions}
        />
      </MissionsPageContentContainer>
    </MissionsPageContainer>
  );
};
