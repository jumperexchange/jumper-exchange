import type { ChainId } from '@lifi/sdk';
import type { FaqProps } from 'src/components/AccordionFAQ';
import type { Quest } from './loyaltyPass';
import type { Chain } from '@/components/Superfest/SuperfestPage/Banner/Banner';
import type { CTALinkInt } from '@/components/Superfest/SuperfestPage/CTA/MissionCTA';
import { RewardsInterface } from 'src/components/ProfilePage/QuestCard/QuestCard';

export interface QuestSocials {
  twitter: string;
  telegram: string;
  website?: string;
}
// Define interfaces for the nested structures
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
}

export interface ExtendedQuest extends Quest<never> {
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
