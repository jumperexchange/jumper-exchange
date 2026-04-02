import type { AvatarData } from '@/components/core/AvatarStack/AvatarStack.types';
import type { ExtendedChain } from '@lifi/sdk';
import type { CountEntity, DisplayableEntity } from './types';
import type { Token } from '@/types/tokens';
import { isExtendedToken, isPositionToken } from '@/types/tokens';
import type {
  Chain,
  App,
  Protocol,
  Token as BackendToken,
} from '@/types/jumper-backend';

export const isCountType = (e: DisplayableEntity): e is CountEntity =>
  'count' in e && typeof e.count === 'number';

// Type guards
export const isTokensType = (e: DisplayableEntity): e is Token =>
  'type' in e && ['base', 'extended', 'position', 'wallet'].includes(e.type);

export const isBackendToken = (e: DisplayableEntity): e is BackendToken =>
  'chain' in e && 'address' in e && !('type' in e);

/** Chain from jumper-backend (no logo) */
export const isChain = (e: DisplayableEntity): e is Chain =>
  'chainId' in e && 'chainKey' in e && !('address' in e) && !('logoURI' in e);

/** ExtendedChain from @lifi/sdk (has logoURI) */
export const isExtendedChain = (e: DisplayableEntity): e is ExtendedChain =>
  'id' in e && 'logoURI' in e && 'name' in e && !('address' in e);

export const isApp = (e: DisplayableEntity): e is App =>
  'key' in e && 'url' in e && !('chainId' in e);

export const isProtocol = (e: DisplayableEntity): e is Protocol =>
  'name' in e &&
  'logo' in e &&
  !('chainId' in e) &&
  !('key' in e) &&
  !('address' in e);

/**
 * Get chainId from any display token type.
 */
export const getTokenChainId = (token: Token): number | undefined => {
  if (isPositionToken(token)) {
    return token.chainId ?? token.chain?.chainId;
  }

  return token.chainId;
};

/**
 * Extract AvatarData from any displayable entity type.
 * Note: For Chain (no logo), use resolveChainAvatarData with useChains hook.
 */
export const getEntityAvatarData = (entity: DisplayableEntity): AvatarData => {
  if (isCountType(entity)) {
    return {
      count: entity.count,
    };
  }

  // Token
  if (isTokensType(entity)) {
    const chainId = getTokenChainId(entity);
    return {
      id: `${entity.address}-${chainId ?? 'unknown'}`,
      src: entity.logoURI,
      alt: entity.name || entity.symbol || entity.address,
    };
  }

  // BackendToken (from jumper-backend)
  if (isBackendToken(entity)) {
    return {
      id: `${entity.address}-${entity.chain.chainId}`,
      src: entity.logo,
      alt: entity.name || entity.symbol || entity.address,
    };
  }

  // ExtendedChain from @lifi/sdk (already has logoURI)
  if (isExtendedChain(entity)) {
    return {
      id: entity.id.toString(),
      src: entity.logoURI,
      alt: entity.name,
    };
  }

  // Chain from jumper-backend (no logo - needs resolution)
  if (isChain(entity)) {
    return {
      id: entity.chainId.toString(),
      src: undefined, // Must be resolved via useChains hook
      alt: entity.chainKey,
    };
  }

  // App
  if (isApp(entity)) {
    return {
      id: entity.key,
      src: entity.logo,
      alt: entity.key,
    };
  }

  // Protocol (fallback)
  return {
    id: entity.name,
    src: entity.logo,
    alt: entity.name,
  };
};

/**
 * Get chain ID from a displayable entity if it represents a chain.
 */
export const getEntityChainId = (
  entity: DisplayableEntity,
): string | undefined => {
  if (isChain(entity)) {
    return entity.chainId.toString();
  }
  if (isExtendedChain(entity)) {
    return entity.id.toString();
  }
  return undefined;
};

/**
 * Get address from a displayable entity if it has one.
 */
export const getEntityAddress = (
  entity: DisplayableEntity,
): string | undefined => {
  if (isTokensType(entity)) {
    return entity.address;
  }
  if (isBackendToken(entity)) {
    return entity.address;
  }
  return undefined;
};

/**
 * Get display name from any displayable entity type.
 */
export const getEntityName = (entity: DisplayableEntity): string => {
  if (isCountType(entity)) {
    return '';
  }
  if (isTokensType(entity)) {
    return entity.name || entity.symbol || entity.address;
  }
  if (isBackendToken(entity)) {
    return entity.name || entity.symbol || entity.address;
  }
  if (isExtendedChain(entity)) {
    return entity.name;
  }
  if (isChain(entity)) {
    return entity.chainKey;
  }
  if (isApp(entity)) {
    return entity.key;
  }
  return entity.name;
};
