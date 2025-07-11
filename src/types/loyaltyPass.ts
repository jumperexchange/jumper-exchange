import type { QuestDetails } from '@/types/questDetails';
import { type RootNode } from 'node_modules/@strapi/blocks-react-renderer/dist/BlocksRenderer';
import type {
  CampaignData,
  StrapiMediaData,
  TaskType,
  TaskWidgetInformationData,
} from './strapi';

// PDA Type
export interface Reward {
  description: string;
  image: string;
  id: number;
  name: string;
  type: string;
}

export interface PDA {
  id: string;
  points: number;
  subValue: number;
  timestamp: Date;
  reward: Reward;
}

export interface Trait {
  id: number;
  timestamp: string;
  category: string;
  subCategory: string;
  criteria: string;
  trait: {
    id: number;
    timestamp: string;
    name: string;
    description: string | null;
    type: string;
    imageURI: string | null;
  };
}

// Quest Type
type ImageFormatThumbnail = {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path?: string;
  size: number;
  width: number;
  height: number;
};

type ImageAttributes = StrapiMediaData;

type BannerImageData = {
  id: number;
  documentId: string;
} & ImageAttributes;

type QuestsPlatformAttributes = {
  Name: string;
  WebsiteLink: string;
  Description?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  Logo: StrapiMediaData;
};

type QuestsPlatformData = { id: number } & QuestsPlatformAttributes;

export interface QuestChains {
  name: string;
  logo: string;
  chainId?: number;
}

export interface CustomInformation {
  chains: QuestChains[];

  [key: string]: any;
}

export type QuestAttributes = {
  UID: string;
  Title: string;
  Description?: string;
  Link: string;
  Category?: string;
  Points: number;
  EndDate?: string;
  StartDate?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  Slug: string;
  Label?: string;
  Information?: string;
  ClaimingId?: string;
  Subtitle?: string;
  Steps?: RootNode[];
  CustomInformation?: QuestDetails; // JSON object that can change and where type is not enforced inside Strapi yet.
  Image: StrapiMediaData;
  BannerImage: BannerImageData[];
  quests_platform: QuestsPlatformData;
  tasks_verification: TaskVerification[];
};

export interface RewardGroup {
  value: string | number;
  label: string;
  avatarUrl?: string;
}

export interface ParticipantChain {
  avatarUrl: string;
  label: string;
  id: number;
}

export interface TaskVerification {
  id: number;
  name: string;
  description: string;
  CTALink?: string;
  CTAText?: string;
  CampaignId?: string;
  uuid: string;
  hasTask: boolean;
  isRequired?: boolean;
  // @TODO this becomes required once strapi change is pushed
  TaskType?: TaskType;
  TaskWidgetInformation?: TaskWidgetInformationData;
}

export interface TaskVerificationWithApy extends TaskVerification {
  maxApy?: number;
}

export interface Quest extends QuestAttributes {
  id: number;
  documentId: string;
  campaign?: CampaignData;
}

export interface LoyaltyPassProps {
  address?: string;
  points?: number;
  level?: string;
  pdas?: PDA[];
  time?: number;
  timestamp: number;
}

export interface LoyaltyPassState extends LoyaltyPassProps {
  setLoyaltyPassData: (
    address: string,
    points: number,
    level: string,
    pdas: PDA[],
    time: number,
  ) => void;
  reset: () => void;
}

export interface LevelData {
  level?: number;
  minPoints: number;
  maxPoints: number;
}
