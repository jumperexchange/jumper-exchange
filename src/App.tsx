import './App.css'

import { GithubOutlined, TwitterOutlined, WalletOutlined } from '@ant-design/icons'
import { Button, Col, Layout, Menu, Row } from 'antd'
import { Content, Header } from 'antd/lib/layout/layout'
import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Redirect, Route, Switch } from 'react-router-dom'

import logo from './assets/icon192.png'
import AboutPage from './components/AboutPage'
import Dashboard from './components/Dashboard'
import NotFoundPage from './components/NotFoundPage'
import NotificationOverlay from './components/NotificationsOverlay'
import Swap from './components/Swap'
import Web3ConnectionManager from './components/web3/Web3ConnectionManager'
import WrappedWeb3ReactProvider from './components/web3/WrappedWeb3ReactProvider'
import analytics from './services/analytics'
import setMetatags from './services/metatags'
import { initStomt } from './services/stomt'
import { getChainById } from './types'

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

  const currentPath =
    (window as any).location.pathname === '/' ? '/swap' : (window as any).location.pathname
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
              <Row>
                {/* Menu */}
                <Col xs={24} sm={24} md={14} lg={14} xl={14}>
                  <Link to="/" className="wordmark">
                    <img
                      src={logo}
                      className="logo"
                      alt={process.env.REACT_APP_PROJECT_NAME}
                      width="36"
                      height="36"
                    />
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
                    <Menu.Item key="blog">
                      <a href="https://blog.li.finance/" target="_blank" rel="nofollow noreferrer">
                        Blog
                      </a>
                    </Menu.Item>
                    {/* <Menu.Item>
                      <a href="https://docs.li.finance/for-users/user-faq" target="_blank" rel="noreferrer">FAQ</a>
                    </Menu.Item> */}
                    <Menu.Item key="dev-list">
                      <a
                        href="https://docs.google.com/forms/d/e/1FAIpQLSe4vZSN02dmN4W0V_-sB1Aw4erZh577L2h0aDbnzfoRhurPQQ/viewform?usp=send_form"
                        target="_blank"
                        rel="nofollow noreferrer">
                        Developer Waitinglist
                      </a>
                    </Menu.Item>
                    {false && (
                      <Menu.Item key="wallets" style={{ float: 'right' }}>
                        <Button shape="round" icon={<WalletOutlined />}>
                          Add Wallets
                        </Button>
                      </Menu.Item>
                    )}
                  </Menu>
                </Col>

                {/* Links */}
                <Col xs={0} sm={0} md={10} lg={10} xl={10} style={{ paddingRight: 10 }}>
                  <Row justify="end" gutter={15}>
                    <Col>
                      <a
                        className="headerIconLink"
                        href="https://twitter.com/lifiprotocol"
                        target="_blank"
                        rel="nofollow noreferrer">
                        <TwitterOutlined />
                      </a>
                    </Col>
                    <Col>
                      <a
                        className="headerIconLink"
                        href="https://github.com/lifinance"
                        target="_blank"
                        rel="nofollow noreferrer">
                        <GithubOutlined />
                      </a>
                    </Col>
                    <Col>
                      <a
                        className="lifiSupport"
                        href="https://discord.gg/lifi"
                        target="_blank"
                        rel="nofollow noreferrer">
                        Support (Discord)
                      </a>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Header>
            <Content>
              <a
                className="lifiSupport support-content"
                href="https://discord.gg/lifi"
                target="_blank"
                rel="nofollow noreferrer">
                Support
              </a>

              <Switch>
                <Redirect exact from="/" to="/swap" />
                <Route
                  path="/dashboard"
                  render={() => {
                    setMetatags({
                      title: 'Li.Finance - Dashboard',
                    })
                    initStomt('dashboard')
                    return (
                      <>
                        <Dashboard />
                      </>
                    )
                  }}
                />
                <Route
                  path="/swap"
                  render={() => {
                    setMetatags({
                      title: 'Li.Finance - Swap',
                    })
                    initStomt('swap')
                    const transferChains = getTransferChains(
                      process.env.REACT_APP_LIFI_ENABLED_CHAINS_JSON!,
                    )
                    return (
                      <div className="lifiWrap">
                        <Swap transferChains={transferChains} />
                      </div>
                    )
                  }}
                />
                <Route
                  path="/testnet"
                  render={() => {
                    setMetatags({
                      title: 'Li.Finance - Testnet',
                    })
                    initStomt('swap')
                    const transferChains = getTransferChains(
                      process.env.REACT_APP_LIFI_ENABLED_CHAINS_TESTNET_JSON!,
                    )
                    return (
                      <div className="lifiWrap">
                        <Swap transferChains={transferChains} />
                      </div>
                    )
                  }}
                />
                <Route
                  path="/about"
                  render={() => {
                    setMetatags({
                      title: 'Li.Finance - About',
                    })
                    initStomt('lifi')
                    return <AboutPage />
                  }}
                />
                <Route
                  path="*"
                  render={() => {
                    setMetatags({
                      title: 'Li.Finance - Not Found',
                      status: 404,
                    })
                    initStomt('lifi')
                    return <NotFoundPage />
                  }}
                />
              </Switch>
            </Content>
            {/* <Footer></Footer> */}
            <NotificationOverlay />
          </Layout>
        </Web3ConnectionManager>
      </WrappedWeb3ReactProvider>
    </BrowserRouter>
  )
}

export { App }
