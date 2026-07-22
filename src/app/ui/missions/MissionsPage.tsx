import { PAGE_SIZE, UPCOMING_DAYS_AHEAD } from 'src/const/quests';
import { MissionsList } from './MissionsList';
import {
  fetchMissionsListForPage,
  fetchProfileBannerCampaignsForPage,
} from '@/app/lib/missions/cachedMissionsFetch';
import { GridContainer } from 'src/components/Containers/GridContainer';
import { MissionsSection } from './MissionsSection';
import { MissionPageTracking } from '@/components/headless/tracking/MissionPageTracking';
import { BannerCampaign } from './BannerCampaign/BannerCampaign';
import { isBannerCampaign } from 'src/utils/isBannerCampaign';

export const MissionsPage = async () => {
  const [{ data: missionsResponse }, { data: campaigns }] = await Promise.all([
    fetchMissionsListForPage(
      {
        page: 1,
        pageSize: PAGE_SIZE,
        withCount: true,
      },
      UPCOMING_DAYS_AHEAD,
    ),
    fetchProfileBannerCampaignsForPage(),
  ]);

  const missions = missionsResponse.data;
  const totalMissions = missionsResponse.meta.pagination?.total || 0;
  const hasMoreMissions = totalMissions > missions.length;
  const validBannerCampaigns = campaigns?.filter(isBannerCampaign) || [];

  return (
    <>
      <BannerCampaign campaigns={validBannerCampaigns} />
      <MissionsSection count={totalMissions}>
        <GridContainer
          dataTestId="missions-list"
          gridTemplateColumns="repeat(auto-fill, minmax(min(320px, 100%), 1fr))"
        >
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
