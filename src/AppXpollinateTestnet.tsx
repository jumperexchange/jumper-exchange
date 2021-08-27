import { Alert, Layout } from 'antd';
import React, { useEffect } from 'react';
import './App.css';
import Web3ConnectionManager from './components/web3/Web3ConnectionManager';
import WrappedWeb3ReactProvider from './components/web3/WrappedWeb3ReactProvider';
import SwapXpollinate from './components/nxtp/SwapXpollinate';
import analytics from './services/analytics';
import { getBalancesForWallet, testToken } from './services/testToken';
import { ChainKey } from './types';
import { getChainByKey } from './types/lists';

const transferChains = [
  getChainByKey(ChainKey.ROP),
  getChainByKey(ChainKey.RIN),
  getChainByKey(ChainKey.GOR),
  getChainByKey(ChainKey.MUM),
  getChainByKey(ChainKey.ARBT),
  getChainByKey(ChainKey.BSCT),
  // getChainByKey(ChainKey.OPTT),
]

const transferTokens = testToken

function usePageViews() {
  let location = (window as any).location
  useEffect(() => {
    analytics.sendPageView(location.pathname)
  }, [location])
}

function AppXpollinateTestnet() {
  usePageViews()

  const alert = (
    <Alert
      message={(<h1>Welcome to the <a href="https://github.com/connext/nxtp" target="_blank" rel="nofollow noreferrer">NXTP</a> Testnet Demo</h1>)}
      description={(
        <>
          <p>The demo allows to transfer custom <b>TEST</b> token between Rinkeby and Goerli testnet.</p>
          <p>To use the demo you need gas (ETH) and test token (TEST) on one of the chains. You can get free ETH for testing from public faucets and mint your own TEST here on the website.</p>
        </>
      )}
      type="info"
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
            testnet={true}
          />
        </Layout>
      </Web3ConnectionManager>
    </WrappedWeb3ReactProvider>
  );
}

export { AppXpollinateTestnet };
