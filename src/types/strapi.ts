import type { WidgetConfig } from '@lifi/widget';
import type { RootNode } from 'node_modules/@strapi/blocks-react-renderer/dist/BlocksRenderer';

/* Strapi */
interface MediaFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path?: string;
  width: number;
  height: number;
  size: number;
  url: string;
}

export interface MediaData extends MediaAttributes {
  id: number;
  // attributes: MediaAttributes;
}

export interface MediaAttributes {
  name: string;
  alternativeText: string | undefined;
  caption?: string;
  width: number;
  height: number;
  formats: {
    small: MediaFormat;
    medium: MediaFormat;
    large: MediaFormat;
    thumbnail: MediaFormat;
    [key: string]: MediaFormat; // Allow additional formats
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  provider_metadata: any;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiMeta {
  pagination: StrapiMetaPagination;
}

export interface StrapiMetaPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export type StrapiResponseData<T> = T[];

export interface StrapiResponse<T> {
  data: StrapiResponseData<T>;
  meta: StrapiMeta;
}

export interface StrapiImageData {
  data: MediaData;
}

/* Feature-Cards */
export interface FeatureCardData extends FeatureCardAttributes {
  id: number;
  // attributes: FeatureCardAttributes;
}

interface FeatureCardDisplayConditions {
  mode: string;
  showOnce?: boolean;
}

interface FeatureCardExclusion extends Pick<FeatureCardAttributes, 'uid'> {
  id: number;
  // attributes: Pick<FeatureCardAttributes, 'uid'>;
}

interface FeatureCardAttributes {
  Title: string;
  Subtitle: string;
  CTACall: string;
  URL: string;
  TitleColor?: string;
  CTAColor?: string;
  DisplayConditions: FeatureCardDisplayConditions;
  createdAt: string;
  updatedAt: string;
  PersonalizedFeatureCard?: boolean;
  publishedAt?: string;
  locale: string;
  uid: string;
  BackgroundImageLight: MediaData;
  BackgroundImageDark: MediaData;
  featureCardsExclusions?: FeatureCardExclusion[];

  localizations: {
    data: any[];
  };
}

/* Jumper User */
export interface JumperUserData extends JumperUserAttributes {
  id: number;
  // attributes: JumperUserAttributes;
}

interface JumperUserAttributes {
  EvmWalletAddress?: string;
  SolWalletAddress?: string;
  PersonalizedContent?: object;
  feature_cards: { data: FeatureCardData[] };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

/* Tags */
export interface TagData {
  data: TagAttributes[];
}
export interface TagAttributes {
  // attributes: {
  Title: string;
  TextColor?: string;
  Key: string;
  BackgroundColor?: string;
  blog_articles: BlogArticleData[];
  createdAt: string;
  locale: string;
  publishedAt?: string;
  updatedAt: string;
  // };
  id: number;
}

/* FAQ-Items */
interface FaqItemAttributes {
  Question: string;
  Answer: RootNode[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  displayOnBlogPage: boolean;
}

export interface FaqMeta extends FaqItemAttributes {
  id: number;
  attributes: FaqItemAttributes;
}

export interface FaqData {
  data: FaqMeta[];
}

/* Author */
export interface AuthorData extends AuthorAttributes {
  // attributes: any;
  // data: AuthorAttributes;
}
interface AuthorAttributes {
  // attributes: {
  Name: string;
  createdAt: string;
  publishedAt?: string;
  updatedAt: string;
  Avatar: AvatarItem;
  Role?: string;
  Bio?: string;
  Twitter?: string;
  LinkedIn?: string;
  // };
  id: number;
}

export interface AvatarItem extends AvatarData {
  // data: AvatarData;
}

export interface AvatarData extends MediaAttributes {
  id: number;
  // attributes: MediaAttributes;
}

/* Blog */
export interface BlogArticleData extends BlogArticleAttributes {
  id: number;
  // attributes: BlogArticleAttributes;
}
export interface BlogArticleAttributes {
  Title: string;
  Subtitle: string;
  Content: RootNode[];
  Image: MediaData;
  Slug: string;
  createdAt: string;
  updatedAt: string;
  tags: TagAttributes[];
  author: AuthorData;
  faq_items: FaqData;
  publishedAt?: string;
  locale: string;
  RedirectURL?: string;
  localizations: {
    data: any[];
  };
}

export interface PartnerThemesData extends PartnerThemesAttributes {
  id: number;
  // attributes: PartnerThemesAttributes;
}

export interface Customization {
  palette: { [colorName: string]: { main: string } };
  logoName?: string;
  footerBannerUrl?: string;
  typography?: string;
  hasBackgroundGradient?: boolean;
  hasBlurredNavigation?: boolean;
}

type WidgetConfigProps = Omit<WidgetConfig, 'integrator'>;

export interface PartnerTheme {
  config: WidgetConfigProps;
  customization?: Customization;
}

// TODO: Make it dynamic
interface RepeatableComponent {
  id: number;
  key: string;
}

export interface PartnerThemesAttributes {
  PartnerName: string;
  lightConfig?: PartnerTheme;
  darkConfig?: PartnerTheme;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  darkModeEnabled: boolean;
  uid: string;
  SelectableInMenu?: boolean;
  PartnerURL?: URL;
  BackgroundImageLight: MediaData;
  BackgroundImageDark: MediaData;
  FooterImageLight: MediaData;
  FooterImageDark: MediaData;
  LogoLight: MediaData;
  LogoDark: MediaData;
  BackgroundColorLight?: string;
  BackgroundColorDark?: string;
  Bridges: RepeatableComponent[];
  Exchanges: RepeatableComponent[];
}
