import { MissionsList } from './MissionsList';
import { MissionsPageContainer } from './MissionsPageContainer';
import { getQuestsWithNoCampaignAttached } from 'src/app/lib/getQuestsWithNoCampaignAttached';

export const MissionsPage = async () => {
  const { data: missionsResponse } = await getQuestsWithNoCampaignAttached({
    page: 1,
    pageSize: 12,
    withCount: true,
  });
  const missions = missionsResponse.data;
  const totalMissions = missionsResponse.meta.pagination?.total || 0;
  const hasMoreMissions = totalMissions > missions.length;
  return (
    <MissionsPageContainer>
      <MissionsList
        initialMissions={missions}
        shouldLoadMore={hasMoreMissions}
      />
    </MissionsPageContainer>
  );
};
