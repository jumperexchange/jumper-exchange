import {
  alpha,
  binance,
  bitget,
  bitpie,
  block,
  brave,
  coinbase,
  dcent,
  exodus,
  frame,
  frontier,
  gate,
  hyperpay,
  imtoken,
  liquality,
  okx,
  oneinch,
  ownbit,
  rabby,
  safepal,
  status,
  taho,
  tokenary,
  tokenpocket,
  trust,
  walletConnect,
  xdefi,
} from '@lifi/wallet-management';
import { useContext, useMemo, type FC, type PropsWithChildren } from 'react';
import type { Chain } from 'viem';
import { createClient } from 'viem';
import { WagmiContext, WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { formatChain } from './utils';
import { useChains } from 'src/hooks';

const connectors = [
  walletConnect,
  coinbase,
  bitget,
  gate,
  exodus,
  taho,
  binance,
  frontier,
  okx,
  trust,
  status,
  alpha,
  block,
  bitpie,
  brave,
  dcent,
  frame,
  hyperpay,
  imtoken,
  liquality,
  ownbit,
  tokenpocket,
  xdefi,
  oneinch,
  tokenary,
  safepal,
  rabby,
];

export const EVMProvider: FC<PropsWithChildren> = ({ children }) => {
  const inWagmiContext = useInWagmiContext();
  return inWagmiContext ? (
    children
  ) : (
    <EVMBaseProvider>{children}</EVMBaseProvider>
  );
};

export const EVMBaseProvider: FC<PropsWithChildren> = ({ children }) => {
  const { chains } = useChains();

  const wagmiConfig = useMemo(() => {
    const _chains: [Chain, ...Chain[]] = chains?.length
      ? (chains.map(formatChain) as [Chain, ...Chain[]])
      : [mainnet];
    // Add ENS contracts
    const _mainnet = _chains.find((chain) => chain.id === mainnet.id);
    if (_mainnet) {
      _mainnet.contracts = mainnet.contracts;
    }
    const wagmiConfig = createConfig({
      chains: _chains,
      connectors: connectors,
      client({ chain }) {
        return createClient({ chain, transport: http() });
      },
      // transports: _chains.reduce(
      //   (transports, chain) => {
      //     transports[chain.id] = http();
      //     return transports;
      //   },
      //   {} as Record<number, Transport>,
      // ),
    });
    return wagmiConfig;
  }, [chains]);

  return (
    <WagmiProvider
      config={wagmiConfig}
      reconnectOnMount={Boolean(chains?.length)}
    >
      {children}
    </WagmiProvider>
  );
};

function useInWagmiContext(): boolean {
  const context = useContext(WagmiContext);
  return Boolean(context);
}
