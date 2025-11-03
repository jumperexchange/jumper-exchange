import { useEffect, useMemo } from 'react';
import { useMissionStore } from 'src/stores/mission/MissionStore';
// import { useSdkConfigStore } from 'src/stores/sdkConfig/SDKConfigStore';
import { ParticipantChain } from 'src/types/loyaltyPass';

export const useSyncMissionDefaultsFromChains = (
  participatingChains?: ParticipantChain[],
  missionId?: string,
  missionHasEnded?: boolean,
) => {
  const { setMissionDefaults } = useMissionStore();

  const participatingChainsIds = useMemo(() => {
    if (!participatingChains) {
      return [];
    }
    return [
      ...new Set(
        participatingChains
          .map((participatingChain) => participatingChain.id)
          .filter(Boolean),
      ),
    ];
  }, [participatingChains]);

  useEffect(() => {
    if (participatingChainsIds) {
      setMissionDefaults({
        missionChainIds: participatingChainsIds,
        missionId,
        missionHasEnded,
      });
    }
  }, [participatingChainsIds, missionId, missionHasEnded, setMissionDefaults]);
};
