import { useEffect, useMemo } from 'react';
import { useGetVerifiedTasks } from 'src/hooks/tasksVerification/useGetVerifiedTasks';
import { useMissionsMaxAPY } from 'src/hooks/useMissionsMaxAPY';
import { useMissionStore } from 'src/stores/mission/MissionStore';
import type { Quest, TaskVerificationWithApy } from 'src/types/loyaltyPass';
import { getStrapiBaseUrl } from 'src/utils/strapi/strapiHelper';

interface ChainParticipant {
  name: string;
  logo: string;
  chainId: number;
}

export const useFormatDisplayMissionData = (mission: Quest) => {
  const baseStrapiUrl = getStrapiBaseUrl();
  const {
    id,
    Title,
    Description,
    Information,
    Slug,
    StartDate,
    EndDate,
    Points,
    BannerImage,
    Link,
    CustomInformation = {} as any,
  } = mission;

  const rewards = CustomInformation?.['rewards'];
  const rewardType = CustomInformation?.['rewardType'];
  const rewardRange = CustomInformation?.['rewardRange'];
  const claimingIds = CustomInformation?.['claimingIds'];
  const chains = (CustomInformation?.['chains'] ?? []) as ChainParticipant[];
  const projectData = CustomInformation?.['projectData'];
  const projectDataName = projectData?.project;
  const chainId = projectData?.chainId;
  const chainName = projectData?.chain;
  const partnerLinkHref = CustomInformation?.['socials']?.website;
  const shouldOverrideWithInternalLink =
    !!CustomInformation?.['shouldOverrideWithInternalLink'];
  const { apy: apyValue } = useMissionsMaxAPY(claimingIds, undefined);

  const apyRewards = useMemo(() => {
    if (apyValue) {
      return [
        {
          value: apyValue,
          label: 'APY',
        },
      ];
    }
    return [];
  }, [apyValue]);

  const xpRewards = useMemo(() => {
    const label = 'XP';
    if (rewardType === 'weekly') {
      return [
        {
          value: rewardRange || 'VAR.%',
          label,
        },
      ];
    } else if (Points) {
      return [
        {
          value: Points,
          label,
        },
      ];
    }
    return [];
  }, [Points, rewardType, rewardRange]);

  const coinsRewards = useMemo(() => {
    if (rewards) {
      return [
        {
          value: rewards.amount,
          label: rewards.name,
          avatarUrl: rewards.logo ?? undefined,
        },
      ];
    }
    return [];
  }, [rewards]);

  const rewardGroups = useMemo(() => {
    const groups: Record<string, any[]> = {};
    if (apyRewards.length > 0) {
      groups.apy = apyRewards;
    }
    if (xpRewards.length > 0) {
      groups.xp = xpRewards;
    }
    if (coinsRewards.length > 0) {
      groups.coins = coinsRewards;
    }
    return groups;
  }, [apyRewards, xpRewards, coinsRewards]);

  // @TODO useMemo
  return useMemo(() => {
    return {
      id: id.toString(),
      slug: Slug,
      title: Title || '',
      description: Description || '',
      info: Information || '',
      startDate: StartDate || '',
      endDate: EndDate || '',
      imageUrl: BannerImage?.[0]?.url
        ? `${baseStrapiUrl}${BannerImage[0].url}`
        : undefined,
      participants: chains?.map((chain) => ({
        avatarUrl: chain.logo,
        label: chain.name,
        id: chain.chainId,
      })),
      rewardGroups,
      href: shouldOverrideWithInternalLink ? `/missions/${Slug}` : Link,
      partnerLink: partnerLinkHref
        ? {
            url: partnerLinkHref,
            label: `Discover ${projectDataName}`,
          }
        : undefined,
      chain: {
        name: chainName,
        id: chainId,
      },
    };
  }, [
    id,
    Slug,
    Title,
    Description,
    Information,
    StartDate,
    EndDate,
    BannerImage,
    chains,
    partnerLinkHref,
    projectDataName,
    rewardGroups,
    chainName,
    chainId,
  ]);
};

export const useSetMissionChainFromParticipants = (
  participatingChains: ReturnType<
    typeof useFormatDisplayMissionData
  >['participants'],
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
      setMissionDefaults(participatingChainsIds);
    }
  }, [participatingChainsIds, setMissionDefaults]);
};

export enum TaskType {
  Bridge = 'bridge',
  Swap = 'swap',
  Deposit = 'deposit',
  OnChain = 'on-chain',
  OffChain = 'off-chain',
  Zap = 'zap',
}

export const useFormatDisplayTaskData = (
  task: TaskVerificationWithApy & {
    isVerified: boolean;
    isActive: boolean;
  },
) => {
  const {
    id,
    name,
    description,
    CTALink,
    CTAText,
    CampaignId,
    uuid,
    hasTask,
    maxApy,
    isActive,
    isVerified,
  } = task;

  return {
    id: id.toString(),
    taskId: uuid,
    title: name || '',
    description: description || '',
    campaignId: CampaignId,
    href: CTALink,
    linkLabel: CTAText,
    shouldVerify: hasTask,
    maxApy,
    isActive,
    isVerified,
  };
};

export const useEnhancedTasks = (
  tasks: TaskVerificationWithApy[],
  accountAddress?: string,
) => {
  const { data: verifiedTasks } = useGetVerifiedTasks(accountAddress);

  const verifiedTaskIds = useMemo(() => {
    return new Set(verifiedTasks?.map((v) => v.stepId));
  }, [verifiedTasks]);

  const firstUnverifiedTask = useMemo(() => {
    return tasks.find((task) => !verifiedTaskIds.has(task.uuid));
  }, [tasks, verifiedTaskIds]);

  const {
    isMissionCompleted,
    setIsMissionCompleted,
    setCurrentActiveTask,
    currentActiveTaskId,
  } = useMissionStore();

  useEffect(() => {
    if (!currentActiveTaskId && setCurrentActiveTask && firstUnverifiedTask) {
      // @Note need to replace with task type
      // @Note for zap might need a different approach
      setCurrentActiveTask(firstUnverifiedTask?.uuid, TaskType.Bridge);
    }
  }, [firstUnverifiedTask, currentActiveTaskId, setCurrentActiveTask]);

  // @Note need to check if this check is enough for considering a mission completed
  const allTasksCompleted = tasks.length === verifiedTasks?.length;

  useEffect(() => {
    if (allTasksCompleted && !isMissionCompleted) {
      setIsMissionCompleted(true);
    }
  }, [allTasksCompleted, isMissionCompleted, setIsMissionCompleted]);

  const enhancedTasks = useMemo(() => {
    return tasks.map((task) => {
      const isVerified = verifiedTaskIds.has(task.uuid);
      const isActive = task.uuid === currentActiveTaskId;

      return {
        ...task,
        isVerified,
        isActive,
      };
    });
  }, [
    JSON.stringify(tasks),
    JSON.stringify(verifiedTasks),
    currentActiveTaskId,
  ]);

  return {
    enhancedTasks,
    setActiveTask: setCurrentActiveTask,
  };
};
