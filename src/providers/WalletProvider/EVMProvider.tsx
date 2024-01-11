import {
  alpha,
  binance,
  bitget,
  bitpie,
  block,
  brave,
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
  xdefi,
} from '@lifi/wallet-management';
import { useMemo, type FC, type PropsWithChildren } from 'react';
import type { Chain } from 'viem';
import { createClient } from 'viem';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { formatChain } from './utils';
import { useChains } from 'src/hooks';
import {
  walletConnect as _walletConnect,
  coinbaseWallet,
} from '@wagmi/connectors';

export const walletConnect = /*@__PURE__*/ _walletConnect({
  projectId: '7480e74780d20eb6db1056eab0de6ddb',
  showQrModal: true,
  qrModalOptions: {
    themeVariables: {
      '--wcm-z-index': '3000',
    },
  },
});

export const coinbase: ReturnType<typeof coinbaseWallet> =
  /*@__PURE__*/ coinbaseWallet({
    appName: 'Jumper.Exchange',
  });

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
