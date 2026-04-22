// Pure orchestrator: given all the pre-computed inputs + signatures,
// returns the multicall calldata ready to be sent to Bundler3.

import { type Address, encodeFunctionData, type Hex } from 'viem';
import { BUNDLER3_ABI } from './abis';
import { buildInnerBundle } from './inner-bundle';
import type { LifiQuote } from './lifi-quote';
import type { MorphoMarketParams } from './market-params';
import { buildOuterBundle } from './outer-bundle';
import type {
  MorphoAuthorization,
  MorphoSignatureParts,
  Permit2Single,
} from './signatures';

export type BuildLoopoorMulticallInput = {
  chainId: number;
  user: Address;
  market: MorphoMarketParams;
  initialCollateral: bigint;
  flashLoanAmount: bigint;
  minSharePriceE27: bigint;
  quote: LifiQuote;
  morphoAuth: MorphoAuthorization;
  morphoSig: MorphoSignatureParts;
  permit2: Permit2Single;
  permit2Sig: Hex;
};

export type BuildLoopoorMulticallResult = {
  calldata: Hex;
};

export function buildLoopoorMulticall(
  input: BuildLoopoorMulticallInput,
): BuildLoopoorMulticallResult {
  const innerBundle = buildInnerBundle({
    chainId: input.chainId,
    user: input.user,
    market: input.market,
    flashLoanAmount: input.flashLoanAmount,
    minSharePriceE27: input.minSharePriceE27,
    quote: input.quote,
  });

  const outerBundle = buildOuterBundle({
    chainId: input.chainId,
    user: input.user,
    market: input.market,
    initialCollateral: input.initialCollateral,
    morphoAuth: input.morphoAuth,
    morphoSig: input.morphoSig,
    permit2: input.permit2,
    permit2Sig: input.permit2Sig,
    innerBundle,
    flashLoanAmount: input.flashLoanAmount,
  });

  const calldata = encodeFunctionData({
    abi: BUNDLER3_ABI,
    functionName: 'multicall',
    args: [outerBundle],
  });

  return { calldata };
}
