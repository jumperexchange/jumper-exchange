import type { RootNode } from '@strapi/blocks-react-renderer/dist/BlocksRenderer';

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

interface StrapiMeta {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export type StrapiResponseData<T> = T[];

// export type StrapiResponseData =
//   | BlogArticleData[]
//   | FeatureCardData[]
//   | FaqMeta[];

export interface StrapiResponse<T> {
  data: StrapiResponseData<T>;
  meta: StrapiMeta;
}

export interface StrapiImageData {
  data: MediaAttributes;
}

/* Feature-Cards */
export interface FeatureCardData {
  id: number;
  attributes: FeatureCardAttributes;
}
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
  BackgroundImageLight: MediaAttributes;
  BackgroundImageDark: MediaAttributes;
  localizations: {
    data: any[];
  };
}

/* Tags */
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

/* FAQ-Items */
interface FaqItemAttributes {
  Question: string;
  Answer: RootNode[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  displayOnBlogPage: boolean;
}

export interface FaqMeta {
  id: number;
  attributes: FaqItemAttributes;
}

export interface FaqData {
  data: FaqMeta[];
}

/* Author */
export interface AuthorData {
  attributes: any;
  data: AuthorAttributes;
}
interface AuthorAttributes {
  attributes: {
    Name: string;
    createdAt: string;
    publishedAt: string | null;
    updatedAt: string;
    Avatar: MediaAttributes;
    Role: string;
  };
  id: number;
}

/* Blog */
export interface BlogArticleData {
  id: number;
  attributes: BlogArticleAttributes;
}
export interface BlogArticleAttributes {
  Title: string;
  Subtitle: string;
  Content: RootNode[];
  Image: StrapiImageData;
  Slug: string;
  createdAt: string;
  updatedAt: string;
  tags: TagData;
  author: AuthorData;
  faq_items: FaqMeta[];
  publishedAt: string | null;
  locale: string;
  localizations: {
    data: any[];
  };
}
