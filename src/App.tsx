import { WalletOutlined } from '@ant-design/icons';
import { Button, Layout, Menu } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import React, { useEffect } from 'react';
import { Link, Route, Switch, Redirect, useLocation } from 'react-router-dom';
import './App.css';
import logo from './assets/icon192.png';
import AboutPage from './components/AboutPage';
import Dashboard from './components/Dashboard';
import NotFoundPage from './components/NotFoundPage';
import Swap from './components/Swap';
import Web3ConnectionManager from './components/web3/Web3ConnectionManager';
import WrappedWeb3ReactProvider from './components/web3/WrappedWeb3ReactProvider';
import analytics from './services/analytics';
import setMetatags from './services/metatags';
import { initStomt } from './services/stomt';

function usePageViews() {
  let location = useLocation()
  useEffect(() => {
    analytics.sendPageView(location.pathname)
  }, [location])
}

function App() {
  usePageViews()

  const defaultKey = window.location.pathname === '/' ? '/swap' : window.location.pathname

  return (
    <WrappedWeb3ReactProvider>
      <Web3ConnectionManager>
        <Layout>
          <Header style={{ position: 'fixed', zIndex: 1, width: '100%', padding: 0 }}>
            <Link to="/" className="wordmark">
              <img src={logo} className="logo" alt={process.env.REACT_APP_PROJECT_NAME} />
              <span>Li.Finance</span>
            </Link>
            <Menu theme="light" mode="horizontal" defaultSelectedKeys={[defaultKey]}>
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
              return <Swap/>
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
  );
}

export default App;
