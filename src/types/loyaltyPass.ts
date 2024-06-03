// ----------------------------------------------------------------------

// PDA Type

type Claim = {
  points: number;
  tier: string;
  transactions?: number;
  chains?: number;
  volume?: string;
};

type Owner = {
  gatewayId: string;
  walletId?: string;
};

type DataModel = {
  id: string;
};

type DataAsset = {
  claim: Claim;
  title: string;
  description: string;
  image: string;
  dataModel: DataModel;
  owner: Owner;
};

export interface PDA {
  id: string;
  status: string;
  ownerHash: string;
  dataAsset: DataAsset;
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

type ImageAttributes = {
  name: string;
  alternativeText?: string;
  caption?: string;
  width: number;
  height: number;
  formats: {
    thumbnail: ImageFormatThumbnail;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
};

type ImageData = {
  data: {
    id: number;
    attributes: ImageAttributes;
  };
};

type QuestsPlatformAttributes = {
  Name: string;
  WebsiteLink: string;
  Description?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  Logo: ImageData;
};

type QuestsPlatformData = {
  data: { id: number; attributes: QuestsPlatformAttributes };
};

type QuestAttributes = {
  UID: string;
  Title: string;
  Description?: string;
  Link: string;
  Type?: string;
  Points: number;
  EndDate?: string;
  StartDate?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  Image: ImageData;
  quests_platform: QuestsPlatformData;
};

export interface Quest {
  id: number;
  attributes: QuestAttributes;
}

export interface LoyaltyPassProps {
  address?: string;
  points?: number;
  tier?: string;
  pdas?: PDA[];
  time?: number;
  timestamp: number;
}

export interface LoyaltyPassState extends LoyaltyPassProps {
  setLoyaltyPassData: (
    address: string,
    points: number,
    tier: string,
    pdas: PDA[],
    time: number,
  ) => void;
}

export interface LevelData {
  level: number;
  minPoints: number;
  maxPoints: number;
}
