import { WalletOutlined } from '@ant-design/icons';
import { Button, Layout, Menu } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import { useEffect, useState } from 'react';
import { BrowserRouter, Link, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import logo from './assets/icon192.png';
import AboutPage from './components/AboutPage';
import Dashboard from './components/Dashboard';
import NotFoundPage from './components/NotFoundPage';
import Swap from './components/Swap';
import Web3ConnectionManager from './components/web3/Web3ConnectionManager';
import WrappedWeb3ReactProvider from './components/web3/WrappedWeb3ReactProvider';
import analytics from './services/analytics';
import { getBalancesForWallet as getBalancesForWalletMainnet } from './services/balanceService';
import setMetatags from './services/metatags';
import { initStomt } from './services/stomt';
import { getDefaultTokenBalancesForWallet as getBalancesForWalletTestnet } from './services/testToken';
import { getChainById } from './types';
import NotificationOverlay from './components/NotificationsOverlay';
import ChangelogModal from './components/ChangelogModal';

const getTransferChains = (jsonArraySting: string) => {
  try {
    const chainIds = JSON.parse(jsonArraySting)
    return chainIds.map(getChainById)
  } catch (e) {
    return []
  }
}

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

function App() {
  const path = usePageViews()

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
                {false && <Menu.Item key="wallets" style={{ float: "right" }}>
                  <Button shape="round" icon={<WalletOutlined />} >
                    Add Wallets
                  </Button>
                </Menu.Item>}
              </Menu>

              <a className="lifiSupport support-header" href="https://discord.com/invite/G9uAbE439B" target="_blank" rel="nofollow noreferrer">Support</a>
            </Header>

            <Switch>
              <Redirect exact from="/" to="/swap" />
              <Route path="/dashboard" render={() => {
                setMetatags({
                  title: 'Li.Finance - Dashboard',
                })
                initStomt('dashboard')
                return (<>
                <a className="lifiSupport support-content" href="https://discord.com/invite/G9uAbE439B" target="_blank" rel="nofollow noreferrer">Support</a>

                <Dashboard />
                </>)
              }} />
              <Route path="/swap" render={() => {
                setMetatags({
                  title: 'Li.Finance - Swap',
                })
                initStomt('swap')
                const transferChains = getTransferChains(process.env.REACT_APP_LIFI_ENABLED_CHAINS_JSON!)
                return <div className="lifiWrap">
                  <a className="lifiSupport support-content" href="https://discord.com/invite/G9uAbE439B" target="_blank" rel="nofollow noreferrer">Support</a>

                  <Swap
                    transferChains={transferChains}
                    getBalancesForWallet={getBalancesForWalletMainnet}
                  />
                </div>
              }} />
              <Route path="/testnet" render={() => {
                setMetatags({
                  title: 'Li.Finance - Testnet',
                })
                initStomt('swap')
                const transferChains = getTransferChains(process.env.REACT_APP_LIFI_ENABLED_CHAINS_TESTNET_JSON!)
                return <div className="lifiWrap">
                  <Swap
                    transferChains={transferChains}
                    getBalancesForWallet={getBalancesForWalletTestnet}
                  />
                </div>
              }} />
              <Route path="/about" render={() => {
                setMetatags({
                  title: 'Li.Finance - About',
                })
                initStomt('lifi')
                return <AboutPage />
              }} />
              <Route path="*" render={() => {
                setMetatags({
                  title: 'Li.Finance - Not Found',
                  status: 404,
                })
                initStomt('lifi')
                return <NotFoundPage />
              }} />
            </Switch>
            <NotificationOverlay />
            <ChangelogModal />
          </Layout>
        </Web3ConnectionManager>
      </WrappedWeb3ReactProvider>
    </BrowserRouter>
  );
}

export { App };
