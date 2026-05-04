// Two EIP-712 typed-data payloads the user's wallet signs before the Bundler3
// multicall: Morpho's Authorization (grants the GeneralAdapter1 permission to
// borrow on the user's behalf) and Uniswap Permit2's PermitSingle (grants the
// GeneralAdapter1 permission to pull the initial collateral).

import type { Address, Hex } from 'viem';
import { getLoopoorChainConfig, PERMIT2_ADDRESS } from './constants';

export const MORPHO_AUTHORIZATION_TYPES = {
  Authorization: [
    { name: 'authorizer', type: 'address' },
    { name: 'authorized', type: 'address' },
    { name: 'isAuthorized', type: 'bool' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
  ],
} as const;

export const PERMIT2_TYPES = {
  PermitSingle: [
    { name: 'details', type: 'PermitDetails' },
    { name: 'spender', type: 'address' },
    { name: 'sigDeadline', type: 'uint256' },
  ],
  PermitDetails: [
    { name: 'token', type: 'address' },
    { name: 'amount', type: 'uint160' },
    { name: 'expiration', type: 'uint48' },
    { name: 'nonce', type: 'uint48' },
  ],
} as const;

export type MorphoAuthorization = {
  authorizer: Address;
  authorized: Address;
  isAuthorized: boolean;
  nonce: bigint;
  deadline: bigint;
};

export type Permit2Details = {
  token: Address;
  amount: bigint;
  expiration: number;
  nonce: number;
};

export type Permit2Single = {
  details: Permit2Details;
  spender: Address;
  sigDeadline: bigint;
};

export type EIP712Domain = {
  name: string;
  chainId: number;
  verifyingContract: Address;
};

export type TypedDataPayload<TTypes, TPrimary extends string, TMessage> = {
  domain: EIP712Domain;
  types: TTypes;
  primaryType: TPrimary;
  message: TMessage;
};

export type MorphoAuthorizationTypedData = TypedDataPayload<
  typeof MORPHO_AUTHORIZATION_TYPES,
  'Authorization',
  MorphoAuthorization
>;

export type Permit2TypedData = TypedDataPayload<
  typeof PERMIT2_TYPES,
  'PermitSingle',
  Permit2Single
>;

export type BuildMorphoAuthorizationInput = {
  chainId: number;
  user: Address;
  nonce: bigint;
  deadline: bigint;
};

export function buildMorphoAuthorizationTypedData(
  input: BuildMorphoAuthorizationInput,
): MorphoAuthorizationTypedData {
  const { chainId, user, nonce, deadline } = input;
  const config = getLoopoorChainConfig(chainId);

  const message: MorphoAuthorization = {
    authorizer: user,
    authorized: config.generalAdapter1,
    isAuthorized: true,
    nonce,
    deadline,
  };

  return {
    domain: {
      name: 'Morpho',
      chainId,
      verifyingContract: config.morpho,
    },
    types: MORPHO_AUTHORIZATION_TYPES,
    primaryType: 'Authorization',
    message,
  };
}

export type BuildPermit2TypedDataInput = {
  chainId: number;
  token: Address;
  amount: bigint;
  expiration: number;
  nonce: number;
  sigDeadline: bigint;
};

export function buildPermit2TypedData(
  input: BuildPermit2TypedDataInput,
): Permit2TypedData {
  const { chainId, token, amount, expiration, nonce, sigDeadline } = input;
  const config = getLoopoorChainConfig(chainId);

  const message: Permit2Single = {
    details: { token, amount, expiration, nonce },
    spender: config.generalAdapter1,
    sigDeadline,
  };

  return {
    domain: {
      name: 'Permit2',
      chainId,
      verifyingContract: PERMIT2_ADDRESS,
    },
    types: PERMIT2_TYPES,
    primaryType: 'PermitSingle',
    message,
  };
}

export type MorphoSignatureParts = { v: number; r: Hex; s: Hex };

// Split a 65-byte (r || s || v) hex signature into Morpho's expected
// (v, r, s) tuple.
export function splitMorphoSignature(rawSig: Hex): MorphoSignatureParts {
  const hex = rawSig.startsWith('0x') ? rawSig.slice(2) : rawSig;
  if (hex.length !== 130) {
    throw new Error(
      `Loopoor: expected a 65-byte EIP-712 signature (130 hex chars), got ${hex.length}`,
    );
  }
  const r = `0x${hex.slice(0, 64)}` as Hex;
  const s = `0x${hex.slice(64, 128)}` as Hex;
  const v = Number.parseInt(hex.slice(128, 130), 16);
  if (v !== 27 && v !== 28) {
    throw new Error(`Loopoor: unexpected signature v byte ${v}, want 27 or 28`);
  }
  return { v, r, s };
}
