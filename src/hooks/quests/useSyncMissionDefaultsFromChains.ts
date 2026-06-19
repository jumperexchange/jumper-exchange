import { useEffect, useMemo } from 'react';
import { useMissionStore } from 'src/stores/mission/MissionStore';
import type { ParticipantChain } from 'src/types/loyaltyPass';

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
          .filter((id): id is number => id != null),
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
