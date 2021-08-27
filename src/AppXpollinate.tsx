import { Alert, Layout } from 'antd';
import React, { useEffect } from 'react';
import './App.css';
import Web3ConnectionManager from './components/web3/Web3ConnectionManager';
import WrappedWeb3ReactProvider from './components/web3/WrappedWeb3ReactProvider';
import analytics from './services/analytics';
import SwapXpollinate from './components/nxtp/SwapXpollinate';
import { defaultTokens, getChainByKey } from './types/lists';
import { ChainKey } from './types';
import { getBalancesForWallet } from './services/balanceService';

const transferChains = [
  getChainByKey(ChainKey.BSC),
  getChainByKey(ChainKey.POL),
  getChainByKey(ChainKey.DAI),
  getChainByKey(ChainKey.FTM),
]

const transferTokens = defaultTokens


function usePageViews() {
  let location = (window as any).location
  useEffect(() => {
    analytics.sendPageView(location.pathname)
  }, [location])
}

function AppXpollinate() {
  usePageViews()

  const alert = (
    <Alert
      message={(<h1>Welcome to xPollinate.io</h1>)}
      description={(
        <>
          <p>This interface gives access to the NXTP protocol of connext - Cross-Chain-Transfers in minutes.</p>
          <p>It allows you to transfer Stablecoins (USDC, USDT, DAI) betwen multiple EVM based chains (Polygon, BSC, xDAI).</p>
          <p> Simply select the chains, an amount, the token to transfer and click Swap.</p>
        </>
      )}
      type="info"
      closable={true}
    />
  )

  return (
    <WrappedWeb3ReactProvider>
      <Web3ConnectionManager>
        <Layout>
          <SwapXpollinate
            alert={alert}
            transferChains={transferChains}
            transferTokens={transferTokens}
            getBalancesForWallet={getBalancesForWallet}
          />
        </Layout>
      </Web3ConnectionManager>
    </WrappedWeb3ReactProvider>
  );
}

export { AppXpollinate };
