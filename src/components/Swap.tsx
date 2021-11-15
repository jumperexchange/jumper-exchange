import './Swap.css'

import { LoginOutlined, SwapOutlined, SyncOutlined } from '@ant-design/icons'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { Button, Col, Collapse, Form, InputNumber, Modal, Row, Typography } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import Title from 'antd/lib/typography/Title'
import BigNumber from 'bignumber.js'
import { animate, stagger } from 'motion'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'

import { getBalancesForWalletFromChain } from '../services/balanceService'
import LIFI from '../services/LIFI/Lifi'
import { deleteRoute, readActiveRoutes, readHistoricalRoutes } from '../services/localStorage'
import { loadTokenListAsTokens } from '../services/tokenListService'
import { deepClone, formatTokenAmountOnly } from '../services/utils'
import {
  Chain,
  ChainKey,
  ChainPortfolio,
  defaultTokens,
  Route as RouteType,
  RoutesRequest,
  RoutesResponse,
  Token,
} from '../types'
import LoadingIndicator from './LoadingIndicator'
import Route from './Route'
import SwapForm from './SwapForm'
import Swapping from './Swapping'
import TrasactionsTable from './TransactionsTable'
import { injected } from './web3/connectors'

const { Panel } = Collapse

let currentRouteCallId: string

interface TokenWithAmounts extends Token {
  amount?: BigNumber
  amountRendered?: string
}

const fadeInAnimation = (element: React.MutableRefObject<HTMLDivElement | null>) => {
  setTimeout(() => {
    const nodes = element.current?.childNodes
    if (nodes) {
      animate(
        nodes as NodeListOf<Element>,
        {
          y: ['50px', '0px'],
          opacity: [0, 1],
        },
        {
          delay: stagger(0.2),
          duration: 0.5,
          easing: 'ease-in-out',
        },
      )
    }
  }, 0)
}

const filterDefaultTokenByChains = (
  tokens: { [ChainKey: string]: Array<TokenWithAmounts> },
  transferChains: Chain[],
) => {
  const result: { [ChainKey: string]: Array<TokenWithAmounts> } = {}

  transferChains.forEach((chain) => {
    if (tokens[chain.key]) {
      result[chain.key] = tokens[chain.key]
    }
  })
  return result
}

interface SwapProps {
  transferChains: Chain[]
}

