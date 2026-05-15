import { Suspense } from 'react';
import { PAGE_SIZE, UPCOMING_DAYS_AHEAD } from 'src/const/quests';
import { MissionsList } from './MissionsList';
import { getQuestsWithNoCampaignAttached } from 'src/app/lib/getQuestsWithNoCampaignAttached';
import { BannerCampaignSkeleton } from './BannerCampaign/BannerCampaignSkeleton';
import { GridContainer } from 'src/components/Containers/GridContainer';
import { MissionsSection } from './MissionsSection';
import { MissionPageTracking } from '@/components/headless/tracking/MissionPageTracking';
import { MissionsPageBanner } from './MissionsPageBanner';

export const MissionsPage = async () => {
  const { data: missionsResponse } = await getQuestsWithNoCampaignAttached(
    {
      page: 1,
      pageSize: PAGE_SIZE,
      withCount: true,
    },
    UPCOMING_DAYS_AHEAD,
  );
  const missions = missionsResponse.data;
  const totalMissions = missionsResponse.meta.pagination?.total || 0;
  const hasMoreMissions = totalMissions > missions.length;

  return (
    <>
      <Suspense fallback={<BannerCampaignSkeleton />}>
        <MissionsPageBanner />
      </Suspense>
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
