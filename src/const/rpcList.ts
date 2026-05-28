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
 * Chain IDs whose RPC endpoints are NEVER used from server-side code.
 *
 * Any host-by-host blocklist for Solana ends up listing every Solana RPC in
 * existence: Helius / QuikNode are authenticated paid endpoints that 429,
 * `*.rpcpool.com` (Triton One — including LiFi's `lifi-mainc49-4c2b.*`) is
 * origin/IP-locked and 403s, `api.mainnet-beta.solana.com` is itself a
 * Triton proxy, and even `solana-rpc.publicnode.com` rate-limits server IPs.
 * In practice nothing rendered on the server actually needs Solana RPC —
 * wallet UI, balance reads, quote previews, and route execution all run
 * after hydration. So instead of chasing providers, we drop the entire
 * Solana chain from the SSR RPC map and leave the browser path untouched.
 */
const BROWSER_ONLY_CHAIN_IDS: ReadonlySet<string> = new Set([
  // Solana mainnet
  '1151111081099710',
]);

type RpcMap = Record<string, string[]>;

/**
 * Returns the parsed `NEXT_PUBLIC_CUSTOM_RPCS` map, with chains whose RPCs
 * must not be exercised from server-side code stripped on SSR. On the
 * browser it is returned unchanged.
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
    if (BROWSER_ONLY_CHAIN_IDS.has(chainId)) {
      continue;
    }
    if (Array.isArray(urls) && urls.length > 0) {
      filtered[chainId] = urls;
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
