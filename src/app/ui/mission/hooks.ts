import { useCallback, useEffect, useMemo } from 'react';
import { useGetVerifiedTasks } from 'src/hooks/tasksVerification/useGetVerifiedTasks';
import { useMissionsMaxAPY } from 'src/hooks/useMissionsMaxAPY';
import { useMissionStore } from 'src/stores/mission/MissionStore';
import { useSdkConfigStore } from 'src/stores/sdkConfig/SDKConfigStore';
import {
  TaskType,
  type Quest,
  type TaskVerificationWithApy,
} from 'src/types/loyaltyPass';
import { capitalizeString } from 'src/utils/capitalizeString';
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
            label: `Discover ${capitalizeString(projectDataName ?? '')}`,
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

export const useFormatDisplayTaskData = (
  task: TaskVerificationWithApy & {
    isVerified: boolean;
    isRequired: boolean;
  },
) => {
  return useMemo(() => {
    const {
      id,
      name,
      description,
      CTALink,
      CTAText,
      CampaignId,
      TaskType,
      uuid,
      hasTask,
      maxApy,
      isVerified,
      isRequired,
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
      taskType: TaskType,
      maxApy,
      isVerified,
      isRequired,
    };
  }, [JSON.stringify(task ?? {})]);
};

export const useEnhancedTasks = (
  tasks: TaskVerificationWithApy[],
  accountAddress?: string,
) => {
  const { data: verifiedTasks = [] } = useGetVerifiedTasks(accountAddress);
  const { setConfigType, configType } = useSdkConfigStore();

  const verifiedTaskIds = useMemo(() => {
    return new Set(verifiedTasks?.map((v) => v.stepId));
  }, [verifiedTasks]);

  const firstUnverifiedTask = useMemo(() => {
    return (
      tasks.find((task) => task.hasTask && !verifiedTaskIds.has(task.uuid)) ||
      tasks[0]
    );
  }, [tasks, verifiedTaskIds]);

  const {
    isMissionCompleted,
    setIsMissionCompleted,
    setCurrentActiveTask,
    setCurrentTaskWidgetFormParams,
    currentActiveTaskId,
  } = useMissionStore();

  const handleSetActiveTask = useCallback(
    (task: TaskVerificationWithApy) => {
      const taskType = task.TaskType ?? TaskType.Bridge;
      const widgetFormParams = task.TaskWidgetInformation ?? {};

      if (taskType === TaskType.Zap && configType !== 'zap') {
        setConfigType('zap');
      } else if (taskType !== TaskType.Zap && configType === 'zap') {
        setConfigType('default');
      }

      setCurrentActiveTask(task.uuid, taskType);

      setCurrentTaskWidgetFormParams({
        sourceChain: widgetFormParams.sourceChain ?? undefined,
        sourceToken: widgetFormParams.sourceToken ?? undefined,
        destinationChain: widgetFormParams.destinationChain ?? undefined,
        destinationToken: widgetFormParams.destinationToken ?? undefined,
        toAddress: widgetFormParams.toAddress ?? undefined,
        fromAmount: widgetFormParams.fromAmount ?? undefined,
      });
    },
    [
      setCurrentActiveTask,
      setCurrentTaskWidgetFormParams,
      configType,
      setConfigType,
    ],
  );

  useEffect(() => {
    if (
      firstUnverifiedTask &&
      !currentActiveTaskId &&
      firstUnverifiedTask.uuid
    ) {
      handleSetActiveTask(firstUnverifiedTask);
    }
  }, [firstUnverifiedTask, currentActiveTaskId, handleSetActiveTask]);

  const allTasksCompleted = useMemo(() => {
    const requiredTasks = tasks.filter((task) => task.isRequired);
    return requiredTasks.length === verifiedTasks?.length;
  }, [JSON.stringify(tasks), JSON.stringify(verifiedTasks)]);

  useEffect(() => {
    if (allTasksCompleted && !isMissionCompleted) {
      setIsMissionCompleted(true);
    }
  }, [allTasksCompleted, isMissionCompleted, setIsMissionCompleted]);

  const enhancedTasks = useMemo(() => {
    return tasks.map((task) => {
      const isVerified = task.hasTask && verifiedTaskIds.has(task.uuid);
      const isRequired = !!task.isRequired;

      return {
        ...task,
        isVerified,
        isRequired,
      };
    });
  }, [JSON.stringify(tasks), JSON.stringify(verifiedTasks)]);

  return {
    enhancedTasks,
    setActiveTask: handleSetActiveTask,
  };
};
