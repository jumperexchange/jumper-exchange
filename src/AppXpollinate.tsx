import './App.css'

import { Layout } from 'antd'
import React, { useEffect } from 'react'

import SwapXpollinate from './components/nxtp/SwapXpollinate'
import Web3ConnectionManager from './components/web3/Web3ConnectionManager'
import WrappedWeb3ReactProvider from './components/web3/WrappedWeb3ReactProvider'
import analytics from './services/analytics'
import { ChainId, ChainKey, CoinKey, findDefaultToken, getChainById } from './types'

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
    findDefaultToken(CoinKey.ETH, ChainId.BSC),
    findDefaultToken(CoinKey.USDC, ChainId.BSC),
    findDefaultToken(CoinKey.USDT, ChainId.BSC),
    findDefaultToken(CoinKey.DAI, ChainId.BSC),
    // findDefaultToken(CoinKey.WBTC, ChainId.BSC),
  ],
  [ChainKey.POL]: [
    findDefaultToken(CoinKey.ETH, ChainId.POL),
    findDefaultToken(CoinKey.USDC, ChainId.POL),
    findDefaultToken(CoinKey.USDT, ChainId.POL),
    findDefaultToken(CoinKey.DAI, ChainId.POL),
    findDefaultToken(CoinKey.WBTC, ChainId.POL),
  ],
  [ChainKey.DAI]: [
    findDefaultToken(CoinKey.ETH, ChainId.DAI),
    findDefaultToken(CoinKey.USDC, ChainId.DAI),
    findDefaultToken(CoinKey.USDT, ChainId.DAI),
    findDefaultToken(CoinKey.DAI, ChainId.DAI),
    findDefaultToken(CoinKey.WBTC, ChainId.DAI),
  ],
  [ChainKey.FTM]: [
    findDefaultToken(CoinKey.ETH, ChainId.FTM),
    findDefaultToken(CoinKey.USDC, ChainId.FTM),
    findDefaultToken(CoinKey.USDT, ChainId.FTM),
    findDefaultToken(CoinKey.DAI, ChainId.FTM),
    findDefaultToken(CoinKey.WBTC, ChainId.FTM),
  ],
  [ChainKey.ARB]: [
    findDefaultToken(CoinKey.ETH, ChainId.ARB),
    findDefaultToken(CoinKey.USDC, ChainId.ARB),
    findDefaultToken(CoinKey.USDT, ChainId.ARB),
    findDefaultToken(CoinKey.DAI, ChainId.ARB),
    findDefaultToken(CoinKey.WBTC, ChainId.ARB),
  ],
  [ChainKey.AVA]: [
    findDefaultToken(CoinKey.ETH, ChainId.AVA),
    findDefaultToken(CoinKey.USDC, ChainId.AVA),
    findDefaultToken(CoinKey.USDT, ChainId.AVA),
    findDefaultToken(CoinKey.DAI, ChainId.AVA),
    findDefaultToken(CoinKey.WBTC, ChainId.AVA),
  ],
  [ChainKey.ETH]: [
    findDefaultToken(CoinKey.ETH, ChainId.ETH),
    findDefaultToken(CoinKey.USDC, ChainId.ETH),
    findDefaultToken(CoinKey.USDT, ChainId.ETH),
    findDefaultToken(CoinKey.DAI, ChainId.ETH),
    findDefaultToken(CoinKey.WBTC, ChainId.ETH),
  ],
  [ChainKey.MOR]: [
    findDefaultToken(CoinKey.USDC, ChainId.MOR),
    findDefaultToken(CoinKey.USDT, ChainId.MOR),
    // findDefaultToken(CoinKey.WBTC, ChainId.MOR),
  ],
  [ChainKey.OPT]: [
    findDefaultToken(CoinKey.ETH, ChainId.OPT),
    findDefaultToken(CoinKey.USDC, ChainId.OPT),
    findDefaultToken(CoinKey.USDT, ChainId.OPT),
    findDefaultToken(CoinKey.DAI, ChainId.OPT),
    findDefaultToken(CoinKey.WBTC, ChainId.OPT),
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
