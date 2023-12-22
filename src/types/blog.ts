interface BlogDisplayConditions {
  id: string;
  mode: string;
  showOnce?: boolean;
}

interface BlogFormat {
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

interface BlogMedia {
  id: number;
  attributes: {
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: {
      [key: string]: BlogFormat;
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

interface BlogAttributes {
  Title: string;
  Subtitle: string;
  CTACall: string;
  URL: string;
  TitleColor: string | null;
  CTAColor: string | null;
  DisplayConditions: BlogDisplayConditions;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  locale: string;
  BackgroundImageLight: {
    data: BlogMedia;
  };
  BackgroundImageDark: {
    data: BlogMedia;
  };
  localizations: {
    data: any[];
  };
}

export interface BlogData {
  id: number;
  attributes: BlogAttributes;
}

interface BlogMeta {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface BlogResponse {
  data: BlogData[];
  meta: BlogMeta;
}
