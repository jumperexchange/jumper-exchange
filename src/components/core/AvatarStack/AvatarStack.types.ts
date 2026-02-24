import type { SxProps, Theme } from '@mui/material/styles';
import type { TypographyProps } from '@mui/material/Typography';

export enum AvatarSize {
  '3XS' = '3xs',
  XXS = 'xxs',
  XS = 'xs',
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
  XXL = 'xxl',
}

export type AvatarStackDirection =
  | 'row'
  | 'column'
  | 'row-reverse'
  | 'column-reverse';

export type AvatarOverlap = 'left' | 'right' | 'top' | 'bottom' | 'none';

export interface AvatarImageProps {
  id: string;
  src?: string;
  alt: string;
}

export interface AvatarCountProps {
  count: number;
  variant?: TypographyProps['variant'];
  startAdornment?: number | string;
  endAdornment?: number | string;
}

export type AvatarData = AvatarImageProps | AvatarCountProps;

export interface AvatarItemProps {
  avatar: AvatarData;
  size?: AvatarSize;
  spacing?: number;
  overlap?: AvatarOverlap;
  sx?: SxProps<Theme>;
}

export type AvatarImageItemProps = Omit<AvatarItemProps, 'avatar'> & {
  avatar: AvatarImageProps;
};

export type AvatarCountItemProps = Omit<AvatarItemProps, 'avatar'> & {
  avatar: AvatarCountProps;
};
