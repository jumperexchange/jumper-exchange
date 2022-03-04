import './SwapUkraine.css'

import { ArrowRightOutlined, LoadingOutlined, SwapOutlined, SyncOutlined } from '@ant-design/icons'
import { Web3Provider } from '@ethersproject/providers'
import LiFi, { supportedChains } from '@lifinance/sdk'
import { useWeb3React } from '@web3-react/core'
import {
  Button,
  Checkbox,
  Col,
  Collapse,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Tooltip,
  Typography,
} from 'antd'
import { Content } from 'antd/lib/layout/layout'
import Paragraph from 'antd/lib/typography/Paragraph'
import Title from 'antd/lib/typography/Title'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { createBrowserHistory } from 'history'
import { animate, stagger } from 'motion'
import QueryString from 'qs'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { TwitterTweetEmbed } from 'react-twitter-embed'
import { v4 as uuid } from 'uuid'

import { LifiTeam } from '../assets/Li:Fi/LiFiTeam'
import { PoweredByLiFi } from '../assets/Li:Fi/poweredByLiFi'
import { UkraineLogo } from '../assets/misc/ukraine_logo'
import { getRpcs } from '../config/connectors'
import { readActiveRoutes, readHistoricalRoutes, storeRoute } from '../services/localStorage'
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
import SwapForm from './SwapForm'
import Swapping from './Swapping'
import ConnectButton from './web3/ConnectButton'

const history = createBrowserHistory()
const DONATION_FTM_WALLET = '0x0B0ff19ab0ee6265D4184ed810e092D9A89074D9'
const MORE_INFO_PAGE_URL =
  'https://www.notion.so/lifi/More-Information-about-Ukraine-donation-dapp-d0c8c529262b45519246c2aa5292f602'

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

