import { ReactNode } from 'react';
import type { StrapiMediaAttributes } from '@/types/strapi';
import {
  TrackingCategory,
  TrackingAction,
  TrackingEventParameter,
} from 'src/const/trackingKeys';
import { SxProps, Theme } from '@mui/material/styles';

export enum RichBlocksVariant {
  BlogArticle = 'blogArticle',
  Mission = 'mission',
}

export interface HeadingProps {
  children?: ReactNode;
  level: number;
  [key: string]: any;
}

export interface ParagraphProps {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  content?: {
    type: string;
    url: string;
    children: Array<{ text: string }>;
  };
  [key: string]: any;
}

export interface QuoteProps {
  children: Array<{ text: string }>;
  [key: string]: any;
}

export interface ImageProps {
  image: StrapiMediaAttributes;
}

export interface TrackingKeys {
  cta?: {
    category: TrackingCategory;
    action: TrackingAction;
    label: string;
    data: {
      [key in TrackingEventParameter]: string;
    };
  };
}

export interface CommonBlockProps {
  variant?: RichBlocksVariant;
  sx?: SxProps<Theme>;
}
