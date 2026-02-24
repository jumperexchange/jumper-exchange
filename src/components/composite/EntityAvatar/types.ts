import type { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import type { ExtendedChain } from '@lifi/sdk';
import type { PortfolioToken, Token } from '@/types/tokens';
import type {
  Chain,
  App,
  Protocol,
  Token as BackendToken,
} from '@/types/jumper-backend';

export interface CountEntity {
  count: number;
}

/**
 * Union of all entity types that can be displayed as avatars.
 *
 * Note: Chain (from jumper-backend) has no logo - components will
 * resolve via useChains hook. ExtendedChain (from @lifi/sdk) already
 * has logoURI and can be passed directly.
 */
export type DisplayableEntity =
  | PortfolioToken
  | Token
  | BackendToken
  | Chain
  | ExtendedChain
  | App
  | Protocol
  | CountEntity;

export interface EntityAvatarProps {
  entity: DisplayableEntity;
  size?: AvatarSize;
  disableBorder?: boolean;
}
