import { encodeAbiParameters, type Hex, keccak256 } from 'viem';
import { CALL_ARRAY_ABI_PARAM } from './abis';

export type Bundler3Call = {
  to: `0x${string}`;
  data: Hex;
  value: bigint;
  skipRevert: boolean;
  callbackHash: Hex;
};

export function encodeBundle(bundle: Bundler3Call[]): Hex {
  return encodeAbiParameters([CALL_ARRAY_ABI_PARAM], [bundle]);
}

// Bundler3 verifies during reenter() that
// keccak256(msg.data[4:]) equals the callbackHash set on the outer Call.
// msg.data[4:] is abi.encode(Call[]) — no selector prefix.
export function computeCallbackHash(innerBundle: Bundler3Call[]): Hex {
  return keccak256(encodeBundle(innerBundle));
}
