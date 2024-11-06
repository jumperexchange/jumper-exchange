import type { Address } from "viem";

export const NULL_ADDRESS =
  "0x0000000000000000000000000000000000000000" as Address;

export enum REWARD_STYLE {
  Upfront = 0,
  Arrear = 1,
  Forfeitable = 2,
}
