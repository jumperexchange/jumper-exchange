import { PropsWithChildren } from 'react';

export enum PercentSize {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
  XXL = 'xxl',
}

export interface PercentProps extends PropsWithChildren {
  percent: number;
  size: PercentSize;
}
