import type { ChainId } from '@lifi/sdk';
import type { FeatureCardAttributes } from './strapi';

export interface SpindlCardAttributes extends FeatureCardAttributes {
  spindleData?: SpindlTrackData;
}

export interface SpindlCardData {
  id: number | string;
  attributes: SpindlCardAttributes;
}
export interface SpindlMediaAttributes {
  alternativeText?: string;
  width: number;
  height: number;
  url: string;
}

interface ImageVariant {
  url: string;
}

interface ImageVariants {
  '1x'?: ImageVariant;
  '2x'?: ImageVariant;
  orig: ImageVariant;
}

interface Advertiser {
  name: string;
  imageUrl: string;
}

interface CTA {
  title: string;
  href: string;
  hrefDisplay: string;
  color?: string;
}

export interface SpindlItem {
  id: string;
  type: string;
  impressionId: string;
  advertiserId: string;
  advertiser: Advertiser;
  placementSlug: string;
  title: string;
  titleColor?: string;
  mode?: 'light' | 'dark';
  context: string | null;
  description: string;
  descriptionColor?: string;
  imageUrl: string;
  imageVariants: ImageVariants;
  category: string;
  imageAltText: string;
  ctas: CTA[];
  spindlInfos?: SpindlInfos;
}

interface DebugInfo {
  requestId: string;
  ms: number;
}

export interface SpindlData {
  items: SpindlItem[];
  debug: DebugInfo;
}

interface Advertiser {
  name: string;
  imageUrl: string;
}

export interface SpindlInfos {
  impressionId: string;
  advertiserId: string;
  advertiser: Advertiser;
}

export interface SpindlTrackData {
  impression_id: string;
  ad_creative_id: string;
}

export interface SpindlFetchParams {
  country?: string;
  chainId?: ChainId;
  tokenAddress?: string;
  address?: string;
}

export interface SpindlFetchResult {
  data?: any;
}
