import { ReactNode } from 'react';
import { QuestData } from 'src/types/strapi';

export type Reward = {
  value: string;
  label: string;
  avatarUrl?: string;
};

export type Participant = {
  avatarUrl: string;
  label?: string;
};

export type EntityCardVariant = 'wide' | 'compact';

export type RewardGroupKey = 'apy' | 'xp' | 'coins' | 'generic';

export interface EntityCardProps {
  id?: string;
  slug?: string;
  title?: string;
  isLoading?: boolean;
  description?: QuestData['Description'];
  descriptionRichText?: QuestData['DescriptionRichText'];
  imageUrl?: string;
  variant?: EntityCardVariant;
  badge?: ReactNode;
  partnerLink?: {
    url: string;
    label: string;
  };
  participants?: Participant[];
  rewardGroups?: Partial<Record<RewardGroupKey, Reward[]>>;
  fullWidth?: boolean;
  onClick?: () => void;
}
