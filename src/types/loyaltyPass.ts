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
  walletId: string | null;
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
  path: string | null;
  size: number;
  width: number;
  height: number;
};

type ImageAttributes = {
  name: string;
  alternativeText: string | null;
  caption: string | null;
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
  previewUrl: string | null;
  provider: string;
  createdAt: string;
  updatedAt: string;
};

type ImageData = {
  id: number;
  attributes: ImageAttributes;
};

type QuestsPlatformAttributes = {
  Name: string;
  WebsiteLink: string;
  Description: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};

type QuestsPlatformData = {
  id: number;
  attributes: QuestsPlatformAttributes;
};

type QuestAttributes = {
  UID: string;
  Title: string;
  Description: string | null;
  Link: string;
  Type: string | null;
  Points: number;
  EndDate: string | null;
  StartDate: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
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
  [key: string]: any;
}

export interface LoyaltyPassState extends LoyaltyPassProps {
  storeLoyaltyPassData: (
    address: string,
    points: number,
    tier: string,
    pdas: PDA[],
    time: number,
  ) => void;
}
