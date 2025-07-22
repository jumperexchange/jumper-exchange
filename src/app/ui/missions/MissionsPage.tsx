import { PAGE_SIZE } from 'src/const/quests';
import { MissionsList } from './MissionsList';
import { getQuestsWithNoCampaignAttached } from 'src/app/lib/getQuestsWithNoCampaignAttached';
import { getProfileBannerCampaigns } from 'src/app/lib/getProfileBannerCampaigns';
import { isBannerCampaign } from 'src/utils/isBannerCampaign';
import { BannerCampaign } from './BannerCampaign/BannerCampaign';
import { GridContainer } from 'src/components/Containers/GridContainer';
import { MissionsSection } from './MissionsSection';

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
    <>
      <BannerCampaign campaigns={validBannerCampaigns} />
      <MissionsSection count={totalMissions}>
        <GridContainer>
          <MissionsList
            initialMissions={missions}
            shouldLoadMore={hasMoreMissions}
          />
        </GridContainer>
      </MissionsSection>
    </>
  );
};
