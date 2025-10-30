import { Token } from 'src/types/jumper-backend';
import { MinimalToken } from 'src/types/tokens';

export enum TokenListCardTokenSize {
  SM = 'sm',
  MD = 'md',
}

export interface TokenListCardProps {
  token: MinimalToken;
  size?: TokenListCardTokenSize;
  onSelect?: (token: MinimalToken) => void;
}
