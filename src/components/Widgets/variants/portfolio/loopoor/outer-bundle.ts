// Outer bundle — 7 calls, submitted as a single `Bundler3.multicall` from the
// user's EOA. Call 5 wraps the inner bundle in a flash loan and carries a
// non-zero `callbackHash` that commits to the exact inner bundle bytes; every
// other entry has `callbackHash = ZERO_HASH`.

import { type Address, encodeFunctionData, type Hex } from 'viem';
import { GENERAL_ADAPTER_1_ABI, MORPHO_ABI, PERMIT2_ABI } from './abis';
import {
  type Bundler3Call,
  computeCallbackHash,
  encodeBundle,
} from './callback-hash';
import {
  getLoopoorChainConfig,
  MAX_UINT256,
  PERMIT2_ADDRESS,
  ZERO_HASH,
} from './constants';
import type { MorphoMarketParams } from './market-params';
import type {
  MorphoAuthorization,
  MorphoSignatureParts,
  Permit2Single,
} from './signatures';

export type BuildOuterBundleInput = {
  chainId: number;
  user: Address;
  market: MorphoMarketParams;
  initialCollateral: bigint;
  morphoAuth: MorphoAuthorization;
  morphoSig: MorphoSignatureParts;
  permit2: Permit2Single;
  permit2Sig: Hex;
  innerBundle: Bundler3Call[];
  flashLoanAmount: bigint;
};

export function buildOuterBundle(input: BuildOuterBundleInput): Bundler3Call[] {
  const {
    chainId,
    user,
    market,
    initialCollateral,
    morphoAuth,
    morphoSig,
    permit2,
    permit2Sig,
    innerBundle,
    flashLoanAmount,
  } = input;
  const { morpho, generalAdapter1 } = getLoopoorChainConfig(chainId);

  // 1 — setAuthorizationWithSig on Morpho.
  const call_1: Bundler3Call = {
    to: morpho,
    value: 0n,
    skipRevert: false,
    callbackHash: ZERO_HASH,
    data: encodeFunctionData({
      abi: MORPHO_ABI,
      functionName: 'setAuthorizationWithSig',
      args: [morphoAuth, morphoSig],
    }),
  };

  // 2 — Permit2.permit (grants the adapter pull rights on the collateral token).
  const call_2: Bundler3Call = {
    to: PERMIT2_ADDRESS,
    value: 0n,
    skipRevert: false,
    callbackHash: ZERO_HASH,
    data: encodeFunctionData({
      abi: PERMIT2_ABI,
      functionName: 'permit',
      args: [user, permit2, permit2Sig],
    }),
  };

  // 3 — pull initial collateral from user via Permit2.
  const call_3: Bundler3Call = {
    to: generalAdapter1,
    value: 0n,
    skipRevert: false,
    callbackHash: ZERO_HASH,
    data: encodeFunctionData({
      abi: GENERAL_ADAPTER_1_ABI,
      functionName: 'permit2TransferFrom',
      args: [market.collateralToken, generalAdapter1, initialCollateral],
    }),
  };

  // 4 — supply the user's initial collateral.
  const call_4: Bundler3Call = {
    to: generalAdapter1,
    value: 0n,
    skipRevert: false,
    callbackHash: ZERO_HASH,
    data: encodeFunctionData({
      abi: GENERAL_ADAPTER_1_ABI,
      functionName: 'morphoSupplyCollateral',
      args: [market, initialCollateral, user, '0x'],
    }),
  };

  // 5 — flash loan + inner bundle. callbackHash must equal
  // keccak256(abi.encode(innerBundle as Call[])) or the reenter check reverts.
  const innerBundleEncoded = encodeBundle(innerBundle);
  const callbackHash = computeCallbackHash(innerBundle);
  const call_5: Bundler3Call = {
    to: generalAdapter1,
    value: 0n,
    skipRevert: false,
    callbackHash,
    data: encodeFunctionData({
      abi: GENERAL_ADAPTER_1_ABI,
      functionName: 'morphoFlashLoan',
      args: [market.loanToken, flashLoanAmount, innerBundleEncoded],
    }),
  };

  // 6, 7 — sweep loan-token and collateral-token dust back to the user.
  const sweep = (token: Address): Bundler3Call => ({
    to: generalAdapter1,
    value: 0n,
    skipRevert: false,
    callbackHash: ZERO_HASH,
    data: encodeFunctionData({
      abi: GENERAL_ADAPTER_1_ABI,
      functionName: 'erc20Transfer',
      args: [token, user, MAX_UINT256],
    }),
  });

  const bundle: Bundler3Call[] = [
    call_1,
    call_2,
    call_3,
    call_4,
    call_5,
    sweep(market.loanToken),
    sweep(market.collateralToken),
  ];

  assertCallbackHashesWellFormed(bundle);
  return bundle;
}

export function assertCallbackHashesWellFormed(bundle: Bundler3Call[]): void {
  let nonZero = 0;
  for (const call of bundle) {
    if (call.callbackHash !== ZERO_HASH) {
      nonZero++;
    }
  }
  if (nonZero !== 1) {
    throw new Error(
      `Loopoor: expected exactly 1 non-zero callbackHash in the outer bundle, got ${nonZero}`,
    );
  }
}
