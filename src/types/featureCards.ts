/* Feature-Cards */
interface FeatureCardDisplayConditions {
  id: string;
  mode: string;
  showOnce?: boolean;
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
    data: MediaAttributes;
  };
  BackgroundImageDark: {
    data: MediaAttributes;
  };
  localizations: {
    data: any[];
  };
}

export interface StrapiImageData {
  data: MediaAttributes;
}

export interface TagData {
  data: TagAttributes[];
}
interface TagAttributes {
  attributes: {
    Title: string;
    createdAt: string;
    locale: string;
    publishedAt: string | null;
    updatedAt: string;
  };
  id: number;
}

/* Blog */
export interface BlogArticleAttributes {
  Title: string;
  Subtitle: string;
  Content: string;
  Image: StrapiImageData;
  Slug: string;
  createdAt: string;
  updatedAt: string;
  tags: TagData;
  publishedAt: string | null;
  locale: string;
  localizations: {
    data: any[];
  };
}

/* Strapi */
interface MediaFormat {
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

interface MediaAttributes {
  id: number;
  attributes: {
    name: string;
    alternativeText: string | undefined;
    caption: string | null;
    width: number;
    height: number;
    formats: {
      [key: string]: MediaFormat;
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

export interface FeatureCardData {
  id: number;
  attributes: FeatureCardAttributes;
}

export interface BlogArticleData {
  id: number;
  attributes: BlogArticleAttributes;
}

interface StrapiMeta {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface StrapiResponse {
  data: BlogArticleData[] | FeatureCardData[];
  meta: StrapiMeta;
}
