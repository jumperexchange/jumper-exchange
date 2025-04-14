import type { WidgetConfig } from '@lifi/widget';
import type { RootNode } from 'node_modules/@strapi/blocks-react-renderer/dist/BlocksRenderer';
import type { SpindlCardData, SpindlMediaAttributes } from './spindl';

/* Strapi */
export interface ImageData<T> {
  data: T;
}

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

export interface StrapiMediaData extends StrapiMediaAttributes {
  id: string;
  documentId: string;
  // attributes: StrapiMediaAttributes;
}

type MediaAttributes = SpindlMediaAttributes | StrapiMediaAttributes;

export interface StrapiMediaAttributes {
  id: string;
  documentId: string;
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

export type FeatureCardData = StrapiFeatureCardData | SpindlCardData;

/* Feature-Cards */
export interface StrapiFeatureCardData extends FeatureCardAttributes {
  id: number;
  documentId: string;
  // attributes: FeatureCardAttributes;
}

interface FeatureCardDisplayConditions {
  mode?: string;
  showOnce?: boolean;
}

interface FeatureCardExclusion extends Pick<FeatureCardAttributes, 'uid'> {
  id: number;
  documentId: string;
  // attributes: Pick<FeatureCardAttributes, 'uid'>;
}

export interface FeatureCardAttributes {
  Title: string;
  Subtitle: string;
  CTACall: string;
  URL: string;
  TitleColor?: string;
  CTAColor?: string;
  SubtitleColor?: string;
  DisplayConditions: FeatureCardDisplayConditions;
  createdAt: string;
  updatedAt: string;
  PersonalizedFeatureCard?: boolean;
  publishedAt?: string;
  locale: string;
  uid: string;
  BackgroundImageLight?: MediaAttributes;
  BackgroundImageDark?: MediaAttributes;
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
  feature_cards: { data: StrapiFeatureCardData[] };
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
  documentId: string;
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
  documentId: string;
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
  documentId: string;
}

export interface AvatarItem extends AvatarData {
  // data: AvatarData;
}

export interface AvatarData extends StrapiMediaAttributes {
  id: string;
  documentId: string;
  // attributes: StrapiMediaAttributes;
}

/* Blog */
export interface BlogArticleData extends BlogArticleAttributes {
  id: number;
  documentId: string;
  // attributes: BlogArticleAttributes;
}

export interface BlogArticleAttributes {
  Title: string;
  Subtitle: string;
  Content: RootNode[];
  Image: StrapiMediaData;
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
  documentId: string;
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

type WidgetConfigProps = Omit<WidgetConfig, 'integrator'> &
  Partial<Pick<WidgetConfig, 'integrator'>>;

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
  BackgroundImageLight: StrapiMediaData;
  BackgroundImageDark: StrapiMediaData;
  FooterImageLight: StrapiMediaData;
  FooterImageDark: StrapiMediaData;
  LogoLight: StrapiMediaData;
  LogoDark: StrapiMediaData;
  BackgroundColorLight?: string;
  BackgroundColorDark?: string;
  Bridges: RepeatableComponent[];
  Exchanges: RepeatableComponent[];
}

interface TaskVerification {
  name: string;
  task: any; // Custom field type
  description: string;
  CTALink: string;
  CTAText: string;
}

/* Quest */
export interface QuestData {
  id: number;
  documentId: string;
  UID: string;
  Title: string;
  Description: string;
  Link: string;
  Image?: StrapiMediaData;
  Category: string | null;
  Points: number | null;
  EndDate: string;
  quests_platform?: any; // Relation with Quests Platforms
  StartDate: string;
  Slug: string;
  Label: string;
  Steps: RootNode[];
  Information: string | null;
  CustomInformation: any;
  BannerImage?: StrapiMediaData;
  ClaimingId: string | null;
  Subtitle: string | null;
  tasks_verification?: TaskVerification[];
  campaign?: CampaignData; // Relation with Campaign
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface ClaimableRewards {
  rewards_list: ClaimableTokens[];
}

export interface ClaimableTokens {
  chainId: string;
  tokenChainId: number;
  claimingAddress: string;
  tokenAddress: string;
  decimalsToShow: number;
  explorerLink: string;
  lightTokenLogo: string;
  darkTokenLogo: string;
  lightChainLogo: string;
  darkChainLogo: string;
}

/* Campaign */
export interface CampaignData extends CampaignAttributes {
  id: number;
  documentId: string;
}

export interface CampaignAttributes {
  Title: string;
  Description: string;
  BenefitLabel?: string;
  BenefitValue?: string;
  BenefitColor?: string;
  InfoUrl: string;
  XUrl: string;
  Slug: string;
  Background: StrapiMediaData;
  Icon: StrapiMediaData;
  quests: QuestData[];
  LightMode?: boolean;
  StartDate: string;
  EndDate: string;
  ProfileBannerTitle?: string;
  ProfileBannerDescription?: string;
  ProfileBannerBadge?: string;
  ProfileBannerCTA?: string;
  ProfileBannerImage?: StrapiMediaData;
  ShowProfileBanner: boolean;
  ClaimableTokens?: ClaimableRewards;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}
