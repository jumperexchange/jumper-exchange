interface BannerMedia {
  id: number;
  attributes: {
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: any;
    createdAt: string;
    updatedAt: string;
  };
}

interface BannerAttributes {
  Title: string;
  BackgroundColor: string;
  UniqueId: string;
  Enabled: boolean;
  ShowToAll: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  locale: string;
  Image: {
    data: BannerMedia;
  };
  BackgroundImage: {
    data: BannerMedia;
  };
}

export interface BannerData {
  id: number;
  attributes: BannerAttributes;
}
