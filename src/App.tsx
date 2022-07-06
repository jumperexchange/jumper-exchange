import './App.css'
import './AntOverrides.css'

import { DownOutlined, GithubOutlined, TwitterOutlined } from '@ant-design/icons'
import { Button, Col, Layout, Menu, Row } from 'antd'
import { Content, Header } from 'antd/lib/layout/layout'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import { useEffect, useState } from 'react'
import { Link, Redirect, Route, Switch, useLocation } from 'react-router-dom'

import { PoweredByLiFi } from './assets/Li.Fi/poweredByLiFi'
import Dashboard from './components/Dashboard'
import SwapCarbonOffsetEmbed from './components/EmbedViews/SwapCarbonOffsetEmbed'
import SwapEtherspotKlimaZapEmbed from './components/EmbedViews/SwapEtherspotKlimaZapEmbed'
import NotFoundPage from './components/NotFoundPage'
import Swap from './components/Swap'
import SwapCarbonOffset from './components/SwapCarbonOffset'
import SwapEtherspotKlimaZap from './components/SwapEtherspotKlimaZap'
import SwapUkraine from './components/SwapUkraine'
import WalletButtons from './components/web3/WalletButtons'
import Web3ConnectionManager from './components/web3/Web3ConnectionManager'
import WrappedWeb3ReactProvider from './components/web3/WrappedWeb3ReactProvider'
import { usePageViews } from './hooks/usePageViews'
import { ChainsTokensToolsProvider } from './providers/chainsTokensToolsProvider'
import setMetatags from './services/metatags'
import { initStomt } from './services/stomt'

const ENABLE_ETHERSPOT_KLIMA_SHOWCASE = process.env.REACT_APP_ENABLE_ETHERSPOT_KLIMA === 'true'
const REACT_APP_ENABLE_OFFSET_CARBON_SHOWCASE =
  process.env.REACT_APP_ENABLE_OFFSET_CARBON === 'true'

