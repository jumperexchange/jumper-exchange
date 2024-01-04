interface FeatureCardDisplayConditions {
  id: string;
  mode: string;
  showOnce?: boolean;
}

interface FeatureCardFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  url: string;
}

interface FeatureCardMedia {
  id: number;
  attributes: {
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: {
      [key: string]: FeatureCardFormat;
    };
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

interface FeatureCardAttributes {
  Title: string;
  Subtitle: string;
  CTACall: string;
  URL: string;
  TitleColor: string | null;
  CTAColor: string | null;
  DisplayConditions: FeatureCardDisplayConditions;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  locale: string;
  BackgroundImageLight: {
    data: FeatureCardMedia;
  };
  BackgroundImageDark: {
    data: FeatureCardMedia;
  };
  localizations: {
    data: any[];
  };
}

export interface FeatureCardData {
  id: number;
  attributes: FeatureCardAttributes;
}

interface FeatureCardMeta {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface FeatureCardResponse {
  data: FeatureCardData[];
  meta: FeatureCardMeta;
}
