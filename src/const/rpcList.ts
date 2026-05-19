import { shuffleArray } from 'src/utils/shuffleArray';
import config from '@/config/env-config';

const optRPCList = [
  'https://mainnet.optimism.io',
  'https://op-pokt.nodies.app',
  // 'https://optimism.drpc.org',
  `https://lb.drpc.org/ogrpc?network=optimism&dkey=${config.NEXT_PUBLIC_DKEY}`,
  'https://optimism.meowrpc.com',
];

const arbRPCList = [
  'https://arb1.arbitrum.io/rpc',
  // 'https://arbitrum.drpc.org',
  `https://lb.drpc.org/ogrpc?network=arbitrum&dkey=${config.NEXT_PUBLIC_DKEY}`,
  'https://arb-pokt.nodies.app',
  'https://arbitrum.meowrpc.com',
];

const basRPCList = [
  'https://base.llamarpc.com',
  'https://mainnet.base.org/',
  // 'https://base.meowrpc.com',
  // 'https://base.drpc.org',
  `https://lb.drpc.org/ogrpc?network=base&dkey=${config.NEXT_PUBLIC_DKEY}`,
  'https://base-pokt.nodies.app',
  'https://base-rpc.publicnode.com',
];

export const publicRPCList = {
  '10': shuffleArray(optRPCList),
  '42161': shuffleArray(arbRPCList),
  '8453': shuffleArray(basRPCList),
};

/**
 * RPC providers that must NOT be used during SSR.
 *
 * These are authenticated, paid endpoints whose quotas are intended to be
 * spent on real user traffic from the browser. Because all SSR traffic exits
 * through a small number of pod IPs, any synchronized burst (e.g. fleet
 * restart, deploy, traffic spike) bunches up on the same source IP and either
 * blows the per-origin quota (triggering tight retry loops that burn CPU and
 * memory) or wastes paid request budget on cluster-warmup pings.
 *
 * On the browser, requests are spread across millions of user IPs, so the
 * per-origin limit is never an issue and the spend goes to actual users.
 */
const BROWSER_ONLY_RPC_HOSTS = [
  // Helius rebate endpoints share a per-rebate-address quota across all
  // callers. SSR concentrates this onto the pod fleet IPs and hits 429.
  'helius-rpc.com',
  // QuikNode endpoints are authenticated/paid; we don't want SSR pods
  // burning the request budget on cluster-warmup pings.
  'quiknode.pro',
];

function isBrowserOnlyRpc(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return BROWSER_ONLY_RPC_HOSTS.some((needle) => host.includes(needle));
  } catch {
    return false;
  }
}

type RpcMap = Record<string, string[]>;

/**
 * Returns the parsed `NEXT_PUBLIC_CUSTOM_RPCS` map, with browser-only
 * endpoints stripped on the server. On the client it is returned unchanged.
 *
 * Use this everywhere that a component or SDK initializer might run on SSR
 * (LiFi SDK init, widget config, Solana provider, etc.) instead of inlining
 * `JSON.parse(config.NEXT_PUBLIC_CUSTOM_RPCS ?? '{}')`.
 */
export function getCustomRPCs(): RpcMap {
  let parsed: RpcMap;
  try {
    parsed = JSON.parse(config.NEXT_PUBLIC_CUSTOM_RPCS ?? '{}');
  } catch {
    return {};
  }

  if (typeof window !== 'undefined') {
    return parsed;
  }

  const filtered: RpcMap = {};
  for (const [chainId, urls] of Object.entries(parsed)) {
    if (!Array.isArray(urls)) {
      continue;
    }
    const safe = urls.filter((url) => !isBrowserOnlyRpc(url));
    if (safe.length > 0) {
      filtered[chainId] = safe;
    }
  }
  return filtered;
}

/**
 * Lazy getter so the merge happens after `getCustomRPCs()` has decided
 * what to include for the current execution context (SSR vs browser).
 */
export function getMergedRPCList(): RpcMap {
  return {
    ...getCustomRPCs(),
    ...publicRPCList,
  };
}