const filterDefaultTokenByChains = (tokens: TokenAmountList, transferChains: Chain[]) => {
  const result: TokenAmountList = {}

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
  return transferTokens[chainKey]?.find((token) => token.address === fromTokenId)
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
    withdrawChain: ChainKey.FTM,
    withdrawToken: findDefaultToken(CoinKey.ETH, ChainId.FTM).address, // TODO: change this
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

interface TokenAmountList {
  [ChainKey: string]: Array<TokenWithAmounts>
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
  const [toChainKey] = useState<ChainKey | undefined>(ChainKey.FTM) // TODO: Change This
  const [withdrawAmount, setWithdrawAmount] = useState<BigNumber>(new BigNumber(Infinity))
  const [toTokenAddress] = useState<string | undefined>(
    findDefaultToken(CoinKey.ETH, ChainId.FTM).address,
  ) // TODO: Change This
  const [tokens, setTokens] = useState<TokenAmountList>(transferTokens)
  const [refreshTokens, setRefreshTokens] = useState<boolean>(false)
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
  const [, setHistoricalRoutes] = useState<Array<RouteType>>(readHistoricalRoutes())

  // Misc
  const [restartedOnPageLoad, setRestartedOnPageLoad] = useState<boolean>(false)
  const [balancePollingStarted, setBalancePollingStarted] = useState<boolean>(false)

  // Wallet
  const web3 = useWeb3React<Web3Provider>()
  const { active } = useWeb3React()

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
    // executed once after page is loaded
    if (!balancePollingStarted) {
      setBalancePollingStarted(true)

      // start balance polling
      const pollingInterval = setInterval(() => {
        setRefreshBalances(true)
      }, 60_000)

      return () => {
        clearInterval(pollingInterval)
      }
    }
  }, [])

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
        .map((bridgeTool: string) => bridgeTool.split('-')[0])
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

      // tokens
      const newTokens: TokenAmountList = {}
      possibilities.tokens.forEach((token) => {
        const chain = getChainById(token.chainId)
        if (!newTokens[chain.key]) newTokens[chain.key] = []
        newTokens[chain.key].push(token)
      })

      setTokens((tokens) => {
        // which existing tokens are not included?
        Object.keys(tokens).forEach((chainKey) => {
          tokens[chainKey].forEach((token) => {
            if (!newTokens[chainKey]) newTokens[chainKey] = []
            if (!newTokens[chainKey].find((item) => item.address === token.address)) {
              newTokens[chainKey].push(token)

              // -> load token from API to get current version (e.g. if token was added via url)
              updateTokenData(token)
            }
          })
        })
        return newTokens
      })
      setRefreshBalances(true)
    }

    load()
  }, [])

  const updateTokenData = (token: Token) => {
    LiFi.getToken(token.chainId, token.address).then((updatedToken) => {
      // sync optional properties
      updatedToken.logoURI = updatedToken.logoURI || token.logoURI
      updatedToken.priceUSD = updatedToken.priceUSD || token.priceUSD

      // update tokens
      setTokens((tokens) => {
        const chain = getChainById(updatedToken.chainId)
        if (!tokens[chain.key]) tokens[chain.key] = []
        const index = tokens[chain.key].findIndex((token) => token.address === updatedToken.address)
        if (index === -1) {
          tokens[chain.key].push(updatedToken)
        } else {
          tokens[chain.key][index] = updatedToken
        }
        return tokens
      })
    })
  }

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
      Object.entries(tokens).forEach(([chainKey, tokenList]) => {
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
      if (!tokens[chain.key]) {
        continue
      }
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
          toAddress: DONATION_FTM_WALLET, // TODO: change this to the recipient address
          options: {
            slippage: optionSlippage / 100,
            bridges: {
              allow: optionEnabledBridges,
            },
            exchanges: {
              allow: optionEnabledExchanges,
            },
            allowSwitchChain: false, // This is important for fixed recipients
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

  //TODO: check what is needed here!
  const openModal = () => {
    // deepClone to open new modal without execution info of previous transfer using same route card
    setSelectedRoute(deepClone(routes[0]))

    // Reset routes to avoid reexecution with same data
    setRoutes([])
    setHighlightedIndex(-1)
    setNoRoutesAvailable(false)
  }

  const submitButton = () => {
    if (!active && isWalletDeactivated(web3.account)) {
      return (
        <Button
          className="btn-ukraine-swap-form"
          disabled={true}
          shape="round"
          type="primary"
          icon={<LoadingOutlined />}
          size={'large'}></Button>
      )
    }
    if (!web3.account) {
      return <ConnectButton className="btn-ukraine-swap-form" size="large" />
    }
    if (fromChainKey && web3.chainId !== getChainByKey(fromChainKey).id) {
      const fromChain = getChainByKey(fromChainKey)
      return (
        <Button
          className="btn-ukraine-swap-form"
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
        className="btn-ukraine-swap-form"
        type="primary"
        size={'large'}
        onClick={() => openModal()}>
        <span className="ukraine-flag">&#127482;&#127462;</span> Donate
      </Button>
    )
  }

  const toSection = (
    <Row
      style={{
        marginTop: '32px',
      }}
      gutter={[
        { xs: 8, sm: 16 },
        { xs: 8, sm: 16 },
      ]}>
      <Col span={10}>
        <div className="form-text">To:</div>
      </Col>
      <Col span={14}>
        <div className="form-input-wrapper">
          <Input
            type="text"
            value={'ETH for Ukraine'}
            bordered={false}
            disabled
            style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: '400' }}
          />
        </div>
      </Col>
    </Row>
  )

  const isTransferto = window.location.href.includes('transferto')

  return (
    <Content
      className="site-layout-swap-ukraine"
      style={{
        minHeight: !isTransferto ? 'calc(100vh - 104px)' : 'calc(100vh - 64px)',
        marginTop: !isTransferto ? '104px' : '64px',
      }}>
      <div className="swap-view-ukraine">
        {/* Swap Form */}
        <Row>
          <Col xs={24} sm={24} md={24} lg={24} xl={12} className="ukraine-content-column title-row">
            <Title level={1}>Cross-chain donation to Ukraine</Title>
          </Col>
          <Col
            className="swap-form-ukraine"
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={12}
            style={{
              minHeight: !isTransferto ? 'calc(100vh - 104px)' : 'calc(100vh - 64px)',
              // marginTop: !isTransferto ? '104px' : '64px',
            }}>
            <div
              className="swap-input"
              style={{
                margin: '0 auto',
                maxWidth: 450,
                borderRadius: 16,
                padding: 32,
              }}>
              <Row>
                <Title
                  className="swap-title"
                  level={3}
                  style={{ marginLeft: '0', fontWeight: 'bold', marginBottom: 16 }}>
                  Stand with <br />
                  Ukraine
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
                  withdrawChain={ChainKey.DAI}
                  setWithdrawChain={() => {}}
                  withdrawToken={findDefaultToken(CoinKey.USDC, ChainId.DAI).address}
                  setWithdrawToken={() => {}}
                  withdrawAmount={withdrawAmount}
                  setWithdrawAmount={setWithdrawAmount}
                  estimatedWithdrawAmount={getSelectedWithdraw().estimate}
                  estimatedMinWithdrawAmount={getSelectedWithdraw().min}
                  transferChains={transferChains}
                  tokens={tokens}
                  balances={balances}
                  allowSameChains={true}
                  fixedWithdraw={true}
                  alternativeToSection={toSection}
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
                  <Row justify={'center'} style={{ marginTop: '12px' }}>
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
            <div
              onClick={() => window.open('https://li.fi', '_blank')}
              style={{ margin: '32px auto', textAlign: 'center', cursor: 'pointer' }}>
              <PoweredByLiFi />
            </div>
          </Col>
        </Row>

        <Row>
          <Col xs={24} sm={24} md={24} lg={24} xl={12} className="ukraine-content-column">
            <Title level={4}>
              You can <b>donate any token</b> from <b>any EVM chain</b> we support.{' '}
              <b>Every dollar counts!</b>
            </Title>
            <br />
            <Paragraph>
              Hello World. Ukraine is in a very tough situation right now, all of us want to help,
              but we can only do so much. We all know that Ethereum gas fees make it harder to
              donate smaller amounts. So, we’ve spun up a simple system using LI.FI protocol to
              donate from any EVM chain, it will be stored in a Hardware Wallet controlled by LI.FI
              team and will be bridged to Ethereum every 8 hours and sent to the ETH address used by
              the Ukraine govt.
            </Paragraph>

            <div className="tweet-wrapper" style={{ marginTop: 64 }}>
              <TwitterTweetEmbed tweetId="1497594592438497282"></TwitterTweetEmbed>
            </div>

            <Paragraph>You can verify our transactions on the blockchain.</Paragraph>
            <Button
              className="btn-info-ukraine"
              shape="round"
              type="primary"
              //   icon={<LoginOutlined />}
              size={'large'}
              onClick={() => {
                window.open(MORE_INFO_PAGE_URL, '_blank')
              }}>
              More details <ArrowRightOutlined />
            </Button>

            <Button
              className="btn-wallet-ukraine"
              shape="round"
              type="primary"
              //   icon={<LoginOutlined />}
              size={'large'}
              onClick={() => {
                const scanUrl = getChainById(ChainId.FTM).metamask.blockExplorerUrls[0]
                window.open(scanUrl + 'address/' + DONATION_FTM_WALLET, '_blank')
              }}>
              Wallet address <ArrowRightOutlined />
            </Button>
            <div
              onClick={() => window.open('https://li.fi', '_blank')}
              style={{ marginTop: 94, cursor: 'pointer' }}>
              <LifiTeam></LifiTeam>
            </div>
          </Col>
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
