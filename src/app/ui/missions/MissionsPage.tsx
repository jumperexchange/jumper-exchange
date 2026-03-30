import { PAGE_SIZE, UPCOMING_DAYS_AHEAD } from 'src/const/quests';
import { MissionsList } from './MissionsList';
import { getQuestsWithNoCampaignAttached } from 'src/app/lib/getQuestsWithNoCampaignAttached';
import { getProfileBannerCampaigns } from 'src/app/lib/getProfileBannerCampaigns';
import { isBannerCampaign } from 'src/utils/isBannerCampaign';
import { BannerCampaign } from './BannerCampaign/BannerCampaign';
import { GridContainer } from 'src/components/Containers/GridContainer';
import { MissionsSection } from './MissionsSection';
import { MissionPageTracking } from '@/components/headless/tracking/MissionPageTracking';

export const MissionsPage = async () => {
  let missions: Awaited<
    ReturnType<typeof getQuestsWithNoCampaignAttached>
  >['data']['data'] = [];
  let totalMissions = 0;
  let validBannerCampaigns: Awaited<
    ReturnType<typeof getProfileBannerCampaigns>
  >['data'] = [];

  try {
    const [{ data: campaigns }, { data: missionsResponse }] = await Promise.all(
      [
        getProfileBannerCampaigns(),
        getQuestsWithNoCampaignAttached(
          {
            page: 1,
            pageSize: PAGE_SIZE,
            withCount: true,
          },
          UPCOMING_DAYS_AHEAD,
        ),
      ],
    );
    missions = missionsResponse.data;
    totalMissions = missionsResponse.meta.pagination?.total || 0;
    validBannerCampaigns = campaigns?.filter(isBannerCampaign) || [];
  } catch (error) {
    console.warn('Failed to fetch missions page data:', error);
  }

  const hasMoreMissions = totalMissions > missions.length;

  return (
    <>
      <BannerCampaign campaigns={validBannerCampaigns} />
      <MissionsSection count={totalMissions}>
        <GridContainer gridTemplateColumns="repeat(auto-fill, minmax(min(320px, 100%), 1fr))">
          <MissionsList
            initialMissions={missions}
            shouldLoadMore={hasMoreMissions}
          />
        </GridContainer>
      </MissionsSection>
      <MissionPageTracking />
    </>
  );
};
