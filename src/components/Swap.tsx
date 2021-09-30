// LIBS
import { LoginOutlined, SwapOutlined, SyncOutlined } from '@ant-design/icons';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Button, Col, Collapse, Form, Image, Modal, Row, Typography } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import Title from 'antd/lib/typography/Title';
import axios, { CancelTokenSource } from 'axios';
import BigNumber from 'bignumber.js';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import heroImage from '../assets/info_header.png';
import { loadTokenListAsTokens } from '../services/tokenListService';
import { formatTokenAmountOnly } from '../services/utils';
import { Chain, ChainKey, ChainPortfolio, defaultTokens, DepositAction, getChainByKey, Token, TransferStep, WithdrawAction } from '../types';
import LoadingIndicator from './LoadingIndicator';
import Route from './Route';
import './Swap.css';
import SwapForm from './SwapForm';
import Swapping from './Swapping';
import { injected } from './web3/connectors';
import {animate, stagger} from "motion"
import { deleteActiveRoute, readActiveRoute } from '../services/localStorage';

const { Panel } = Collapse;

interface TokenWithAmounts extends Token {
  amount?: number
  amountRendered?: string
}
let source: CancelTokenSource | undefined = undefined

interface SwapProps {
  transferChains: Chain[]
  getBalancesForWallet: Function
}


const fadeInAnimation = ( element: React.MutableRefObject<HTMLDivElement | null>) =>{
  animate(element.current?.childNodes as NodeListOf<Element>,{
    y: ["50px", "0px"],
    opacity:[0, 1],
  },{
    delay: stagger(0.2),
    duration: 0.5,
    easing: "ease-in-out"
  })
}

