import './Swap.css'

import { LoadingOutlined, LoginOutlined, SwapOutlined, SyncOutlined } from '@ant-design/icons'
import { Web3Provider } from '@ethersproject/providers'
import LiFi, { supportedChains } from '@lifinance/sdk'
import { useWeb3React } from '@web3-react/core'
import {
  Button,
  Checkbox,
  Col,
  Collapse,
  Form,
  InputNumber,
  Modal,
  Row,
  Select,
  Tooltip,
  Typography,
} from 'antd'
import { Content } from 'antd/lib/layout/layout'
import Title from 'antd/lib/typography/Title'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { createBrowserHistory } from 'history'
import { animate, stagger } from 'motion'
import QueryString from 'qs'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'

import { getRpcs } from '../config/connectors'
import {
  deleteRoute,
  readActiveRoutes,
  readHistoricalRoutes,
  storeRoute,
} from '../services/localStorage'
import { switchChain } from '../services/metamask'
import { loadTokenListAsTokens } from '../services/tokenListService'
import {
  deepClone,
  formatTokenAmount,
  formatTokenAmountOnly,
  isWalletDeactivated,
} from '../services/utils'
import {
  Chain,
  ChainId,
  ChainKey,
  CoinKey,
  defaultTokens,
  findDefaultToken,
  getChainById,
  getChainByKey,
  isSwapStep,
  Route as RouteType,
  RoutesRequest,
  RoutesResponse,
  Token,
  TokenAmount,
} from '../types'
import LoadingIndicator from './LoadingIndicator'
import Route from './Route'
import SwapForm from './SwapForm'
import Swapping from './Swapping'
import TrasactionsTable from './TransactionsTable'
import { getInjectedConnector } from './web3/connectors'

const history = createBrowserHistory()
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

const parseChain = (passed: string) => {
  // is ChainKey?
  const chainKeys = Object.values(ChainKey) as string[]
  if (chainKeys.includes(passed.toLowerCase())) {
    return ChainId[passed.toUpperCase() as keyof typeof ChainId]
  }

  // is ChainId?
  const id = parseInt(passed)
  if (!isNaN(id)) {
    return id
  }
}

const parseToken = (
  passed: string,
  chainKey: ChainKey,
  transferTokens: { [ChainKey: string]: Array<Token> },
) => {
  // is CoinKey?
  const coinKeys = Object.values(CoinKey)
  const coinKey = passed.toUpperCase() as CoinKey
  if (coinKeys.includes(coinKey)) {
    return findDefaultToken(coinKey, getChainByKey(chainKey).id)
  }

  // is token address valid?
  const fromTokenId = ethers.utils.getAddress(passed.trim()).toLowerCase()
  // does token address exist in our default tokens? (tokenlists not loaded yet)
  return transferTokens[chainKey].find((token) => token.address === fromTokenId)
}

