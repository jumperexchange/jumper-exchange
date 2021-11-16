import './App.css'

import { Layout } from 'antd'
import React, { useEffect } from 'react'

import SwapXpollinate from './components/nxtp/SwapXpollinate'
import Web3ConnectionManager from './components/web3/Web3ConnectionManager'
import WrappedWeb3ReactProvider from './components/web3/WrappedWeb3ReactProvider'
import analytics from './services/analytics'
import { ChainKey, CoinKey, findDefaultCoinOnChain, getChainById } from './types'

const getTransferChains = () => {
  try {
    const chainIds = JSON.parse(process.env.REACT_APP_NXTP_ENABLED_CHAINS_JSON!)
    return chainIds.map(getChainById)
  } catch (e) {
    return []
  }
}
const transferChains = getTransferChains()

const transferTokens = {
  [ChainKey.BSC]: [
    findDefaultCoinOnChain(CoinKey.ETH, ChainKey.BSC),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.BSC),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.BSC),
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.BSC),
  ],
  [ChainKey.POL]: [
    findDefaultCoinOnChain(CoinKey.ETH, ChainKey.POL),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.POL),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.POL),
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.POL),
  ],
  [ChainKey.DAI]: [
    findDefaultCoinOnChain(CoinKey.ETH, ChainKey.DAI),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.DAI),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.DAI),
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.DAI),
  ],
  [ChainKey.FTM]: [
    findDefaultCoinOnChain(CoinKey.ETH, ChainKey.FTM),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.FTM),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.FTM),
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.FTM),
  ],
  [ChainKey.ARB]: [
    findDefaultCoinOnChain(CoinKey.ETH, ChainKey.ARB),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.ARB),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.ARB),
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.ARB),
  ],
  [ChainKey.AVA]: [
    findDefaultCoinOnChain(CoinKey.ETH, ChainKey.AVA),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.AVA),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.AVA),
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.AVA),
  ],
  [ChainKey.ETH]: [
    findDefaultCoinOnChain(CoinKey.ETH, ChainKey.ETH),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.ETH),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.ETH),
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.ETH),
  ],
  [ChainKey.MOR]: [
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.MOR),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.MOR),
  ],
}

function usePageViews() {
  let location = (window as any).location
  useEffect(() => {
    analytics.sendPageView(location.pathname)
  }, [location])
}

function AppXpollinate() {
  usePageViews()

  const aboutMessage = <h1>Welcome to xPollinate.io</h1>
  const aboutDescription = (
    <>
      <p>
        This interface gives access to the NXTP protocol of Connext. It allows you to transfer
        Stablecoins (USDC, USDT, DAI) between multiple EVM based chains (Polygon, BSC, xDAI, Fantom,
        Arbitrum).
      </p>
      <p>Simply select the chains, an amount, the token to transfer and click Swap.</p>
      <p>
        Made for you by
        <br />
        &nbsp;&nbsp;~ Connext (Protocol)
        <br />
        &nbsp;&nbsp;~ Li.Finance (UI & Swaps - soon)
        <br />
        &nbsp;&nbsp;~ 1Hive (DEX - soon)
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
          />
        </Layout>
      </Web3ConnectionManager>
    </WrappedWeb3ReactProvider>
  )
}

export { AppXpollinate }
