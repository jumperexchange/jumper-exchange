// LIBS
import { LoginOutlined, SwapOutlined, SyncOutlined } from '@ant-design/icons';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Button, Col, Form, Image, Modal, Row } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import Title from 'antd/lib/typography/Title';
import axios, { CancelTokenSource } from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import heroImage from '../assets/info_header.png';
import { getBalancesForWallet } from '../services/balanceService';
import { loadTokenListAsTokens } from '../services/tokenListService';
import { formatTokenAmountOnly } from '../services/utils';
import { ChainKey, ChainPortfolio, Token } from '../types';
import { defaultTokens, getChainByKey } from '../types/lists';
import { DepositAction, TranferStep, WithdrawAction } from '../types/server';
import Route from './Route';
import './Swap.css';
import SwapForm from './SwapForm';
import Swapping from './Swapping';
import { injected } from './web3/connectors';

const transferChains = [
  getChainByKey(ChainKey.POL),
  getChainByKey(ChainKey.BSC),
  getChainByKey(ChainKey.DAI),
]

interface TokenWithAmounts extends Token {
  amount?: number
  amountRendered?: string
}
let source: CancelTokenSource | undefined = undefined

const Swap = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [unused, setStateUpdate] = useState<number>(0)

  // From
  const [depositChain, setDepositChain] = useState<ChainKey>(ChainKey.POL)
  const [depositAmount, setDepositAmount] = useState<number>(1)
  const [depositToken, setDepositToken] = useState<string | undefined>() // tokenId
  const [withdrawChain, setWithdrawChain] = useState<ChainKey>(ChainKey.DAI)
  const [withdrawAmount, setWithdrawAmount] = useState<number>(Infinity)
  const [withdrawToken, setWithdrawToken] = useState<string | undefined>() // tokenId
  const [tokens, setTokens] = useState<{ [ChainKey: string]: Array<TokenWithAmounts> }>(defaultTokens)
  const [refreshTokens, setRefreshTokens] = useState<boolean>(true)
  const [balances, setBalances] = useState<{ [ChainKey: string]: Array<ChainPortfolio> }>()
  const [refreshBalances, setRefreshBalances] = useState<boolean>(true)

  // Routes
  const [routes, setRoutes] = useState<Array<Array<TranferStep>>>([])
  const [routesLoading, setRoutesLoading] = useState<boolean>(false)
  const [noRoutesAvailable, setNoRoutesAvailable] = useState<boolean>(false)
  const [selectedRoute, setselectedRoute] = useState<Array<TranferStep>>([])
  const [selectedRouteIndex, setselectedRouteIndex] = useState<number>()
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)

  // Wallet
  const web3 = useWeb3React<Web3Provider>()
  const { activate } = useWeb3React()
  const login = () => activate(injected)

  const getSelectedWithdraw = () => {
    if (highlightedIndex === -1) {
      return '0.0'
    } else {
      const selectedRoute = routes[highlightedIndex]
      const lastStep = selectedRoute[selectedRoute.length - 1]
      if (lastStep.action.type === 'withdraw') {
        return formatTokenAmountOnly(lastStep.action.token, lastStep.estimate?.toAmount)
      } else if (lastStep.action.type === '1inch' || lastStep.action.type === 'paraswap') {
        return formatTokenAmountOnly(lastStep.action.toToken, lastStep.estimate?.toAmount)
      } else {
        return '0.0'
      }
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
  }, [refreshTokens])

  useEffect(() => {
    if (refreshBalances && web3.account) {
      setRefreshBalances(false)

      getBalancesForWallet(web3.account)
        .then(setBalances)
    }
  }, [refreshBalances, web3.account])

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
  }, [tokens, balances])

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
          chainKey: depositChain,
          chainId: getChainByKey(depositChain).id,
          token: dToken,
          amount: depositAmount ? Math.floor(depositAmount * (10 ** dToken.decimals)) : Infinity
        }

        const wToken = findToken(withdrawChain, withdrawToken)
        const withdraw: WithdrawAction = {
          type: 'withdraw',
          chainKey: withdrawChain,
          chainId: getChainByKey(withdrawChain).id,
          token: wToken,
          amount: Infinity
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

          // remove swaps with native coins
          const filteredRoutes: Array<Array<TranferStep>> = result.data.filter((path: Array<TranferStep>) => {
            for (const step of path) {
              if (step.action.type === 'swap') {
                if (step.action.fromToken.id === '0x0000000000000000000000000000000000000000' || step.action.toToken.id === '0x0000000000000000000000000000000000000000') {
                  return false
                }
              }
            }
            return true
          })

          // sortedRoutes
          const sortedRoutes = filteredRoutes.sort((routeA, routeB) => {
            const routeAResult = routeA[routeA.length - 1].estimate?.toAmount || 0
            const routeBResult = routeB[routeB.length - 1].estimate?.toAmount || 0

            return routeBResult - routeAResult
          })

          setRoutes(sortedRoutes)
          setHighlightedIndex(filteredRoutes.length === 0 ? -1 : 0)
          setNoRoutesAvailable(filteredRoutes.length === 0)
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

  const openSwapModal = () => {
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

    return <Button disabled={highlightedIndex === -1} shape="round" type="primary" icon={<SwapOutlined />} size={"large"} onClick={() => openSwapModal()}>Swap</Button>
  }

  return (
    <Content className="site-layout" style={{minHeight: 'calc(100vh - 64px)'}}>
      <div className="swap-view" style={{ minHeight: '900px', maxWidth: 1600, margin: 'auto' }}>

        {/* Hero Image */}
        <Row style={{ width: '80%', margin: '24px auto 0',transition: 'opacity 200ms', opacity: routes.length ? 0.3 : 1 }} justify={'center'}>
          <Image
            className="hero-image"
            src={heroImage}
          />
        </Row>

        {/* Swap Form */}
        <Row style={{margin: 20}} justify={"center"} className="swap-form">
          <Col>
            <div className="swap-input" style={{ maxWidth: 450, borderRadius: 6, padding: 24, margin: "0 auto" }}>
              <Row>
                <Title className="swap-title" level={4}>Please Specify Your Transaction</Title>
              </Row>

              <Form>
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

                <Row style={{ marginTop: 24 }} justify={"center"}>
                  {submitButton()}
                </Row>
              </Form>

            </div>
          </Col>
        </Row>

        {/* Routes */}
        <Row justify={"center"} style={{ marginTop: 48 }}>
          {routes.length > 0 &&
            <Col>
              <h3 style={{ textAlign: 'center' }}>Available routes<br className="only-mobile" /> (sorted by estimated withdraw)</h3>
              <div style={{ display: 'flex', flexDirection: 'row', overflowX: 'scroll' }}>
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
              <Row gutter={[32, 62]} justify={"center"} style={{ marginTop: 48 }}>
                <h3 style={{ textAlign: 'center' }}>Loading...</h3>
              </Row>
            </Col>
          }
          {!routesLoading && noRoutesAvailable &&
            <Col>
              <h3 style={{ textAlign: 'center' }}>No Route Found</h3>
            </Col>
          }
        </Row>

      </div>

      {selectedRoute.length &&
        <Modal
          className="swapModal"
          visible={selectedRoute.length > 0}
          onOk={() => setselectedRoute([])}
          onCancel={() => setselectedRoute([])}
          width={700}
          footer={null}
        >
          <Swapping route={selectedRoute} updateRoute={(route: any) => updateRoute(route, selectedRouteIndex ?? 0)}></Swapping>
        </Modal>
      }
    </Content>
  )
}

export default Swap
