import { Layout } from 'antd';
import React, { useEffect } from 'react';
import './App.css';
import SwapXpollinate from './components/nxtp/SwapXpollinate';
import Web3ConnectionManager from './components/web3/Web3ConnectionManager';
import WrappedWeb3ReactProvider from './components/web3/WrappedWeb3ReactProvider';
import analytics from './services/analytics';
import { getBalancesForWallet, testToken } from './services/testToken';
import { getChainById } from './types';

const getTransferChains = () => {
  try {
    const chainIds = JSON.parse(process.env.REACT_APP_NXTP_ENABLED_CHAINS_TESTNET_JSON!)
    return chainIds.map(getChainById)
  } catch (e) {
    return []
  }
}
const transferChains = getTransferChains()

const transferTokens = testToken

function usePageViews() {
  let location = (window as any).location
  useEffect(() => {
    analytics.sendPageView(location.pathname)
  }, [location])
}

function AppXpollinateTestnet() {
  usePageViews()

  const aboutMessage = (<h1>Welcome to the <a href="https://github.com/connext/nxtp" target="_blank" rel="nofollow noreferrer">NXTP</a> Testnet Demo</h1>)
  const aboutDescription = (
    <>
      <p>The demo allows to transfer custom <b>TEST</b> token between different testnets.</p>
      <p>To use the demo you need gas (ETH/MATIC/BNB) and test token (TEST) on one of the chains. You can get free gas for testing from public faucets and mint your own TEST here on the website.</p>
      <p>
        Made for you by<br/>
        &nbsp;&nbsp;~ Connext (Protocol)
        <br/>
        &nbsp;&nbsp;~ Li.Finance (UI & Swaps - soon)
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
            testnet={true}
          />
        </Layout>
      </Web3ConnectionManager>
    </WrappedWeb3ReactProvider>
  );
}

export { AppXpollinateTestnet };
