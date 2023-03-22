import './AntOverrides.css'
import './App.css'

import { GithubOutlined, TwitterOutlined } from '@ant-design/icons'
import { Button, Col, Layout, Menu, Row } from 'antd'
import { Content, Header } from 'antd/lib/layout/layout'
import { useEffect, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'

import DiscordIcon from './assets/icons/discordIcon'
import { PoweredByLiFi } from './assets/Li.Fi/poweredByLiFi'
import Carbon_Neutral_Protocol from './assets/misc/Carbon_Neutral_Protocol.png'
import Claiming from './components/Claiming'
import Dashboard from './components/Dashboard'
import { DiscordPopup } from './components/DiscordPopup'
import SwapCarbonOffsetEmbed from './components/EmbedViews/SwapCarbonOffsetEmbed'
import SwapEtherspotKlimaZapEmbed from './components/EmbedViews/SwapEtherspotKlimaZapEmbed'
import HistoryMigration from './components/HistoryMigration'
import NotFoundPage from './components/NotFoundPage'
import { Swap } from './components/Swap'
import SwapCarbonOffset from './components/SwapCarbonOffset'
import SwapCarbonOffsetV2 from './components/SwapCarbonOffsetV2'
import SwapEtherspotKlimaZap from './components/SwapEtherspotKlimaZap'
import SwapKlimaStakeV2 from './components/SwapKlimaStakeV2'
import SwapUkraine from './components/SwapUkraine'
import SwapV1 from './components/SwapV1'
import WalletButtons from './components/web3/WalletButtons'
import {
  ENABLE_KLIMA_STAKE_SHOWCASE,
  VITE_ENABLE_OFFSET_CARBON_SHOWCASE,
} from './constants/featureFlags'
import { useNavConfig } from './hooks/useNavConfig'
import { usePageViews } from './hooks/usePageViews'
import { ChainsTokensToolsProvider } from './providers/chainsTokensToolsProvider'
import { ToSectionCarbonOffsetProvider } from './providers/ToSectionCarbonOffsetProvider'
import { WalletProvider } from './providers/WalletProvider'
import setMetatags from './services/metatags'

function App() {
  const navConfig = useNavConfig()
  const location = useLocation()
  const path = usePageViews()
  const [adjustNavbar, setAdjustNavbar] = useState(location.pathname.includes('showcase'))
  const [showDiscordPopup, setShowDiscordPopup] = useState(false)

  useEffect(() => {
    setAdjustNavbar(location.pathname.includes('showcase'))
  }, [location])

  function offsetCarbonEmbedView() {
    setMetatags({
      title: 'LI.FI - Offset Carbon',
    })
    return (
      <div className="lifiEmbed">
        <ToSectionCarbonOffsetProvider>
          <SwapCarbonOffsetEmbed />
        </ToSectionCarbonOffsetProvider>

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

  // function widgetEmbed() {
  //   setMetatags({
  //     title: 'LI.FI - Swap',
  //   })
  //   const widgetConfig = {
  //     containerStyle: {
  //       borderRadius: '16px',
  //       boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
  //     },
  //   }

  //   return <LiFiWidget config={widgetConfig} />
  // }

  return (
    <WalletProvider>
      <ChainsTokensToolsProvider>
        {path === '/embed/carbon-offset' ? (
          offsetCarbonEmbedView()
        ) : path === '/embed/stake-klima' ? (
          stakeKlimaEmbedView()
        ) : (
          <Layout>
            <Header
              style={{
                position: adjustNavbar ? 'fixed' : 'absolute',
                zIndex: 900,
                width: '100%',
                padding: 0,
                top: 0,
                background: adjustNavbar ? 'white' : 'transparent',
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
                    items={navConfig}
                    theme="light"
                    mode="horizontal"
                    triggerSubMenuAction="hover"
                    defaultSelectedKeys={path ? [path] : []}
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
                        style={{
                          padding: '13.5px 24px 13.5px 24px',
                        }}
                        className="lifi-support-link headerIconLink lifi-header-social-links"
                        // href="https://discord.com/channels/849912621360218112/863689862514343946"
                        // target="_blank"
                        // rel="nofollow noreferrer"
                        onClick={() => {
                          setShowDiscordPopup(true)
                        }}>
                        <DiscordIcon style={{ marginRight: 4 }} /> Support
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
              <Routes>
                <Route path="/" element={<Navigate to="/swap" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route
                  path="/swap/*"
                  element={
                    <div className="lifiWrap swap-page">
                      <Swap />
                    </div>
                  }
                />
                <Route
                  path="/claiming"
                  element={
                    <div className="lifiWrap claim-page">
                      <Claiming />
                    </div>
                  }
                />
                <Route
                  path="/swap-v1"
                  element={
                    <div className="lifiWrap swap-page-v1">
                      <SwapV1 />
                    </div>
                  }
                />
                <Route
                  path="/showcase/ukraine"
                  element={
                    <div className="lifiWrap">
                      <SwapUkraine />
                    </div>
                  }
                />
                <Route path="/ukraine" element={<Navigate to="/showcase/ukraine" />} />
                <Route
                  path="/showcase/etherspot-klima"
                  element={
                    <div className="lifiWrap">
                      <SwapEtherspotKlimaZap />
                    </div>
                  }
                />

                <Route
                  path="/showcase/carbon-offset"
                  element={
                    <div className="lifiWrap">
                      <ToSectionCarbonOffsetProvider>
                        <SwapCarbonOffset />
                      </ToSectionCarbonOffsetProvider>
                    </div>
                  }
                />

                {VITE_ENABLE_OFFSET_CARBON_SHOWCASE && (
                  <Route
                    path="/showcase/carbon-offset-v2"
                    element={
                      <div className="lifiWrap">
                        <ToSectionCarbonOffsetProvider>
                          <SwapCarbonOffsetV2 />
                        </ToSectionCarbonOffsetProvider>
                      </div>
                    }
                  />
                )}
                {ENABLE_KLIMA_STAKE_SHOWCASE && (
                  <Route
                    path="/showcase/klima-stake-v2"
                    element={
                      <div className="lifiWrap">
                        <SwapKlimaStakeV2 />
                      </div>
                    }
                  />
                )}

                {/* <Route
                    path="/testnet"
                    element={() => {
                      setMetatags({
                        title: 'LI.FI - Testnet',
                      })
                      initStomt('swap')
                      const transferChains = getTransferChains(
                        import.meta.env.VITE_LIFI_ENABLED_CHAINS_TESTNET_JSON!,
                      )
                      return (
                        <div className="lifiWrap">
                          <Swap transferChains={transferChains} />
                        </div>
                      )
                    }}
                  /> */}
                <Route path="/history-migration" element={<HistoryMigration />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
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
                onClick={() => {
                  setShowDiscordPopup(true)
                }}>
                <DiscordIcon style={{ marginRight: 4 }} /> Support
              </Button>
            </div>

            {/* <Footer></Footer> */}
            {/* <NotificationOverlay /> */}
            {!location.pathname.includes('dashboard') && (
              <a
                className="carbon-neutral-btn"
                href="https://www.klimadao.finance/infinity"
                target="_blank"
                rel="nofollow noreferrer">
                <img src={Carbon_Neutral_Protocol} width="250" alt="Carbon_Neutral_Protocol" />
              </a>
            )}

            <DiscordPopup show={showDiscordPopup} handleClose={() => setShowDiscordPopup(false)} />
          </Layout>
        )}
      </ChainsTokensToolsProvider>
    </WalletProvider>
  )
}

export { App }
