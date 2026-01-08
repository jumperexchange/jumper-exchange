import type { TypographyProps } from '@mui/material/Typography';
import type {
  AvatarSize,
  AvatarStackDirection,
} from 'src/components/core/AvatarStack/AvatarStack.types';
import type { Chain, Protocol, Token } from 'src/types/jumper-backend';
import type { PortfolioToken } from 'src/types/tokens';

export interface BaseProps {
  chainsSize?: AvatarSize;
  chainsLimit?: number;
  chainsPlacement?: EntityChainStackChainsPlacement;
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

export enum EntityChainStackChainsPlacement {
  Overlay = 'overlay',
  Inline = 'inline',
}

export interface ProtocolChainStackProps extends BaseProps {
  address?: string;
  protocol?: Protocol;
  chains?: Chain[];
  protocolSize?: AvatarSize;
  protocolLimit?: number;
}

export interface TokenChainStackProps extends BaseProps {
  tokens?: Token[];
  tokensSize?: AvatarSize;
  tokensLimit?: number;
}

export interface TokenWithChainsChainStackProps extends BaseProps {
  token?: PortfolioToken;
  tokenSize?: AvatarSize;
  chainsInlineSize?: AvatarSize;
}

export enum EntityChainStackVariant {
  Protocol = 'protocol',
  Tokens = 'tokens',
  TokenWithChains = 'tokensWithChains',
}

export type EntityChainStackProps =
  | ({ variant: EntityChainStackVariant.Protocol } & ProtocolChainStackProps)
  | ({ variant: EntityChainStackVariant.Tokens } & TokenChainStackProps)
  | ({
      variant: EntityChainStackVariant.TokenWithChains;
    } & TokenWithChainsChainStackProps);