const Swap = ({
  transferChains,
  getBalancesForWallet,
}: SwapProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [unused, setStateUpdate] = useState<number>(0)

  // From
  const [depositChain, setDepositChain] = useState<ChainKey>(transferChains[0].key)
  const [depositAmount, setDepositAmount] = useState<number>(1)
  const [depositToken, setDepositToken] = useState<string | undefined>() // tokenId
  const [withdrawChain, setWithdrawChain] = useState<ChainKey>(transferChains[1].key)
  const [withdrawAmount, setWithdrawAmount] = useState<number>(Infinity)
  const [withdrawToken, setWithdrawToken] = useState<string | undefined>() // tokenId
  const [tokens, setTokens] = useState<{ [ChainKey: string]: Array<TokenWithAmounts> }>(defaultTokens)
  const [refreshTokens, setRefreshTokens] = useState<boolean>(true)
  const [balances, setBalances] = useState<{ [ChainKey: string]: Array<ChainPortfolio> }>()
  const [refreshBalances, setRefreshBalances] = useState<boolean>(true)

  // Routes
  const [routes, setRoutes] = useState<Array<Array<TransferStep>>>([])
  const [routesLoading, setRoutesLoading] = useState<boolean>(false)
  const [noRoutesAvailable, setNoRoutesAvailable] = useState<boolean>(false)
  const [selectedRoute, setselectedRoute] = useState<Array<TransferStep>>(readActiveRoute()) //TODO: read Selected route from localStorage or equivalent
  const [selectedRouteIndex, setselectedRouteIndex] = useState<number>()
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)

  // Wallet
  const web3 = useWeb3React<Web3Provider>()
  const { activate } = useWeb3React()
  const login = () => activate(injected)

  // Elements used for animations
  const routeCards = useRef<HTMLDivElement | null>(null)

  const getSelectedWithdraw = () => {
    if (highlightedIndex === -1) {
      return '0.0'
    } else {
      const selectedRoute = routes[highlightedIndex]
      const lastStep = selectedRoute[selectedRoute.length - 1]
      return formatTokenAmountOnly((lastStep.action as any).toToken, lastStep.estimate?.toAmount)
    }
  }

  useEffect(() => {
    if (refreshTokens) {
      setRefreshTokens(false)

      transferChains.map(async (chain) => {
        const newTokens = {
          [chain.key]: (await loadTokenListAsTokens(chain.id))
        }
        setTokens(tokens => Object.assign(tokens, newTokens))
        setStateUpdate((stateUpdate) => stateUpdate + 1)
      })
    }
  }, [refreshTokens, transferChains])

  useEffect(() => {
    if (refreshBalances && web3.account) {
      setRefreshBalances(false)
      getBalancesForWallet(web3.account, transferChains.map(chain => chain.id))
        .then(setBalances)
    }
  }, [refreshBalances, getBalancesForWallet, transferChains, web3.account])

  useEffect(() => {
    if (!web3.account) {
      setBalances(undefined) // reset old balances
    } else {
      setRefreshBalances(true)
    }
  }, [web3.account])


  const getBalance = (currentBalances: { [ChainKey: string]: Array<ChainPortfolio> } | undefined, chainKey: ChainKey, tokenId: string) => {
    if (!currentBalances) {
      return 0
    }

    const tokenBalance = currentBalances[chainKey].find(portfolio => portfolio.id === tokenId)
    return tokenBalance?.amount || 0
  }

  useEffect(() => {
    // merge tokens and balances
    if (!balances) {
      for (const chain of transferChains) {
        for (const token of tokens[chain.key]) {
          token.amount = -1
          token.amountRendered = ''
        }
      }
    } else {
      for (const chain of transferChains) {
        for (const token of tokens[chain.key]) {
          token.amount = getBalance(balances, chain.key, token.id)
          token.amountRendered = token.amount.toFixed(4)
        }
      }
    }

    setTokens(tokens)
    setStateUpdate((stateUpdate) => stateUpdate + 1)
  }, [tokens, balances, transferChains])

  const hasSufficientBalance = () => {
    if (!depositToken) {
      return true
    }
    return depositAmount <= getBalance(balances, depositChain, depositToken)
  }

  const findToken = useCallback((chainKey: ChainKey, tokenId: string) => {
    const token = tokens[chainKey].find(token => token.id === tokenId)
    if (!token) {
      throw new Error('Token not found')
    }
    return token
  }, [tokens])

  useEffect(() => {
    const getTransferRoutes = async () => {
      setRoutes([])
      setHighlightedIndex(-1)
      setNoRoutesAvailable(false)

      if ((isFinite(depositAmount) && depositAmount > 0) && depositChain && depositToken && withdrawChain && withdrawToken) {
        setRoutesLoading(true)
        const dToken = findToken(depositChain, depositToken)
        const deposit: DepositAction = {
          type: 'deposit',
          chainId: getChainByKey(depositChain).id,
          token: dToken,
          amount: new BigNumber(depositAmount).shiftedBy(dToken.decimals).toFixed(0)
        }

        const wToken = findToken(withdrawChain, withdrawToken)
        const withdraw: WithdrawAction = {
          type: 'withdraw',
          chainId: getChainByKey(withdrawChain).id,
          token: wToken,
          amount: '',
          toAddress: '',
        }

        // cancel previously running requests
        if (source) {
          source.cancel('cancel for new request')
        }
        source = axios.CancelToken.source()
        const cancelToken = source.token
        const config = {
          cancelToken
        }

        try {
          const result = await axios.post(process.env.REACT_APP_API_URL + 'transfer', { deposit, withdraw }, config)
          // filter if needed
          const routes: Array<Array<TransferStep>> = result.data
          setRoutes(routes)
          fadeInAnimation(routeCards)
          setHighlightedIndex(routes.length === 0 ? -1 : 0)
          setNoRoutesAvailable(routes.length === 0)
          setRoutesLoading(false)

        } catch (err) {
          // check if it we are still loading a new request
          if (!axios.isCancel(err)) {
            setNoRoutesAvailable(true)
            setRoutesLoading(false)
          }
        } finally {
          source = undefined
        }
      }
    }

    getTransferRoutes()
  }, [depositAmount, depositChain, depositToken, withdrawChain, withdrawToken, findToken])

  const setRouteAndIndex = () => {
    // TODO: open swap modal on load when route in localStorage or equivalent
    setselectedRoute(routes[highlightedIndex])
    setselectedRouteIndex(highlightedIndex)
  }

  const updateRoute = (route: any, index: number) => {
    const newRoutes = [
      ...routes.slice(0, index),
      route,
      ...routes.slice(index + 1)
    ]
    setRoutes(newRoutes)
  }

  const submitButton = () => {
    if (!web3.account) {
      return <Button shape="round" type="primary" icon={<LoginOutlined />} size={"large"} onClick={() => login()}>Connect Wallet</Button>
    }
    if (routesLoading) {
      return <Button disabled={true} shape="round" type="primary" icon={<SyncOutlined spin />} size={"large"}>Searching Routes...</Button>
    }
    if (noRoutesAvailable) {
      return <Button disabled={true} shape="round" type="primary" size={"large"}>No Route Found</Button>
    }
    if (!hasSufficientBalance()) {
      return <Button disabled={true} shape="round" type="primary" size={"large"}>Insufficient Funds</Button>
    }

    return <Button disabled={highlightedIndex === -1} shape="round" type="primary" icon={<SwapOutlined />} size={"large"} onClick={() => setRouteAndIndex()}>Swap</Button>
  }

  return (
    <Content className="site-layout" style={{ minHeight: 'calc(100vh - 64px)', marginTop: 64 }}>
      <div className="swap-view" style={{ minHeight: '900px', maxWidth: 1600, margin: 'auto' }}>

        {/* Hero Image */}
        <Row className='row-hero-image' style={{ width: '80%', margin: '24px auto 0', transition: 'opacity 200ms', opacity: routes.length ? 0.3 : 1 }} justify={'center'}>
          <Image
            className="hero-image"
            src={heroImage}
          />
        </Row>

        {/* Swap Form */}
        <Row style={{ margin: 20 }} justify={"center"}>
          <Col className="swap-form">
            <div className="swap-input" style={{ maxWidth: 450, borderRadius: 6, padding: 24, margin: "0 auto" }}>
              <Row>
                <Title className="swap-title" level={4}>Please Specify Your Transaction</Title>
              </Row>

              <Form >
                <SwapForm
                  depositChain={depositChain}
                  setDepositChain={setDepositChain}
                  depositToken={depositToken}
                  setDepositToken={setDepositToken}
                  depositAmount={depositAmount}
                  setDepositAmount={setDepositAmount}

                  withdrawChain={withdrawChain}
                  setWithdrawChain={setWithdrawChain}
                  withdrawToken={withdrawToken}
                  setWithdrawToken={setWithdrawToken}
                  withdrawAmount={withdrawAmount}
                  setWithdrawAmount={setWithdrawAmount}
                  estimatedWithdrawAmount={getSelectedWithdraw()}

                  transferChains={transferChains}
                  tokens={tokens}
                  balances={balances}
                  allowSameChains={true}
                />
              <span>
                  <Row  style={{ marginTop: 24 }} justify={"center"}>
                    {submitButton()}
                  </Row>

                  {/* Disclaimer */}
                  <Row justify={"center"} className="beta-disclaimer">
                    <Typography.Text type="danger" style={{textAlign: 'center'}}>
                      Please note that this is a beta product. <br />
                      We currently recommend using only Metamask Wallets.
                    </Typography.Text>
                  </Row>
              </span>

              </Form>

            </div>
          </Col>
        </Row>

        {/* Routes */}
        <Row justify={"center"} style={{ marginLeft: 12,marginRight: 12, marginTop: 48, padding: 12 }}>
          {routes.length > 0 &&
            <Col>
              <h3 style={{ textAlign: 'center' }}>Available routes<br className="only-mobile" /> (sorted by estimated withdraw)</h3>
              <div style={{ display: 'flex', flexDirection: 'row', overflowX: 'scroll' }} ref={routeCards}>
                {
                  routes.map((route, index) => (
                    <Route
                      key={index}
                      route={route}
                      selected={highlightedIndex === index}
                      onSelect={() => setHighlightedIndex(index)}
                    />
                  ))
                }
              </div>
            </Col>
          }
          {routesLoading &&
            <Col>
              <Row gutter={[32, 62]} justify={"center"} style={{ marginTop: 0 }}>
                <LoadingIndicator></LoadingIndicator>
              </Row>
            </Col>
          }
          {!routesLoading && noRoutesAvailable &&
            <Col style={{width: "50%"}} className="no-routes-found">
              <h3 style={{ textAlign: 'center' }}>No Route Found</h3>
              <Typography.Text type="secondary" style={{ textAlign: 'left' }}>
                We couldn't find suitable routes for your desired transfer.
                We do have some suggestions why that could be: <br />
                </Typography.Text>
                <Collapse ghost className="no-route-custom-collapse">

                  <Panel header="A route for this transaction simply does not exist yet." key="1">
                    <p style={{color:"grey"}}>
                      We are working hard on integrating more exchanges to find possible transactions for you!
                      Look out for updates and try again later.
                    </p>
                  </Panel>

                  <Panel header="You are not sending enough tokens - Try a greater amount." key="2">
                    <p style={{color:"grey"}}>
                      Transactions cost money. These transaction costs are deducted from your swapping amount.
                      If this amount is not enough to cover the expenses, we can not execute the transaction or compute routes.
                    </p>
                  </Panel>
                </Collapse>
            </Col>
          }
        </Row>

      </div>

      {selectedRoute.length &&
        <Modal
          className="swapModal"
          visible={selectedRoute.length > 0}
          maskClosable={false}
          onOk={() =>{
            setselectedRoute([])
            setRefreshBalances(true)
          }}
          onCancel={() => {
            setselectedRoute([])
            setRefreshBalances(true)
          }}
          width={700}
          footer={null}
        >
          <Swapping route={selectedRoute}
          updateRoute={(route: any) => updateRoute(route, selectedRouteIndex ?? 0)}
          onSwapDone = {() => {
            deleteActiveRoute()
            getBalancesForWallet(web3.account, transferChains.map(chain => chain.id))
            .then(setBalances)
          }}
          ></Swapping>
        </Modal>
      }
    </Content>
  )
}

export default Swap
