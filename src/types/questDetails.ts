import type { ChainId } from '@lifi/sdk';
import type { FaqProps } from 'src/components/AccordionFAQ';
import type { RewardsInterface } from 'src/components/ProfilePage/QuestCard/QuestCard';
import { CTALinkInt } from 'src/components/QuestPage/CTA/MissionCTA';
import type { Quest } from './loyaltyPass';

export interface QuestSocials {
  twitter: string;
  telegram: string;
  website?: string;
}

export interface Chain {
  logo: string;
  name: string;
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
  CTA: CTALinkInt[];
  partner: { logo: string; name: string }[];
  marketIds?: string[];
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
