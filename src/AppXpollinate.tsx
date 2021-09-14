import { Layout } from 'antd';
import React, { useEffect } from 'react';
import './App.css';
import SwapXpollinate from './components/nxtp/SwapXpollinate';
import Web3ConnectionManager from './components/web3/Web3ConnectionManager';
import WrappedWeb3ReactProvider from './components/web3/WrappedWeb3ReactProvider';
import analytics from './services/analytics';
import { getBalancesForWallet } from './services/balanceService';
import { ChainKey } from './types';
import { defaultTokens, getChainByKey } from './types/lists';

const transferChains = [
  getChainByKey(ChainKey.BSC),
  getChainByKey(ChainKey.POL),
  getChainByKey(ChainKey.DAI),
  getChainByKey(ChainKey.FTM),
  // getChainByKey(ChainKey.ARB),
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

  const aboutMessage = (<h1>Welcome to xPollinate.io</h1>)
  const aboutDescription = (
    <>
      <p>
        This interface gives access to the NXTP protocol of Connext.
        It allows you to transfer Stablecoins (USDC, USDT, DAI) between multiple EVM based chains (Polygon, BSC, xDAI, Fantom). THIS IS AN ALPHA RELEASE! PLEASE USE WITH CAUTION</p>
      <p>Simply select the chains, an amount, the token to transfer and click Swap.</p>
      <p>
        Made for you by<br />
        &nbsp;&nbsp;~ Connext (Protocol)
        <br />
        &nbsp;&nbsp;~ Li.Finance (UI & Swaps - soon)
        <br />
        &nbsp;&nbsp;~ 1Hive (DEX - soon)
      </p>
      <p>
        Note: We are experiencing some issues with v2. Please use v1 if the transactions are urgent. Thank you for your patience.
      </p>
    </>
  )

  return (
    <WrappedWeb3ReactProvider>
      <Web3ConnectionManager>
        <Layout>
          <SwapXpollinate
            aboutMessage={aboutMessage}
            aboutDescription={aboutDescription}
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
