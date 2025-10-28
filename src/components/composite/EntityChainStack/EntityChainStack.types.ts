import { TypographyProps } from '@mui/material/Typography';
import {
  AvatarSize,
  AvatarStackDirection,
} from 'src/components/core/AvatarStack/AvatarStack.types';
import { Chain, Protocol, Token } from 'src/types/jumper-backend';
import { CacheToken } from 'src/types/portfolio';
import { ExtendedTokenAmountWithChain } from '@/utils/getTokens';

export interface BaseProps {
  chainsSize?: AvatarSize;
  chainsPlacement?: EntityChainStackChainsPlacement;
  chainsLimit?: number;
  isLoading?: boolean;
  spacing?: {
    main?: number;
    chains?: number;
    containerGap?: number;
    infoContainerGap?: number;
  };
  layout?: {
    direction?: AvatarStackDirection;
  };
  isContentVisible?: boolean;
  content?: {
    title?: string;
    titleVariant?: TypographyProps['variant'];
    descriptionVariant?: TypographyProps['variant'];
  };
}

export interface ProtocolChainStackProps extends BaseProps {
  protocol?: Protocol;
  chains?: Chain[];
  protocolSize?: AvatarSize;
}

export interface TokenChainStackProps extends BaseProps {
  tokens?: Token[];
  tokensSize?: AvatarSize;
}

export interface TokensWithChainsChainStackProps extends BaseProps {
  token?: CacheToken | ExtendedTokenAmountWithChain;
  tokenSize?: AvatarSize;
}

export enum EntityChainStackVariant {
  Protocol = 'protocol',
  Tokens = 'tokens',
  TokensWithChains = 'tokensWithChains',
}

export enum EntityChainStackChainsPlacement {
  Overlay = 'overlay',
  Inline = 'inline',
}

export type EntityChainStackProps =
  | ({ variant: EntityChainStackVariant.Protocol } & ProtocolChainStackProps)
  | ({ variant: EntityChainStackVariant.Tokens } & TokenChainStackProps)
  | ({
      variant: EntityChainStackVariant.TokensWithChains;
    } & TokensWithChainsChainStackProps);
