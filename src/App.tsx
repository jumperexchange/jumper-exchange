import { WalletOutlined } from '@ant-design/icons';
import { Button, Image, Layout, Menu } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Link, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import logo from './assets/icon192.png';
import heroImage from './assets/info_header.png';
import AboutPage from './components/AboutPage';
import Dashboard from './components/Dashboard';
import NotFoundPage from './components/NotFoundPage';
import SwapXpollinate from './components/nxtp/SwapXpollinate';
import Web3ConnectionManager from './components/web3/Web3ConnectionManager';
import WrappedWeb3ReactProvider from './components/web3/WrappedWeb3ReactProvider';
import analytics from './services/analytics';
import { getBalancesForWallet } from './services/balanceService';
import setMetatags from './services/metatags';
import { initStomt } from './services/stomt';
import { ChainKey } from './types';
import { defaultTokens, getChainByKey } from './types/lists';

function usePageViews() {
  const [path, setPath] = useState<string>()

  const currentPath = (window as any).location.pathname === '/' ? '/swap' : (window as any).location.pathname
  if (path !== currentPath) {
    setPath(currentPath)
  }

  useEffect(() => {
    if (path) {
      analytics.sendPageView(path)
    }
  }, [path])

  return path
}

const transferChains = [
  getChainByKey(ChainKey.BSC),
  getChainByKey(ChainKey.POL),
  getChainByKey(ChainKey.DAI),
  getChainByKey(ChainKey.FTM),
  getChainByKey(ChainKey.ARB),
]

const transferTokens = defaultTokens

function App() {
  const path = usePageViews()

  const aboutMessage = (<h1>Welcome to the Li.Finance Swap BETA</h1>)
  const aboutDescription = (
    <>
      <Image
        className="hero-image"
        src={heroImage}
      />
      <p>
        Note: This is a beta and transfers can take longer then expected. They should be fullfilled in less then 5 minutes, if it takes longer please come back later and check again.
      </p>
    </>
  )

  return (
    <BrowserRouter>
      <WrappedWeb3ReactProvider>
        <Web3ConnectionManager>
          <Layout>
            <Header style={{ position: 'fixed', zIndex: 900, width: '100%', padding: 0 }}>
              <Link to="/" className="wordmark">
                <img src={logo} className="logo" alt={process.env.REACT_APP_PROJECT_NAME} width="36" height="36" />
                <span>Li.Finance</span>
              </Link>
              <Menu theme="light" mode="horizontal" defaultSelectedKeys={path ? [path] : []}>
                <Menu.Item key="/dashboard">
                  <Link to="/dashboard">Dashboard</Link>
                </Menu.Item>
                <Menu.Item key="/swap">
                  <span className="beta-badge">Beta</span>
                  <Link to="/swap">Swap</Link>
                </Menu.Item>
                <Menu.Item key="/about">
                  <Link to="/about">About</Link>
                </Menu.Item>
                { false && <Menu.Item key="wallets" style={{float: "right"}}>
                  <Button shape="round" icon={<WalletOutlined />} >
                    Add Wallets
                  </Button>
                </Menu.Item> }
              </Menu>

              <a className="lifiSupport" href="https://discord.com/invite/G9uAbE439B" target="_blank" rel="nofollow noreferrer">Support</a>
            </Header>

            <Switch>
              <Redirect exact from="/" to="/swap" />
              <Route path="/dashboard" render={() => {
                setMetatags({
                  title: 'Li.Finance - Dashboard',
                })
                initStomt('dashboard')
                return <Dashboard/>
              }}/>
              <Route path="/swap" render={() => {
                setMetatags({
                  title: 'Li.Finance - Swap',
                })
                initStomt('swap')
                return <div className="lifiWrap">
                  <SwapXpollinate
                    aboutMessage={aboutMessage}
                    aboutDescription={aboutDescription}
                    transferChains={transferChains}
                    transferTokens={transferTokens}
                    getBalancesForWallet={getBalancesForWallet}
                  />
                </div>
              }}/>
              <Route path="/about" render={() => {
                setMetatags({
                  title: 'Li.Finance - About',
                })
                initStomt('lifi')
                return <AboutPage/>
              }}/>
              <Route path="*" render={() => {
                setMetatags({
                  title: 'Li.Finance - Not Found',
                  status: 404,
                })
                initStomt('lifi')
                return <NotFoundPage/>
              }}/>
            </Switch>
          </Layout>
        </Web3ConnectionManager>
      </WrappedWeb3ReactProvider>
    </BrowserRouter>
  );
}

export { App };