const Swap = ({ transferChains }: SwapProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [unused, setStateUpdate] = useState<number>(0)

  // From
  const [fromChainKey, setFromChainKey] = useState<ChainKey>(transferChains[0].key)
  const [depositAmount, setDepositAmount] = useState<BigNumber>(new BigNumber(1))
  const [fromTokenAddress, setFromTokenAddress] = useState<string | undefined>() // tokenId
  const [toChainKey, setToChainKey] = useState<ChainKey>(transferChains[1].key)
  const [withdrawAmount, setWithdrawAmount] = useState<BigNumber>(new BigNumber(Infinity))
  const [toTokenAddress, setToTokenAddress] = useState<string | undefined>() // tokenId
  const [tokens, setTokens] = useState<{ [ChainKey: string]: Array<TokenWithAmounts> }>(
    filterDefaultTokenByChains(defaultTokens, transferChains),
  )
  const [refreshTokens, setRefreshTokens] = useState<boolean>(true)
  const [balances, setBalances] = useState<{ [ChainKey: string]: Array<ChainPortfolio> }>()
  const [refreshBalances, setRefreshBalances] = useState<boolean>(true)
  const [routeCallResult, setRouteCallResult] = useState<{ result: RoutesResponse; id: string }>()

  // Options
  const [optionSlippage, setOptionSlippage] = useState<number>(3)

  // Routes
  const [routes, setRoutes] = useState<Array<RouteType>>([])
  const [routesLoading, setRoutesLoading] = useState<boolean>(false)
  const [noRoutesAvailable, setNoRoutesAvailable] = useState<boolean>(false)
  const [selectedRoute, setSelectedRoute] = useState<RouteType | null>(null)
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
  const [activeRoutes, setActiveRoutes] = useState<Array<RouteType>>(readActiveRoutes())
  const [historicalRoutes, setHistoricalRoutes] = useState<Array<RouteType>>(readHistoricalRoutes())

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
      const lastStep = selectedRoute.steps[selectedRoute.steps.length - 1]
      return formatTokenAmountOnly(lastStep.action.toToken, lastStep.estimate?.toAmount)
    }
  }

  useEffect(() => {
    if (refreshTokens) {
      setRefreshTokens(false)

      transferChains.map(async (chain) => {
        const newTokens = {
          [chain.key]: await loadTokenListAsTokens(chain.id),
        }
        setTokens((tokens) => Object.assign(tokens, newTokens))
        setStateUpdate((stateUpdate) => stateUpdate + 1)
      })
    }
  }, [refreshTokens, transferChains])

  const updateBalances = useCallback(() => {
    if (web3.account) {
      getBalancesForWalletFromChain(web3.account, tokens).then(setBalances)
    }
  }, [web3.account, tokens])

  useEffect(() => {
    if (refreshBalances && web3.account) {
      setRefreshBalances(false)
      updateBalances()
    }
  }, [refreshBalances, web3.account, updateBalances])

  useEffect(() => {
    if (!web3.account) {
      setBalances(undefined) // reset old balances
    } else {
      setRefreshBalances(true)
    }
  }, [web3.account])

  const getBalance = (
    currentBalances: { [ChainKey: string]: Array<ChainPortfolio> } | undefined,
    chainKey: ChainKey,
    tokenId: string,
  ) => {
    if (!currentBalances) {
      return new BigNumber(0)
    }

    const tokenBalance = currentBalances[chainKey].find((portfolio) => portfolio.id === tokenId)
    return tokenBalance?.amount || new BigNumber(0)
  }

  useEffect(() => {
    // merge tokens and balances
    if (!balances) {
      for (const chain of transferChains) {
        for (const token of tokens[chain.key]) {
          token.amount = new BigNumber(-1)
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
    if (!fromTokenAddress) {
      return true
    }

    return depositAmount.lte(getBalance(balances, fromChainKey, fromTokenAddress))
  }

  const findToken = useCallback(
    (chainKey: ChainKey, tokenId: string) => {
      const token = tokens[chainKey].find((token) => token.id === tokenId)
      if (!token) {
        throw new Error('Token not found')
      }
      return token
    },
    [tokens],
  )

  useEffect(() => {
    const getTransferRoutes = async () => {
      setRoutes([])
      setHighlightedIndex(-1)
      setNoRoutesAvailable(false)

      if (depositAmount.gt(0) && fromChainKey && fromTokenAddress && toChainKey && toTokenAddress) {
        setRoutesLoading(true)
        const fromToken = findToken(fromChainKey, fromTokenAddress)
        const toToken = findToken(toChainKey, toTokenAddress)
        const request: RoutesRequest = {
          fromChainId: fromToken.chainId,
          fromAmount: new BigNumber(depositAmount).shiftedBy(fromToken.decimals).toFixed(0),
          fromTokenAddress,
          toChainId: toToken.chainId,
          toTokenAddress,
          options: {
            slippage: optionSlippage / 100,
          },
        }

        const id = uuid()
        try {
          currentRouteCallId = id
          const result = await LIFI.getRoutes(request)
          setRouteCallResult({ result, id })
        } catch {
          if (id === currentRouteCallId || !currentRouteCallId) {
            setNoRoutesAvailable(true)
            setRoutesLoading(false)
          }
        }
      }
    }

    getTransferRoutes()
  }, [
    depositAmount,
    fromChainKey,
    fromTokenAddress,
    toChainKey,
    toTokenAddress,
    optionSlippage,
    findToken,
  ])

  // set route call results
  useEffect(() => {
    if (routeCallResult) {
      const { result, id } = routeCallResult
      if (id === currentRouteCallId) {
        setRoutes(result.routes)
        fadeInAnimation(routeCards)
        setHighlightedIndex(result.routes.length === 0 ? -1 : 0)
        setNoRoutesAvailable(result.routes.length === 0)
        setRoutesLoading(false)
      }
    }
  }, [routeCallResult, currentRouteCallId])

  const openModal = () => {
    // deepClone to open new modal without execution info of previous transfer using same route card
    setSelectedRoute(deepClone(routes[highlightedIndex]))
  }

  const submitButton = () => {
    if (!web3.account) {
      return (
        <Button
          shape="round"
          type="primary"
          icon={<LoginOutlined />}
          size={'large'}
          onClick={() => login()}>
          Connect Wallet
        </Button>
      )
    }
    if (routesLoading) {
      return (
        <Button
          disabled={true}
          shape="round"
          type="primary"
          icon={<SyncOutlined spin />}
          size={'large'}>
          Searching Routes...
        </Button>
      )
    }
    if (noRoutesAvailable) {
      return (
        <Button disabled={true} shape="round" type="primary" size={'large'}>
          No Route Found
        </Button>
      )
    }
    if (!hasSufficientBalance()) {
      return (
        <Button disabled={true} shape="round" type="primary" size={'large'}>
          Insufficient Funds
        </Button>
      )
    }

    return (
      <Button
        disabled={highlightedIndex === -1}
        shape="round"
        type="primary"
        icon={<SwapOutlined />}
        size={'large'}
        onClick={() => openModal()}>
        Swap
      </Button>
    )
  }

  return (
    <Content className="site-layout" style={{ minHeight: 'calc(100vh - 64px)', marginTop: 64 }}>
      <div className="swap-view" style={{ minHeight: '900px', maxWidth: 1600, margin: 'auto' }}>
        {/* Historical Routes */}
        {!!historicalRoutes.length && (
          <Row justify={'center'} style={{ marginTop: 48 }}>
            <Collapse
              defaultActiveKey={['']}
              ghost
              bordered={false}
              className={`active-transfer-collapse`}
              style={{ overflowX: 'scroll' }}>
              <Panel
                header={`Historical Transfers (${historicalRoutes.length})`}
                key="1"
                className="site-collapse-active-transfer-panel">
                <div>
                  <TrasactionsTable
                    routes={historicalRoutes}
                    selectRoute={() => {}}
                    deleteRoute={(route: RouteType) => {
                      deleteRoute(route)
                      setHistoricalRoutes(readHistoricalRoutes())
                    }}
                    historical={true}></TrasactionsTable>
                </div>
              </Panel>
            </Collapse>
          </Row>
        )}

        {/* Active Routes */}
        {!!activeRoutes.length && (
          <Row justify={'center'} style={{ marginTop: 48 }}>
            <Collapse
              defaultActiveKey={activeRoutes.length ? ['1'] : ['']}
              ghost
              bordered={false}
              className={`active-transfer-collapse`}
              style={{ overflowX: 'scroll' }}>
              <Panel
                header={`Active Transfers (${activeRoutes.length})`}
                key="1"
                className="site-collapse-active-transfer-panel">
                <div>
                  <TrasactionsTable
                    routes={activeRoutes}
                    selectRoute={(route: RouteType) => setSelectedRoute(route)}
                    deleteRoute={(route: RouteType) => {
                      deleteRoute(route)
                      setActiveRoutes(readActiveRoutes())
                    }}></TrasactionsTable>
                </div>
              </Panel>
            </Collapse>
          </Row>
        )}

        {/* Swap Form */}
        <Row style={{ margin: 20 }} justify={'center'}>
          <Col className="swap-form">
            <div
              className="swap-input"
              style={{ maxWidth: 450, borderRadius: 6, padding: 24, margin: '0 auto' }}>
              <Row>
                <Title className="swap-title" level={4}>
                  Please Specify Your Transaction
                </Title>
              </Row>

              <Form>
                <SwapForm
                  depositChain={fromChainKey}
                  setDepositChain={setFromChainKey}
                  depositToken={fromTokenAddress}
                  setDepositToken={setFromTokenAddress}
                  depositAmount={depositAmount}
                  setDepositAmount={setDepositAmount}
                  withdrawChain={toChainKey}
                  setWithdrawChain={setToChainKey}
                  withdrawToken={toTokenAddress}
                  setWithdrawToken={setToTokenAddress}
                  withdrawAmount={withdrawAmount}
                  setWithdrawAmount={setWithdrawAmount}
                  estimatedWithdrawAmount={getSelectedWithdraw()}
                  transferChains={transferChains}
                  tokens={tokens}
                  balances={balances}
                  allowSameChains={true}
                />
                <span>
                  {/* Disclaimer */}
                  <Row justify={'center'} className="beta-disclaimer">
                    <Typography.Text type="danger" style={{ textAlign: 'center' }}>
                      Please note that this is a beta product, use it at your own risk. In rare
                      cases funds can be locked for a longer period and exchanges can result in
                      value loss. <br />
                      We currently recommend using only Metamask Wallets.
                    </Typography.Text>
                  </Row>
                  <Row style={{ marginTop: 24 }} justify={'center'}>
                    {submitButton()}
                  </Row>
                  {/* Advanced Options */}
                  <Row justify={'center'}>
                    <Collapse ghost style={{ width: '100%' }}>
                      <Collapse.Panel header={`Advanced Options`} key="1">
                        Slippage
                        <div>
                          <InputNumber
                            defaultValue={optionSlippage}
                            min={0}
                            max={100}
                            formatter={(value) => `${value}%`}
                            parser={(value) => parseFloat(value ? value.replace('%', '') : '')}
                            onChange={setOptionSlippage}
                            style={{
                              border: '1px solid rgba(0,0,0,0.25)',
                              borderRadius: 6,
                              width: '100%',
                            }}
                          />
                        </div>
                        {/* Infinite Approval
                        <div>
                          <Checkbox
                            checked={optionInfiniteApproval}
                            onChange={(e) => setOptionInfiniteApproval(e.target.checked)}
                          >
                            Activate Infinite Approval
                          </Checkbox>
                        </div> */}
                      </Collapse.Panel>
                    </Collapse>
                  </Row>
                </span>
              </Form>
            </div>
          </Col>
        </Row>

        {/* Routes */}
        <Row
          justify={'center'}
          style={{ marginLeft: 12, marginRight: 12, marginTop: 48, padding: 12 }}>
          {routes.length > 0 && (
            <Col>
              <h3 style={{ textAlign: 'center' }}>
                Available routes
                <br className="only-mobile" /> (sorted by estimated withdraw)
              </h3>
              <div
                style={{ display: 'flex', flexDirection: 'row', overflowX: 'scroll' }}
                ref={routeCards}>
                {routes.map((route, index) => (
                  <Route
                    key={index}
                    route={route}
                    selected={highlightedIndex === index}
                    onSelect={() => setHighlightedIndex(index)}
                  />
                ))}
              </div>
            </Col>
          )}
          {routesLoading && (
            <Col>
              <Row gutter={[32, 62]} justify={'center'} style={{ marginTop: 0 }}>
                <LoadingIndicator></LoadingIndicator>
              </Row>
            </Col>
          )}
          {!routesLoading && noRoutesAvailable && (
            <Col style={{ width: '50%' }} className="no-routes-found">
              <h3 style={{ textAlign: 'center' }}>No Route Found</h3>
              <Typography.Text type="secondary" style={{ textAlign: 'left' }}>
                We couldn't find suitable routes for your desired transfer. We do have some
                suggestions why that could be: <br />
              </Typography.Text>
              <Collapse ghost className="no-route-custom-collapse">
                <Panel header="A route for this transaction simply does not exist yet." key="1">
                  <p style={{ color: 'grey' }}>
                    We are working hard on integrating more exchanges to find possible transactions
                    for you! Look out for updates and try again later.
                  </p>
                </Panel>

                <Panel header="You are not sending enough tokens - Try a greater amount." key="2">
                  <p style={{ color: 'grey' }}>
                    Transactions cost money. These transaction costs are deducted from your swapping
                    amount. If this amount is not enough to cover the expenses, we can not execute
                    the transaction or compute routes.
                  </p>
                </Panel>
              </Collapse>
            </Col>
          )}
        </Row>
      </div>

      {selectedRoute && !!selectedRoute.steps.length && (
        <Modal
          className="swapModal"
          visible={selectedRoute.steps.length > 0}
          onOk={() => {
            setSelectedRoute(null)
            updateBalances()
          }}
          onCancel={() => {
            setSelectedRoute(null)
            updateBalances()
          }}
          destroyOnClose={true}
          width={700}
          footer={null}>
          <Swapping
            route={selectedRoute}
            updateRoute={(route: any) => {
              setActiveRoutes(readActiveRoutes())
              setHistoricalRoutes(readHistoricalRoutes())
            }}
            onSwapDone={() => {
              setActiveRoutes(readActiveRoutes())
              setHistoricalRoutes(readHistoricalRoutes())
              updateBalances()
            }}></Swapping>
        </Modal>
      )}
    </Content>
  )
}

export default Swap
