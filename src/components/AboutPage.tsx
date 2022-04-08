import './AboutPage.css'

import { Content } from 'antd/lib/layout/layout'
import React from 'react'

import f1 from '../assets/about/feature-icon-01.svg'
import f2 from '../assets/about/feature-icon-02.svg'
import f3 from '../assets/about/feature-icon-03.svg'
import f4 from '../assets/about/feature-icon-04.svg'
import f5 from '../assets/about/feature-icon-05.svg'
import f6 from '../assets/about/feature-icon-06.svg'
import slide from '../assets/about/slideshow.png'
import logo from '../assets/icon192.png'

function AboutPage() {
  return (
    <Content className="site-layout aboutPage">
      <div className="is-boxed">
        <div className="body-wrap">
          <main>
            <section className="hero">
              <div className="container">
                <div className="hero-inner">
                  <div className="hero-copy">
                    <h1 className="hero-title mt-0">Cross-Chain Swap Aggregation</h1>
                    <p className="hero-paragraph">
                      LI.FI provides the best cross-chain swap across all liquidity pools and
                      bridges.
                    </p>
                    <div className="hero-cta">
                      <a
                        className="button button-primary"
                        href="https://twitter.com/lifiprotocol"
                        target="_blank"
                        rel="nofollow noreferrer">
                        Follow on Twitter
                      </a>
                      <a
                        className="button"
                        href="https://docs.li.finance/"
                        target="_blank"
                        rel="nofollow noreferrer">
                        Check our Docs
                      </a>
                    </div>
                  </div>
                  <div className="hero-figure">
                    <a
                      href="https://www.slideshare.net/philippzentner/lifinance-pitchdeck-no-request"
                      target="_blank"
                      rel="nofollow noreferrer">
                      <small>Opens pitchdeck in new tab</small>
                      <img src={slide} alt="LI.FI Pitchdeck" style={{ maxWidth: '100%' }}></img>
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <section className="features section">
              <div className="container">
                <div className="features-inner section-inner has-bottom-divider">
                  <div className="pricing-header text-center">
                    <h2 className="section-title mt-0">
                      The ultimate cross-chain liquidity aggregator
                    </h2>
                    <p className="section-paragraph mb-0">
                      The future is cross-chain and we make sure you don't have to care.
                    </p>
                  </div>
                  <div className="features-wrap">
                    <div className="feature text-center is-revealing">
                      <div className="feature-inner">
                        <div className="feature-icon">
                          <img src={f1} alt="Feature 01" />
                        </div>
                        <h4 className="feature-title mt-24">Cross-Chain Liquidity Networks</h4>
                        <p className="text-sm mb-0">
                          Connext, Hop, Routerprotocol, Thorchain - we aggregate them all.
                        </p>
                      </div>
                    </div>
                    <div className="feature text-center is-revealing">
                      <div className="feature-inner">
                        <div className="feature-icon">
                          <img src={f2} alt="Feature 02" />
                        </div>
                        <h4 className="feature-title mt-24">Decentralized Exchanges (DEXes)</h4>
                        <p className="text-sm mb-0">
                          To be able to allow true any-to-any-swaps, we talk to DEXes and DEX
                          aggregators on all chains.
                        </p>
                      </div>
                    </div>
                    <div className="feature text-center is-revealing">
                      <div className="feature-inner">
                        <div className="feature-icon">
                          <img src={f3} alt="Feature 02" />
                        </div>
                        <h4 className="feature-title mt-24">
                          Lending-Protocols (Borrow & Flash Loans)
                        </h4>
                        <p className="text-sm mb-0">
                          Hello arbitrage my old friend. Borrow funds and get flash-loans across
                          chains, whenever you need it.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pricing-header text-center">
                    <h2 className="section-title mt-10">Dapp Integrations</h2>
                    <p className="section-paragraph mb-0">
                      Having a go-to place is nice, but what if you wouldn't have to leave in order
                      to move your funds over?
                    </p>
                  </div>
                  <div className="features-wrap">
                    <div className="feature text-center is-revealing">
                      <div className="feature-inner">
                        <div className="feature-icon">
                          <img src={f4} alt="Feature 03" />
                        </div>
                        <h4 className="feature-title mt-24">Web-Dapp Integrations</h4>
                        <p className="text-sm mb-0">
                          We've years of experience building truly fast, customizable and
                          maintainable web widgets.
                        </p>
                      </div>
                    </div>
                    <div className="feature text-center is-revealing">
                      <div className="feature-inner">
                        <div className="feature-icon">
                          <img src={f5} alt="Feature 04" />
                        </div>
                        <h4 className="feature-title mt-24">Mobile Integrations</h4>
                        <p className="text-sm mb-0">
                          Mass adoption will only happen once crypto goes fully native. We aim to
                          pave the way for that experience.
                        </p>
                      </div>
                    </div>
                    <div className="feature text-center is-revealing">
                      <div className="feature-inner">
                        <div className="feature-icon">
                          <img src={f6} alt="Feature 05" />
                        </div>
                        <h4 className="feature-title mt-24">Game Engine Integrations</h4>
                        <p className="text-sm mb-0">
                          Almost no other industry feels more at home, having their own currencies.
                          Time to push crypto into games.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>

          <footer className="site-footer">
            <div className="container">
              <div className="site-footer-inner">
                <div className="brand footer-brand">
                  <a href="https://li.finance">
                    <img className="header-logo-image" src={logo} alt="Logo" />
                  </a>
                </div>
                <ul className="footer-social-links list-reset">
                  <li>
                    <a
                      href="https://www.twitter.com/lifiprotocol"
                      target="_blank"
                      rel="nofollow noreferrer">
                      <span className="screen-reader-text">Twitter</span>
                      <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M16 3c-.6.3-1.2.4-1.9.5.7-.4 1.2-1 1.4-1.8-.6.4-1.3.6-2.1.8-.6-.6-1.5-1-2.4-1-1.7 0-3.2 1.5-3.2 3.3 0 .3 0 .5.1.7-2.7-.1-5.2-1.4-6.8-3.4-.3.5-.4 1-.4 1.7 0 1.1.6 2.1 1.5 2.7-.5 0-1-.2-1.5-.4C.7 7.7 1.8 9 3.3 9.3c-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.3 3.1 2.3-1.1.9-2.5 1.4-4.1 1.4H0c1.5.9 3.2 1.5 5 1.5 6 0 9.3-5 9.3-9.3v-.4C15 4.3 15.6 3.7 16 3z"
                          fill="#0270D7"
                        />
                      </svg>
                    </a>
                  </li>
                </ul>
                <div className="footer-copyright">&copy; 2022 LI.FI, all rights reserved</div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </Content>
  )
}

export default AboutPage
