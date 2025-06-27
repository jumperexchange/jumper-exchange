import { useEffect, useMemo, useState } from 'react';
import { useGetVerifiedTasks } from 'src/hooks/tasksVerification/useGetVerifiedTasks';
import { useMissionsMaxAPY } from 'src/hooks/useMissionsMaxAPY';
import type { Quest, TaskVerificationWithApy } from 'src/types/loyaltyPass';
import { getStrapiBaseUrl } from 'src/utils/strapi/strapiHelper';

export const useFormatDisplayMissionData = (mission: Quest) => {
  const baseStrapiUrl = getStrapiBaseUrl();
  const {
    id,
    Title,
    Description,
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
  const chains = CustomInformation?.['chains'];
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

  return {
    id: id.toString(),
    slug: Slug,
    title: Title || '',
    description: Description || '',
    startDate: StartDate || '',
    endDate: EndDate || '',
    imageUrl: BannerImage?.[0]?.url
      ? `${baseStrapiUrl}${BannerImage[0].url}`
      : undefined,
    participants: chains?.map((chain: any) => ({
      avatarUrl: chain.logo,
      label: chain.name,
    })),
    rewardGroups,
    href: shouldOverrideWithInternalLink ? `/missions/${Slug}` : Link,
  };
};

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

  const firstUnverifiedTaskId = useMemo(() => {
    return tasks.find((task) => !verifiedTaskIds.has(task.uuid))?.uuid;
  }, [tasks, verifiedTaskIds]);

  const [activeTaskId, setActiveTaskId] = useState<string | undefined>(
    () => firstUnverifiedTaskId,
  );

  useEffect(() => {
    if (!activeTaskId && firstUnverifiedTaskId) {
      setActiveTaskId(firstUnverifiedTaskId);
    }
  }, [firstUnverifiedTaskId, activeTaskId]);

  const enhancedTasks = useMemo(() => {
    return tasks.map((task) => {
      const isVerified = verifiedTaskIds.has(task.uuid);
      const isActive = task.uuid === activeTaskId;

      return {
        ...task,
        isVerified,
        isActive,
      };
    });
  }, [JSON.stringify(tasks), JSON.stringify(verifiedTasks), activeTaskId]);

  return {
    enhancedTasks,
    setActiveTask: setActiveTaskId,
  };
};