const getDefaultParams = (
  search: string,
  transferChains: Chain[],
  transferTokens: { [ChainKey: string]: Array<Token> },
) => {
  const defaultParams: StartParams = {
    depositChain: undefined,
    depositToken: undefined,
    depositAmount: new BigNumber(-1),
    withdrawChain: undefined,
    withdrawToken: undefined,
  }

  const params = QueryString.parse(search, { ignoreQueryPrefix: true })

  // fromChain
  let newFromChain
  if (params.fromChain && typeof params.fromChain === 'string') {
    try {
      const newFromChainId = parseChain(params.fromChain)
      newFromChain = transferChains.find((chain) => chain.id === newFromChainId)

      if (newFromChain) {
        defaultParams.depositChain = newFromChain.key
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(e)
    }
  }

  // fromToken
  if (params.fromToken && typeof params.fromToken === 'string' && defaultParams.depositChain) {
    try {
      const foundToken = parseToken(params.fromToken, defaultParams.depositChain, transferTokens)
      const inDefault = transferTokens[defaultParams.depositChain].find(
        (token) => token.address === foundToken?.address,
      )
      if (foundToken && inDefault) {
        defaultParams.depositToken = foundToken.address
      } else if (foundToken) {
        transferTokens[defaultParams.depositChain].push(foundToken)
        defaultParams.depositToken = foundToken.address
      } else if (newFromChain) {
        // only add unknow token if chain was specified with it
        const fromTokenId = ethers.utils.getAddress(params.fromToken.trim()).toLowerCase()
        transferTokens[defaultParams.depositChain].push({
          address: fromTokenId,
          symbol: 'Unknown',
          decimals: 18,
          chainId: newFromChain.id,
          coinKey: '' as CoinKey,
          name: 'Unknown',
          logoURI: '',
        })
        defaultParams.depositToken = fromTokenId
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(e)
    }
  }

  // fromAmount
  if (params.fromAmount && typeof params.fromAmount === 'string') {
    try {
      const newAmount = new BigNumber(params.fromAmount)
      if (newAmount.gt(0)) {
        defaultParams.depositAmount = newAmount
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(e)
    }
  }

  // toChain
  let newToChain
  if (params.toChain && typeof params.toChain === 'string') {
    try {
      const newToChainId = parseChain(params.toChain)
      newToChain = transferChains.find((chain) => chain.id === newToChainId)

      if (newToChain) {
        defaultParams.withdrawChain = newToChain.key
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(e)
    }
  }

  // toToken
  if (params.toToken && typeof params.toToken === 'string' && defaultParams.withdrawChain) {
    try {
      const foundToken = parseToken(params.toToken, defaultParams.withdrawChain, transferTokens)
      const inDefault = transferTokens[defaultParams.withdrawChain].find(
        (token) => token.address === foundToken?.address,
      )
      if (foundToken && inDefault) {
        defaultParams.withdrawToken = foundToken.address
      } else if (foundToken) {
        transferTokens[defaultParams.withdrawChain].push(foundToken)
        defaultParams.withdrawToken = foundToken.address
      } else if (newToChain) {
        // only add unknow token if chain was specified with it
        const toTokenId = ethers.utils.getAddress(params.toToken.trim()).toLowerCase()
        transferTokens[defaultParams.withdrawChain].push({
          address: toTokenId,
          symbol: 'Unknown',
          decimals: 18,
          chainId: newToChain.id,
          coinKey: '' as CoinKey,
          name: 'Unknown',
          logoURI: '',
        })
        defaultParams.withdrawToken = toTokenId
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(e)
    }
  }

  return defaultParams
}

interface StartParams {
  depositChain?: ChainKey
  depositToken?: string
  depositAmount: BigNumber
  withdrawChain?: ChainKey
  withdrawToken?: string
}

let startParams: StartParams

interface SwapProps {
  transferChains: Chain[]
}

const Swap = ({ transferChains }: SwapProps) => {
  const transferTokens = filterDefaultTokenByChains(defaultTokens, transferChains)
  startParams =
    startParams ?? getDefaultParams(history.location.search, transferChains, transferTokens)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [unused, setStateUpdate] = useState<number>(0)

  // From
  const [fromChainKey, setFromChainKey] = useState<ChainKey | undefined>(startParams.depositChain)
  const [depositAmount, setDepositAmount] = useState<BigNumber>(startParams.depositAmount)
  const [fromTokenAddress, setFromTokenAddress] = useState<string | undefined>(
    startParams.depositToken,
  )
  const [toChainKey, setToChainKey] = useState<ChainKey | undefined>(startParams.withdrawChain)
  const [withdrawAmount, setWithdrawAmount] = useState<BigNumber>(new BigNumber(Infinity))
  const [toTokenAddress, setToTokenAddress] = useState<string | undefined>(
    startParams.withdrawToken,
  )
  const [tokens, setTokens] =
    useState<{ [ChainKey: string]: Array<TokenWithAmounts> }>(transferTokens)
  const [refreshTokens, setRefreshTokens] = useState<boolean>(true)
  const [balances, setBalances] = useState<{ [ChainKey: string]: Array<TokenAmount> }>()
  const [refreshBalances, setRefreshBalances] = useState<boolean>(true)
  const [routeCallResult, setRouteCallResult] = useState<{ result: RoutesResponse; id: string }>()

  // Options
  const [optionSlippage, setOptionSlippage] = useState<number>(3)
  const [optionInfiniteApproval, setOptionInfiniteApproval] = useState<boolean>(true)
  const [optionEnabledBridges, setOptionEnabledBridges] = useState<string[] | undefined>()
  const [availableBridges, setAvailableBridges] = useState<string[]>([])
  const [optionEnabledExchanges, setOptionEnabledExchanges] = useState<string[] | undefined>()
  const [availableExchanges, setAvailableExchanges] = useState<string[]>([])

  // Routes
  const [routes, setRoutes] = useState<Array<RouteType>>([])
  const [routesLoading, setRoutesLoading] = useState<boolean>(false)
  const [noRoutesAvailable, setNoRoutesAvailable] = useState<boolean>(false)
  const [selectedRoute, setSelectedRoute] = useState<RouteType | undefined>()
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
  const [activeRoutes, setActiveRoutes] = useState<Array<RouteType>>(readActiveRoutes())
  const [historicalRoutes, setHistoricalRoutes] = useState<Array<RouteType>>(readHistoricalRoutes())
  const [restartedOnPageLoad, setRestartedOnPageLoad] = useState<boolean>(false)

  // Wallet
  const web3 = useWeb3React<Web3Provider>()
  const { active, activate } = useWeb3React()
  const login = async () => activate(await getInjectedConnector())

  // Elements used for animations
  const routeCards = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // get new execution status on page load
    if (!restartedOnPageLoad) {
      setRestartedOnPageLoad(true)

      activeRoutes.map((route) => {
        if (!web3 || !web3.library) return
        // check if it makes sense to fetch the status of a route:
        // if failed or action required it makes no sense
        const routeFailed = route.steps.some(
          (step) => step.execution && step.execution.status === 'FAILED',
        )
        const actionRequired = route.steps.some(
          (step) =>
            step.execution &&
            step.execution.process.some((process) => process.status === 'ACTION_REQUIRED'),
        )

        if (routeFailed || actionRequired) return
        const settings = {
          updateCallback: (updatedRoute: RouteType) => {
            storeRoute(updatedRoute)
            setActiveRoutes(readActiveRoutes())
            setHistoricalRoutes(readHistoricalRoutes())
          },
        }
        LiFi.resumeRoute(web3.library.getSigner(), route, settings)
        LiFi.moveExecutionToBackground(route)
      })
    }
  }, [web3.library])

  useEffect(() => {
    const load = async () => {
      LiFi.setConfig({
        apiUrl: process.env.REACT_APP_API_URL,
        rpcs: getRpcs(),
        defaultRouteOptions: {
          integrator: 'li.finance',
        },
      })

      const possibilities = await LiFi.getPossibilities()

      // bridges
      const bridges: string[] = possibilities.bridges
        .map((bridge: any) => bridge.tool)
        .map((bridegTool: string) => bridegTool.split('-')[0])
      const allBridges = Array.from(new Set(bridges))
      setAvailableBridges(allBridges)
      setOptionEnabledBridges(allBridges)

      // exchanges
      const exchanges: string[] = possibilities.exchanges
        .map((exchange: any) => exchange.tool)
        .map((exchangeTool: string) => exchangeTool.split('-')[0])
      const allExchanges = Array.from(new Set(exchanges))
      setAvailableExchanges(allExchanges)
      setOptionEnabledExchanges(allExchanges)
    }

    load()
  }, [])

  const getSelectedWithdraw = () => {
    if (highlightedIndex === -1) {
      return {
        estimate: '0.0',
      }
    } else {
      const selectedRoute = routes[highlightedIndex]
      const lastStep = selectedRoute.steps[selectedRoute.steps.length - 1]
      return {
        estimate: formatTokenAmountOnly(lastStep.action.toToken, lastStep.estimate?.toAmount),
        min: formatTokenAmount(lastStep.action.toToken, lastStep.estimate?.toAmountMin),
      }
    }
  }

  // autoselect from chain based on wallet
  useEffect(() => {
    const walletChainIsSupported = supportedChains.some((chain) => chain.id === web3.chainId)
    if (!walletChainIsSupported) return
    if (web3.chainId && !fromChainKey) {
      const chain = transferChains.find((chain) => chain.id === web3.chainId)
      if (chain) {
        setFromChainKey(chain.key)
      }
    }
  }, [web3.chainId, fromChainKey])

  // update query string
  useEffect(() => {
    const params = {
      fromChain: fromChainKey,
      fromToken: fromTokenAddress,
      toChain: toChainKey,
      toToken: toTokenAddress,
      fromAmount: depositAmount.gt(0) ? depositAmount.toFixed() : undefined,
    }
    const search = QueryString.stringify(params)
    history.push({
      search,
    })
  }, [fromChainKey, fromTokenAddress, toChainKey, toTokenAddress, depositAmount])

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

  const updateBalances = useCallback(async () => {
    if (web3.account) {
      // one call per chain to show balances as soon as the request comes back
      Object.entries(tokens).forEach(async ([chainKey, tokenList]) => {
        LiFi.getTokenBalances(web3.account!, tokenList).then((portfolio) => {
          setBalances((balances) => {
            if (!balances) balances = {}
            return {
              ...balances,
              [chainKey]: portfolio,
            }
          })
        })
      })
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
    currentBalances: { [ChainKey: string]: Array<TokenAmount> } | undefined,
    chainKey: ChainKey,
    tokenId: string,
  ) => {
    if (!currentBalances || !currentBalances[chainKey]) {
      return new BigNumber(0)
    }

    const tokenBalance = currentBalances[chainKey].find(
      (tokenAmount) => tokenAmount.address === tokenId,
    )
    return tokenBalance?.amount ? new BigNumber(tokenBalance?.amount) : new BigNumber(0)
  }

  useEffect(() => {
    // merge tokens and balances
    for (const chain of transferChains) {
      for (const token of tokens[chain.key]) {
        if (!balances || !balances[chain.key]) {
          // balances for chain not loaded yet
          token.amount = new BigNumber(-1)
          token.amountRendered = undefined
        } else {
          // balances loaded
          token.amount = getBalance(balances, chain.key, token.address)
          token.amountRendered = formatTokenAmountOnly(token, token.amount)
        }
      }
    }

    setTokens(tokens)
    setStateUpdate((stateUpdate) => stateUpdate + 1)
  }, [tokens, balances, transferChains])

  const hasSufficientBalance = () => {
    if (!fromTokenAddress || !fromChainKey) {
      return true
    }

    return depositAmount.lte(getBalance(balances, fromChainKey, fromTokenAddress))
  }

  const hasSufficientGasBalanceOnStartChain = (route?: RouteType) => {
    if (!route) {
      return true
    }

    const fromChain = getChainById(route.fromChainId)
    const balance = getBalance(balances, fromChain.key, ethers.constants.AddressZero)

    const requiredAmount = route.steps
      .filter((step) => step.action.fromChainId === route.fromChainId)
      .map(
        (step) =>
          step.estimate.gasCosts &&
          step.estimate.gasCosts.length &&
          step.estimate.gasCosts[0].amount,
      )
      .map((amount) => new BigNumber(amount || '0'))
      .reduce((a, b) => a.plus(b), new BigNumber(0))
      .shiftedBy(-18)
    return !balance.isZero() && balance.gte(requiredAmount)
  }

  const hasSufficientGasBalanceOnCrossChain = (route?: RouteType) => {
    if (!route) {
      return true
    }
    const lastStep = route.steps[route.steps.length - 1]
    if (!isSwapStep(lastStep)) {
      return true
    }

    const crossChain = getChainById(lastStep.action.fromChainId)
    const balance = getBalance(balances, crossChain.key, ethers.constants.AddressZero)

    const gasEstimate =
      lastStep.estimate.gasCosts &&
      lastStep.estimate.gasCosts.length &&
      lastStep.estimate.gasCosts[0].amount
    const requiredAmount = new BigNumber(gasEstimate || 0).shiftedBy(-18)
    return !balance.isZero() && balance.gte(requiredAmount)
  }

  const findToken = useCallback(
    (chainKey: ChainKey, tokenId: string) => {
      const token = tokens[chainKey].find((token) => token.address === tokenId)
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
          fromAddress: web3.account || undefined,
          toAddress: web3.account || undefined,
          options: {
            slippage: optionSlippage / 100,
            bridges: {
              allow: optionEnabledBridges,
            },
            exchanges: {
              allow: optionEnabledExchanges,
            },
          },
        }

        const id = uuid()
        try {
          currentRouteCallId = id
          const result = await LiFi.getRoutes(request)
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
    optionEnabledBridges,
    optionEnabledExchanges,
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

    // Reset routes to avoid reexecution with same data
    setRoutes([])
    setHighlightedIndex(-1)
    setNoRoutesAvailable(false)
  }

  const submitButton = () => {
    if (!active && isWalletDeactivated(web3.account)) {
      return (
        <Button
          disabled={true}
          shape="round"
          type="primary"
          icon={<LoadingOutlined />}
          size={'large'}></Button>
      )
    }
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
    if (fromChainKey && web3.chainId !== getChainByKey(fromChainKey).id) {
      const fromChain = getChainByKey(fromChainKey)
      return (
        <Button
          shape="round"
          type="primary"
          icon={<SwapOutlined />}
          size={'large'}
          htmlType="submit"
          onClick={() => switchChain(fromChain.id)}>
          Switch Network to {fromChain.name}
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
    if (!hasSufficientGasBalanceOnStartChain(routes[highlightedIndex])) {
      return (
        <Button disabled={true} shape="round" type="primary" size={'large'}>
          Insufficient Gas on Start Chain
        </Button>
      )
    }
    if (!hasSufficientGasBalanceOnCrossChain(routes[highlightedIndex])) {
      return (
        <Tooltip title="The selected route requires a swap on the chain you are tranferring to. You need to have gas on that chain to pay for the transaction there.">
          <Button disabled={true} shape="round" type="primary" size={'large'}>
            Insufficient Gas on Destination Chain
          </Button>
        </Tooltip>
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
    <Content className="site-layout site-layout-swap">
      <div className="swap-view" style={{ minHeight: '900px', maxWidth: 1600, margin: 'auto' }}>
        {/* Historical Routes */}
        {!!historicalRoutes.length && (
          <Row justify={'center'} className="historicalTransfers">
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
                      LiFi.stopExecution(route)
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
          <Row justify={'center'} className="activeTransfers">
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
                      LiFi.stopExecution(route)
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
                  estimatedWithdrawAmount={getSelectedWithdraw().estimate}
                  estimatedMinWithdrawAmount={getSelectedWithdraw().min}
                  transferChains={transferChains}
                  tokens={tokens}
                  balances={balances}
                  allowSameChains={true}
                />
                <span>
                  {/* Disclaimer */}
                  <Row justify={'center'} className="beta-disclaimer">
                    <Typography.Text type="danger" style={{ textAlign: 'center' }}>
                      Beta product - use at own risk.
                      <br />
                      MetaMask recommended.
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
                        Infinite Approval
                        <div>
                          <Checkbox
                            checked={optionInfiniteApproval}
                            onChange={(e) => setOptionInfiniteApproval(e.target.checked)}
                            disabled={true}>
                            Activate Infinite Approval
                          </Checkbox>
                        </div>
                        Bridges
                        <div>
                          <Select
                            mode="multiple"
                            placeholder="Select enabled bridges"
                            value={optionEnabledBridges}
                            onChange={setOptionEnabledBridges}
                            style={{
                              borderRadius: 6,
                              width: '100%',
                            }}>
                            {availableBridges.map((bridge) => (
                              <Select.Option key={bridge} value={bridge}>
                                {bridge}
                              </Select.Option>
                            ))}
                          </Select>
                        </div>
                        Exchanges
                        <div>
                          <Select
                            mode="multiple"
                            placeholder="Select enabled exchanges"
                            value={optionEnabledExchanges}
                            onChange={setOptionEnabledExchanges}
                            style={{
                              borderRadius: 6,
                              width: '100%',
                            }}>
                            {availableExchanges.map((exchange) => (
                              <Select.Option key={exchange} value={exchange}>
                                {exchange}
                              </Select.Option>
                            ))}
                          </Select>
                        </div>
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
              <h3 style={{ textAlign: 'center' }}>Available routes</h3>
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
            setSelectedRoute(undefined)
            updateBalances()
          }}
          onCancel={() => {
            setSelectedRoute(undefined)
            updateBalances()
          }}
          destroyOnClose={true}
          width={700}
          footer={null}>
          <Swapping
            route={selectedRoute}
            updateRoute={() => {
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
