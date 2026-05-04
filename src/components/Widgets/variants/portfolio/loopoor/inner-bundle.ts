// Inner bundle executed inside the flash-loan callback — reenters Bundler3
// with 4 calls. All callbackHashes are zero here; only the outer flash-loan
// call carries a non-zero hash that commits to this bundle.
//
// Unlike the original 5-call LI.FI-direct inner bundle, this version routes
// the swap through our LoopoorSwapAdapter. Bundler3 sends the flash-loaned
// loan tokens to the adapter, the adapter approves the LI.FI router and
// forwards the quote calldata (so `msg.sender` seen by LI.FI is the adapter,
// which holds the tokens and has the approval), then sweeps the output token
// to GeneralAdapter1.

import { type Address, encodeFunctionData, type Hex } from 'viem';
import { GENERAL_ADAPTER_1_ABI, LOOPOOR_SWAP_ADAPTER_ABI } from './abis';
import type { Bundler3Call } from './callback-hash';
import { getLoopoorChainConfig, MAX_UINT256, ZERO_HASH } from './constants';
import type { LifiQuote } from './lifi-quote';
import type { MorphoMarketParams } from './market-params';

export type BuildInnerBundleInput = {
  chainId: number;
  user: Address;
  market: MorphoMarketParams;
  flashLoanAmount: bigint;
  minSharePriceE27: bigint;
  quote: LifiQuote;
};

export function buildInnerBundle(input: BuildInnerBundleInput): Bundler3Call[] {
  const { chainId, user, market, flashLoanAmount, minSharePriceE27, quote } =
    input;
  const { generalAdapter1, swapAdapter } = getLoopoorChainConfig(chainId);

  // a — move flash-loaned loan tokens from GA1 → swap adapter.
  const call_a: Bundler3Call = {
    to: generalAdapter1,
    value: 0n,
    skipRevert: false,
    callbackHash: ZERO_HASH,
    data: encodeFunctionData({
      abi: GENERAL_ADAPTER_1_ABI,
      functionName: 'erc20Transfer',
      args: [market.loanToken, swapAdapter, flashLoanAmount],
    }),
  };

  // b — adapter swaps loanToken → collateralToken via LI.FI, sweeps output to GA1.
  const call_b: Bundler3Call = {
    to: swapAdapter,
    value: 0n,
    skipRevert: false,
    callbackHash: ZERO_HASH,
    data: encodeFunctionData({
      abi: LOOPOOR_SWAP_ADAPTER_ABI,
      functionName: 'swapAndForward',
      args: [
        market.loanToken,
        flashLoanAmount,
        market.collateralToken,
        quote.estimate.approvalAddress,
        quote.transactionRequest.to,
        quote.transactionRequest.data as Hex,
        generalAdapter1,
      ],
    }),
  };

  // c — supply the adapter's full collateral balance (MAX_UINT256 = sweep).
  const call_c: Bundler3Call = {
    to: generalAdapter1,
    value: 0n,
    skipRevert: false,
    callbackHash: ZERO_HASH,
    data: encodeFunctionData({
      abi: GENERAL_ADAPTER_1_ABI,
      functionName: 'morphoSupplyCollateral',
      args: [market, MAX_UINT256, user, '0x'],
    }),
  };

  // d — borrow `flashLoanAmount` back to GA1 so Morpho can pull repayment.
  const call_d: Bundler3Call = {
    to: generalAdapter1,
    value: 0n,
    skipRevert: false,
    callbackHash: ZERO_HASH,
    data: encodeFunctionData({
      abi: GENERAL_ADAPTER_1_ABI,
      functionName: 'morphoBorrow',
      args: [market, flashLoanAmount, 0n, minSharePriceE27, generalAdapter1],
    }),
  };

  return [call_a, call_b, call_c, call_d];
}
