import { ReactNode } from 'react';

export type Reward = {
  value: string;
  label: string;
  avatarUrl?: string;
};

export type Participant = {
  avatarUrl: string;
  label?: string;
};

export type EntityCardType = 'wide' | 'compact';

export interface EntityCardProps {
  id: string;
  slug: string;
  title: string;
  isLoading?: boolean;
  description?: string;
  imageUrl: string;
  type?: EntityCardType;
  badge?: ReactNode;
  partnerLink?: {
    url: string;
    label: string;
  };
  participants: Participant[];
  rewardGroups?: {
    [key: string]: Reward[];
  };
  onClick?: () => void;
}
