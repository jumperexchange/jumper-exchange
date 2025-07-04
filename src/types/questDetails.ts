import type { ChainId } from '@lifi/sdk';
import { MerklOpportunity } from 'src/app/lib/getMerklOpportunities';
import type { FaqProps } from 'src/components/AccordionFAQ';
import type { RewardsInterface } from 'src/components/ProfilePage/QuestCard/QuestCard';
import type { Quest } from './loyaltyPass';

export interface QuestSocials {
  twitter: string;
  telegram: string;
  website?: string;
}

export interface Chain {
  logo: string;
  name: string;
  chainId: number;
}

export interface ProjectData {
  chain: string;
  chainId: number;
  project: string;
  integrator: string;
  address: string;
  withdrawAddress?: string;
  tokenAddress?: string;
}

export interface QuestDetails {
  type: string;
  socials: QuestSocials;
  faqItems: FaqProps[];
  claimingIds: string[];
  rewardsIds: string[];
  rewardType: string;
  rewardRange: string;
  chains: Chain[];
  rewards: RewardsInterface;
  missionType: string;
  traits: string[];
  CTA: MerklOpportunity[];
  partner: { logo: string; name: string }[];
  marketIds?: string[];
  projectData: ProjectData;
  // To be used in the future to point to local links
  shouldOverrideWithInternalLink?: boolean;
}

export interface ExtendedQuest extends Quest {
  protocolInfos?: ProtocolInfo;
}

export interface ProtocolInfo {
  slug: string;
  chain: ChainId;
  tokens: string[];
  tvl: string;
  apys: ProtocolApys;
}

export interface ProtocolApys {
  total: number | string;
  tokens: ProtocolApyToken[];
}

export interface ProtocolApyToken {
  tokenAddress: string[];
  value: number;
}
