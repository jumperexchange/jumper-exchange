import './App.css'
import './AntOverrides.css'

import { DownOutlined, GithubOutlined, TwitterOutlined } from '@ant-design/icons'
import { Button, Col, Layout, Menu, Row } from 'antd'
import { Content, Header } from 'antd/lib/layout/layout'
import { useEffect, useState } from 'react'
import { Link, Redirect, Route, Switch, useLocation } from 'react-router-dom'

import logo from './assets/Li.Fi/LiFi.svg'
import AboutPage from './components/AboutPage'
import Dashboard from './components/Dashboard'
import NotFoundPage from './components/NotFoundPage'
import NotificationOverlay from './components/NotificationsOverlay'
import Swap from './components/Swap'
import SwapUkraine from './components/SwapUkraine'
import WalletButtons from './components/web3/WalletButtons'
import Web3ConnectionManager from './components/web3/Web3ConnectionManager'
import WrappedWeb3ReactProvider from './components/web3/WrappedWeb3ReactProvider'
import analytics from './services/analytics'
import setMetatags from './services/metatags'
import { initStomt } from './services/stomt'

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
  const [adjustToBgGradient, setAdjustToBgGradient] = useState(
    !window.location.href.includes('dashboard') && !window.location.href.includes('ukraine'),
  )
  const location = useLocation()
  const path = usePageViews()

  useEffect(() => {
    setAdjustToBgGradient(
      !window.location.href.includes('dashboard') && !window.location.href.includes('ukraine'),
    )
  }, [location])

  function embedView() {
    setMetatags({
      title: 'Li.Finance - Swap (embed)',
    })
    return (
      <div className="lifiEmbed">
        <Swap />
        <div className="poweredBy">
          powered by{' '}
          <a href="https://li.fi/" target="_blank" rel="nofollow noreferrer">
            LI.FI
          </a>
        </div>
        <div className="wallet-buttons-embed-view">
          <WalletButtons />
        </div>
      </div>
    )
  }
  const isTransferto = window.location.href.includes('transferto')

  return (
    // <BrowserRouter>
    <WrappedWeb3ReactProvider>
      <Web3ConnectionManager>
        {path === '/embed' ? (
          embedView()
        ) : (
          <Layout>
            {!isTransferto && (
              <Header
                className="transferto-disclaimer"
                style={{
                  background: 'black',
                  color: 'white',
                  zIndex: 900,
                  height: 40,
                  position: 'fixed',
                  width: '100%',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {/* <Row> */}
                <div>
                  Li.Finance is moving to{' '}
                  <a
                    href="https://transferto.xyz"
                    target="blank"
                    style={{ color: '#F5B5FF', textDecoration: 'underline', fontWeight: 'bold' }}>
                    transferto.xyz
                  </a>
                </div>
                {/* </Row> */}
              </Header>
            )}

            <Header
              style={{
                position: 'fixed',
                zIndex: 900,
                width: '100%',
                padding: 0,
                top: !isTransferto ? 40 : 0,
                background: adjustToBgGradient ? '#F6F3F2' : '#fff',
              }}>
              <Row className="site-layout-menu">
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
                    <span>LI.FI</span>
                  </Link>
                  <Menu
                    theme="light"
                    mode="horizontal"
                    defaultSelectedKeys={path ? [path] : []}
                    overflowedIndicator={<DownOutlined />}
                    inlineCollapsed={false}>
                    <Menu.Item key="/dashboard">
                      <Link to="/dashboard">Dashboard</Link>
                    </Menu.Item>
                    <Menu.Item key="/swap">
                      <span className="beta-badge">Beta</span>
                      <Link to="/swap">Swap</Link>
                    </Menu.Item>
                    <Menu.Item key="/ukraine" danger={true}>
                      <span className="ukraine-flag">&#127482;&#127462;</span>
                      <Link to="/ukraine">Help Ukraine!</Link>
                    </Menu.Item>
                    <Menu.Item key="/about">
                      <a href="https://li.fi/" target="_blank" rel="nofollow noreferrer">
                        About
                      </a>
                    </Menu.Item>
                    <Menu.Item key="blog">
                      <a href="https://blog.li.finance/" target="_blank" rel="nofollow noreferrer">
                        Blog
                      </a>
                    </Menu.Item>
                    <Menu.Item key="docs">
                      <a href="https://docs.li.finance/" target="_blank" rel="nofollow noreferrer">
                        Explore Docs
                      </a>
                    </Menu.Item>
                    {/* <Menu.Item>
                      <a href="https://docs.li.finance/for-users/user-faq" target="_blank" rel="noreferrer">FAQ</a>
                    </Menu.Item> */}
                    {/* <Menu.Item key="dev-list">
                      <a
                        href="https://docs.google.com/forms/d/e/1FAIpQLSe4vZSN02dmN4W0V_-sB1Aw4erZh577L2h0aDbnzfoRhurPQQ/viewform?usp=send_form"
                        target="_blank"
                        rel="nofollow noreferrer">
                        Developer Waitinglist
                      </a>
                    </Menu.Item> */}
                    <Menu.Item className="wallet-buttons-menu-collapse" key="wallet-button">
                      <WalletButtons className="wallet-buttons menu-collapse"></WalletButtons>
                    </Menu.Item>
                  </Menu>
                </Col>

                {/* Links */}
                <Col
                  xs={0}
                  sm={0}
                  md={10}
                  lg={10}
                  xl={10}
                  style={{ float: 'right', paddingRight: 10 }}>
                  <Row justify="end" gutter={15}>
                    <Col>
                      <a
                        className="icon-link headerIconLink lifi-header-social-links"
                        href="https://twitter.com/lifiprotocol"
                        target="_blank"
                        rel="nofollow noreferrer">
                        <TwitterOutlined />
                      </a>
                    </Col>
                    <Col>
                      <a
                        className="icon-link headerIconLink lifi-header-social-links"
                        href="https://github.com/lifinance"
                        target="_blank"
                        rel="nofollow noreferrer">
                        <GithubOutlined />
                      </a>
                    </Col>
                    <Col>
                      <a
                        style={{ padding: '12px 24px 12px 24px' }}
                        className="lifi-support-link headerIconLink lifi-header-social-links"
                        href="https://discord.gg/lifi"
                        target="_blank"
                        rel="nofollow noreferrer">
                        Support
                      </a>
                    </Col>
                    <Col>
                      <WalletButtons className="wallet-buttons wallet-buttons-menu-full"></WalletButtons>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Header>

            <Content>
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
                    return (
                      <div className="lifiWrap">
                        <Swap />
                      </div>
                    )
                  }}
                />
                <Route
                  path="/ukraine"
                  render={() => {
                    setMetatags({
                      title: 'Li.Finance - Help Ukraine!',
                    })
                    initStomt('swap')
                    return (
                      <div className="lifiWrap">
                        <SwapUkraine />
                      </div>
                    )
                  }}
                />
                {/* <Route
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
                  /> */}
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

            {/* Social Links */}
            <div className="lifi-content-social-links">
              <a
                className="icon-link"
                href="https://twitter.com/lifiprotocol"
                target="_blank"
                rel="nofollow noreferrer">
                <TwitterOutlined />
              </a>
              <a
                className="icon-link"
                href="https://github.com/lifinance"
                target="_blank"
                rel="nofollow noreferrer">
                <GithubOutlined />
              </a>
              <Button
                className="lifi-support-link"
                href="https://discord.gg/lifi"
                target="_blank"
                rel="nofollow noreferrer">
                Support
              </Button>
            </div>

            {/* <Footer></Footer> */}
            <NotificationOverlay />
          </Layout>
        )}
      </Web3ConnectionManager>
    </WrappedWeb3ReactProvider>
    // </BrowserRouter>
  )
}

export { App }