function App() {
  const location = useLocation()
  const path = usePageViews()
  const [adjustNavBarToBgGradient, setAdjustNavBarToBgGradient] = useState(
    !location.pathname.includes('dashboard') && !location.pathname.includes('showcase'),
  )

  useEffect(() => {
    setAdjustNavBarToBgGradient(
      !location.pathname.includes('dashboard') && !location.pathname.includes('showcase'),
    )
  }, [location])

  function swapEmbedView() {
    setMetatags({
      title: 'LI.FI - Swap',
    })
    return (
      <div className="lifiEmbed">
        <Swap />
        <div className="poweredBy">
          <a href="https://li.fi/" target="_blank" rel="nofollow noreferrer">
            <PoweredByLiFi />
          </a>
        </div>
        <div className="wallet-buttons-embed-view">
          <WalletButtons />
        </div>
      </div>
    )
  }

  function offsetCarbonEmbedView() {
    setMetatags({
      title: 'LI.FI - Offset Carbon',
    })
    return (
      <div className="lifiEmbed">
        <SwapCarbonOffsetEmbed />
        {/* <div className="poweredBy">
          <a href="https://li.fi/" target="_blank" rel="nofollow noreferrer">
            <PoweredByLiFi />
          </a>
        </div> */}
        {/* <div className="wallet-buttons-embed-view">
          <WalletButtons />
        </div> */}
      </div>
    )
  }
  function stakeKlimaEmbedView() {
    setMetatags({
      title: 'LI.FI - Stake Klima',
    })
    return (
      <div className="lifiEmbed">
        <SwapEtherspotKlimaZapEmbed />
        {/* <div className="poweredBy">
          <a href="https://li.fi/" target="_blank" rel="nofollow noreferrer">
            <PoweredByLiFi />
          </a>
        </div>
        <div className="wallet-buttons-embed-view">
          <WalletButtons />
        </div> */}
      </div>
    )
  }

  const menuItems: ItemType[] = [
    { label: <Link to="/swap">Swap & Bridge</Link>, key: '/swap' },
    { label: <Link to="/dashboard">Dashboard</Link>, key: '/dashboard' },
    {
      label: (
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSe9fDY1zCV3vnaubD0740GHzUYcfZoiz2KK_5TIME-rnIA3sg/viewform"
          target="_blank"
          rel="nofollow noreferrer">
          Developers
        </a>
      ),
      key: 'dev-list',
    },
    {
      label: 'More',
      key: 'lifi-more-submenu',
      children: [
        {
          label: (
            <a href="https://blog.li.finance/" target="_blank" rel="nofollow noreferrer">
              Blog
            </a>
          ),
          key: 'blog',
        },
        {
          label: (
            <a href="https://docs.li.finance/" target="_blank" rel="nofollow noreferrer">
              Explore Docs
            </a>
          ),
          key: 'docs',
        },
        {
          label: (
            <a href="https://li.fi/" target="_blank" rel="nofollow noreferrer">
              About
            </a>
          ),
          key: 'about',
        },
        {
          label: 'Showcases',
          key: 'lifi-showcase-submenu',
          children: [
            {
              key: '/showcase/ukraine',
              label: (
                <>
                  <span className="ukraine-flag">&#127482;&#127462;</span>
                  <Link to="/showcase/ukraine">Help Ukraine!</Link>
                </>
              ),
            },
            {
              type: 'group',
              label: 'Showcases',
              key: '/showcase',
              children: [
                {
                  key: '/showcase/etherspot-klima',
                  label: <Link to="/showcase/etherspot-klima">Cross-Chain Klima Staking</Link>,
                },
                REACT_APP_ENABLE_OFFSET_CARBON_SHOWCASE
                  ? {
                      key: '/showcase/carbon-offset',
                      label: (
                        <Link to="/showcase/carbon-offset">Cross-Chain Carbon Offsetting</Link>
                      ),
                    }
                  : null,
              ],
            },
          ],
        },
        {
          label: 'Legals',
          key: 'legals-submenu',
          children: [
            {
              label: (
                <a href="https://li.fi/legal/privacy-policy/" target={'_blank'} rel="noreferrer">
                  Privacy Policy
                </a>
              ),
              key: 'privacy',
            },
            {
              label: (
                <a href="https://li.fi/legal/imprint/" target={'_blank'} rel="noreferrer">
                  Imprint
                </a>
              ),
              key: 'imprint',
            },
            {
              label: (
                <a
                  href="https://li.fi/legal/terms-and-conditions/"
                  target={'_blank'}
                  rel="noreferrer">
                  Terms & Conditions
                </a>
              ),
              key: 'termsAndConditions',
            },
          ],
        },
      ],
    },
    {
      key: 'wallet-button',
      label: <WalletButtons className="wallet-buttons menu-collapse"></WalletButtons>,
      className: 'wallet-buttons-menu-collapse',
    },
  ]

  return (
    <WrappedWeb3ReactProvider>
      <Web3ConnectionManager>
        <ChainsTokensToolsProvider>
          {path === '/embed' ? (
            swapEmbedView()
          ) : path === '/embed/carbon-offset' ? (
            offsetCarbonEmbedView()
          ) : path === '/embed/stake-klima' ? (
            stakeKlimaEmbedView()
          ) : (
            <Layout>
              <Header
                style={{
                  position: 'fixed',
                  zIndex: 900,
                  width: '100%',
                  padding: 0,
                  top: 0,
                  background: adjustNavBarToBgGradient ? '#F6F3F2' : '#fff',
                }}>
                <Row className="site-layout-menu">
                  {/* Menu */}
                  <Col xs={24} sm={24} md={14} lg={14} xl={14}>
                    <div className="header-linkWrapper">
                      <Link to="/" className="wordmark">
                        transferto.xyz
                      </Link>
                      <a
                        className="header-poweredBy"
                        href="https://li.fi/"
                        target="_blank"
                        rel="nofollow noreferrer">
                        <PoweredByLiFi />
                      </a>
                    </div>
                    <Menu
                      items={menuItems}
                      theme="light"
                      mode="horizontal"
                      triggerSubMenuAction="hover"
                      defaultSelectedKeys={path ? [path] : []}
                      overflowedIndicator={<DownOutlined />}
                      inlineCollapsed={false}
                    />
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
                          style={{ padding: '13.5px 24px 13.5px 24px' }}
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
                        title: 'LI.FI - Dashboard',
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
                        title: 'LI.FI - Swap',
                      })
                      initStomt('swap')
                      return (
                        <div className="lifiWrap swap-page">
                          <Swap />
                        </div>
                      )
                    }}
                  />
                  <Route
                    path="/showcase/ukraine"
                    render={() => {
                      setMetatags({
                        title: 'LI.FI - Help Ukraine!',
                      })
                      return (
                        <div className="lifiWrap">
                          <SwapUkraine />
                        </div>
                      )
                    }}
                  />
                  <Redirect path="/ukraine" to="/showcase/ukraine" />
                  {ENABLE_ETHERSPOT_KLIMA_SHOWCASE && (
                    <Route
                      path="/showcase/etherspot-klima"
                      render={() => {
                        setMetatags({
                          title: 'LI.FI - Etherspot KLIMA',
                        })
                        return (
                          <div className="lifiWrap">
                            <SwapEtherspotKlimaZap />
                          </div>
                        )
                      }}
                    />
                  )}
                  {REACT_APP_ENABLE_OFFSET_CARBON_SHOWCASE && (
                    <Route
                      path="/showcase/carbon-offset"
                      render={() => {
                        setMetatags({
                          title: 'LI.FI - Carbon Offset',
                        })
                        return (
                          <div className="lifiWrap">
                            <SwapCarbonOffset />
                          </div>
                        )
                      }}
                    />
                  )}

                  {/* <Route
                    path="/testnet"
                    render={() => {
                      setMetatags({
                        title: 'LI.FI - Testnet',
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
                    path="*"
                    render={() => {
                      setMetatags({
                        title: 'LI.FI - Not Found',
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
              {/* <NotificationOverlay /> */}
            </Layout>
          )}
        </ChainsTokensToolsProvider>
      </Web3ConnectionManager>
    </WrappedWeb3ReactProvider>
  )
}

export { App }
