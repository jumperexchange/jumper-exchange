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

export interface AvatarData {
  id: string;
  src?: string;
  alt: string;
}
