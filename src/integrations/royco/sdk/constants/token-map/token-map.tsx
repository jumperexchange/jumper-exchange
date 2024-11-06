import { TokenMap1 } from "./token-map-1";
import { TokenMap42161 } from "./token-map-42161";
import { TokenMap11155111 } from "./token-map-11155111";
import { TokenMap8453 } from "./token-map-8453";
import { NULL_ADDRESS } from "../market-utils";

export type SupportedToken = {
  id: string;
  chain_id: number;
  contract_address: string;
  name: string;
  symbol: string;
  image: string;
  decimals: number;
  type?: string;
};

export const SupportedTokenMap = {
  ...TokenMap1,
  ...TokenMap42161,
  ...TokenMap11155111,
  ...TokenMap8453,
} as Record<string, SupportedToken>;

export const SupportedTokenList = Object.values(SupportedTokenMap);

export const UnknownToken: SupportedToken = {
  id: `0-${NULL_ADDRESS}`,
  chain_id: 0,
  contract_address: NULL_ADDRESS,
  name: "Unknown",
  symbol: "N/D",
  image: "https://chainlist.org/unknown-logo.png",
  decimals: 18,
};

export const getSupportedToken = (
  key: string | null | undefined
): SupportedToken => {
  if (!key) {
    return UnknownToken;
  }

  const [chain_id, contract_address] = key.split("-");

  if (!chain_id || !contract_address) {
    return UnknownToken;
  }

  const token =
    SupportedTokenMap[`${chain_id}-${contract_address.toLowerCase()}`];

  if (!token) {
    return {
      ...UnknownToken,
      id: `${chain_id}-${contract_address}`,
      chain_id: Number(chain_id),
      contract_address: contract_address,
    };
  }

  return token;
};
