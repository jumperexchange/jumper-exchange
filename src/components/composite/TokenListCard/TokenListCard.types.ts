import type { MinimalToken } from 'src/types/tokens';

export type ResponsiveValue<T> = T | { mobile: T; desktop: T };

export enum TokenListCardTokenSize {
  SM = 'sm',
  MD = 'md',
}

export interface TokenListCardProps {
  token: MinimalToken;
  size?: TokenListCardTokenSize;
  onSelect?: (token: MinimalToken) => void;
}
