import type { ChainId } from '@lifi/sdk';
import type { FaqProps } from 'src/components/AccordionFAQ';
import type { Quest } from './loyaltyPass';
import type { ProjectData } from 'src/components/ZapWidget/ZapWidget';

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
  projectData: ProjectData;
}

export interface ExtendedQuest extends Quest {
  protocolInfos?: ProtocolInfo;
}

export interface ProtocolInfo {
  slug: string;
  chain?: ChainId;
  tokens?: string[];
  tvl?: string;
  apys?: ProtocolApys;
}

export interface ProtocolApys {
  total: number | string;
  tokens: ProtocolApyToken[];
}

export interface ProtocolApyToken {
  tokenAddress: string[];
  value: number;
}
