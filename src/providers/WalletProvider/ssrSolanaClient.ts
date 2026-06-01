import {
  createClientStore,
  createInitialClientState,
  type SolanaClient,
} from '@solana/client';

/**
 * Build a SolanaClient suitable for use during SSR / pre-hydration only.
 *
 * We can't use the real `<SolanaProvider config={...}>` pathway on the server
 * because internally it calls `createClient(config)` which immediately fires a
 * `getLatestBlockhash` "cluster warmup" against the configured (or defaulted)
 * Solana endpoint. Every public Solana RPC we have access to is either:
 *
 *   - an authenticated/paid endpoint (Helius, QuikNode) whose quota is meant
 *     to be spent on real user traffic, or
 *   - a Triton-backed endpoint (`*.rpcpool.com`, `api.mainnet-beta.solana.com`,
 *     even `solana-rpc.publicnode.com` ultimately) that 403s or 429s when hit
 *     from the small set of pod fleet IPs.
 *
 * SSR doesn't actually need any of that — wallet connections, signing, quotes,
 * route execution and every other Solana hook consumer in the app is
 * conditionally rendered AFTER hydration. So on the server we install this
 * lightweight stub via `<SolanaProvider client={ssrSolanaClient}>`, which
 * skips the `createClient` warmup path entirely while still providing a real
 * zustand store so `useWallet()` / `useWalletSession()` return a sensible
 * "disconnected" state instead of throwing.
 *
 * Once `useHydrated()` flips to true, `<SVMProvider>` re-renders with
 * `config={...}` instead of `client={...}`, and the real client is created
 * inside the SolanaClientProvider with the full RPC + persistence behaviour.
 * The JSX structure is unchanged across the swap, so children don't unmount.
 */
export function createSsrSolanaClient(): SolanaClient {
  const store = createClientStore(
    createInitialClientState({
      commitment: 'confirmed',
      // These URLs are never actually hit from the SSR path — the stub never
      // calls `setCluster` or invokes `runtime.rpc`. They're only here to
      // satisfy the initial client state shape.
      endpoint: 'https://api.mainnet-beta.solana.com',
      websocketEndpoint: 'wss://api.mainnet-beta.solana.com',
    }),
  );

  const noopAsync = async () => undefined;
  const noop = () => undefined;

  // The fields below are never invoked on SSR. The handful of consumers that
  // would dispatch wallet actions, hit `runtime.rpc`, or read helpers
  // (`MissionVerifyWallet`, `GoldenRouteModal`, `ClaimPerkModal`) are all
  // conditionally rendered only after the user reaches a state that requires
  // a connected wallet — which only happens post-hydration. They're stubbed
  // out purely to satisfy the structural `SolanaClient` type.
  return {
    store,
    actions: {
      setCluster: noopAsync,
      connectWallet: noopAsync,
      disconnectWallet: noopAsync,
    },
    config: {},
    connectors: { all: () => [], byId: () => undefined },
    destroy: noop,
    helpers: {},
    runtime: {},
    solTransfer: {},
    stake: {},
    transaction: {},
    splToken: {},
    wsol: {},
  } as unknown as SolanaClient;
}
