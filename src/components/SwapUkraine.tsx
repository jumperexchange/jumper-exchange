import './SwapUkraine.css'

import { ArrowRightOutlined, LoadingOutlined, SwapOutlined, SyncOutlined } from '@ant-design/icons'
import {
  Button,
  Checkbox,
  Col,
  Collapse,
  Divider,
  Form,
  InputNumber,
  Modal,
  Row,
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
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TwitterTweetEmbed } from 'react-twitter-embed'
import { v4 as uuid } from 'uuid'

import { DonateIcon } from '../assets/icons/donateIcon'
import { SecuredWalletIcon } from '../assets/icons/securedWalletIcon'
import { UkraineIcon } from '../assets/icons/ukraineIcon'
import { LifiTeam } from '../assets/Li.Fi/LiFiTeam'
import { PoweredByLiFi } from '../assets/Li.Fi/poweredByLiFi'
import { useMetatags } from '../hooks/useMetatags'
import LiFi from '../LiFi'
import { useChainsTokensTools } from '../providers/chainsTokensToolsProvider'
import { useWallet } from '../providers/WalletProvider'
import { readActiveRoutes, readHistoricalRoutes, storeRoute } from '../services/localStorage'
import { switchChain } from '../services/metamask'
import { loadTokenListAsTokens } from '../services/tokenListService'
import {
  formatTokenAmount,
  formatTokenAmountOnly,
  getBalance,
  isWalletDeactivated,
} from '../services/utils'
import {
  Chain,
  ChainId,
  ChainKey,
  CoinKey,
  findDefaultToken,
  getChainById,
  getChainByKey,
  isSwapStep,
  Route as RouteType,
  RoutesRequest,
  RoutesResponse,
  SwapPageStartParams,
  Token,
  TokenAmount,
  TokenAmountList,
  TokenWithAmounts,
} from '../types'
import SwapForm from './SwapForm/SwapForm'
import { ToSectionUkraine } from './SwapForm/SwapFormToSections/ToSectionUkraine'
import Swapping from './Swapping'
import ConnectButton from './web3/ConnectButton'

const history = createBrowserHistory()
const DONATION_WALLET = '0x0B0ff19ab0ee6265D4184ed810e092D9A89074D9'
const MORE_INFO_PAGE_URL =
  'https://lifi.notion.site/More-Information-Ukraine-Donation-9b39682ad76d4a5697684260273c525e'

let currentRouteCallId: string

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

const Swap = () => {
  useMetatags({
    title: 'LI.FI - Help Ukraine!',
  })
  const chainsTokensTools = useChainsTokensTools()

  // chains
  const [availableChains, setAvailableChains] = useState<Chain[]>(chainsTokensTools.chains)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [unused, setStateUpdate] = useState<number>(0)

  // From
  const [fromChainKey, setFromChainKey] = useState<ChainKey | undefined>()
  const [depositAmount, setDepositAmount] = useState<BigNumber>(new BigNumber(0))
  const [fromTokenAddress, setFromTokenAddress] = useState<string | undefined>()
  const [toChainKey] = useState<ChainKey>(ChainKey.POL)
  const [withdrawAmount, setWithdrawAmount] = useState<BigNumber>(new BigNumber(Infinity))
  const [toTokenAddress] = useState<string | undefined>(
    findDefaultToken(CoinKey.ETH, ChainId.POL).address,
  )
  const [tokens, setTokens] = useState<TokenAmountList>(chainsTokensTools.tokens as TokenAmountList)
  const [refreshTokens, setRefreshTokens] = useState<boolean>(false)
  const [balances, setBalances] = useState<{ [ChainKey: string]: Array<TokenAmount> }>()
  const [refreshBalances, setRefreshBalances] = useState<boolean>(true)
  const [routeCallResult, setRouteCallResult] = useState<{ result: RoutesResponse; id: string }>()

  // Options
  const [optionSlippage, setOptionSlippage] = useState<number>(3)
  const [optionInfiniteApproval, setOptionInfiniteApproval] = useState<boolean>(false)
  const [optionEnabledBridges, setOptionEnabledBridges] = useState<string[] | undefined>(
    chainsTokensTools.bridges,
  )
  const [, setAvailableBridges] = useState<string[]>(chainsTokensTools.bridges)
  const [optionEnabledExchanges, setOptionEnabledExchanges] = useState<string[] | undefined>(
    chainsTokensTools.exchanges,
  )
  const [, setAvailableExchanges] = useState<string[]>(chainsTokensTools.exchanges)

  // Routes
  const [routes, setRoutes] = useState<Array<RouteType>>([])
  const [routesLoading, setRoutesLoading] = useState<boolean>(false)
  const [noRoutesAvailable, setNoRoutesAvailable] = useState<boolean>(false)
  const [selectedRoute, setSelectedRoute] = useState<RouteType | undefined>()
  const [activeRoutes, setActiveRoutes] = useState<Array<RouteType>>(readActiveRoutes())
  const [, setHistoricalRoutes] = useState<Array<RouteType>>(readHistoricalRoutes())

  // Misc
  const [restartedOnPageLoad, setRestartedOnPageLoad] = useState<boolean>(false)
  const [balancePollingStarted, setBalancePollingStarted] = useState<boolean>(false)
  const [startParamsDefined, setStartParamsDefined] = useState<boolean>(false)
  const tokensAndChainsSet = useMemo(
    () => availableChains.length !== 0 && Object.keys(tokens).length !== 0,
    [tokens, availableChains],
  )

  // Wallet
  const { account } = useWallet()

  // Elements used for animations
  const routeCards = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // get new execution status on page load
    if (!restartedOnPageLoad) {
      setRestartedOnPageLoad(true)

      activeRoutes.map((route) => {
        if (!account.signer) return
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
        LiFi.resumeRoute(account.signer, route, settings)
        LiFi.moveExecutionToBackground(route)
      })
    }
  }, [account.signer])

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

  // get chains
  useEffect(() => {
    setAvailableChains(chainsTokensTools.chains)

    // load()
  }, [chainsTokensTools.chains])

  //get tokens
  useEffect(() => {
    setTokens(chainsTokensTools.tokens as TokenAmountList)
  }, [chainsTokensTools.tokens])

  //get tools
  useEffect(() => {
    setAvailableExchanges(chainsTokensTools.bridges)
    setOptionEnabledExchanges(chainsTokensTools.exchanges)
    setAvailableBridges(chainsTokensTools.bridges)
    setOptionEnabledBridges(chainsTokensTools.bridges)
  }, [chainsTokensTools.bridges, chainsTokensTools.exchanges])

  useEffect(() => {
    if (tokensAndChainsSet) {
      setRefreshBalances(true)
    }
  }, [availableChains, tokens])

  const getSelectedWithdraw = () => {
    if (!routes.length) {
      return {
        estimate: '0.0',
      }
    } else {
      const route = routes[0]
      const lastStep = route.steps[route.steps.length - 1]
      return {
        estimate: formatTokenAmountOnly(lastStep.action.toToken, lastStep.estimate?.toAmount),
        min: formatTokenAmount(lastStep.action.toToken, lastStep.estimate?.toAmountMin),
      }
    }
  }

  // autoselect from chain based on wallet
  useEffect(() => {
    if (!fromChainKey && startParamsDefined) {
      const walletChainIsSupported = availableChains.some((chain) => chain.id === account.chainId)
      if (!walletChainIsSupported) return
      if (account.chainId && !fromChainKey) {
        const chain = availableChains.find((chain) => chain.id === account.chainId)
        if (chain) {
          setFromChainKey(chain.key)
        }
      }
    }
  }, [account.chainId, fromChainKey, availableChains, startParamsDefined])

  useEffect(() => {
    if (tokensAndChainsSet) {
      const startParams = getDefaultParams(history.location.search, availableChains, tokens)
      setFromChainKey(startParams.depositChain)
      setDepositAmount(startParams.depositAmount)
      setFromTokenAddress(startParams.depositToken)
      setStartParamsDefined(true)
    }
  }, [availableChains, tokens])

  const updateTokenData = (token: Token) => {
    LiFi.getToken(token.chainId, token.address).then((updatedToken: TokenWithAmounts) => {
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

  const getDefaultParams = (
    search: string,
    availableChains: Chain[],
    transferTokens: { [ChainKey: string]: Array<Token> },
  ) => {
    const defaultParams: SwapPageStartParams = {
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
        newFromChain = availableChains.find((chain) => chain.id === newFromChainId)

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
          const newToken = {
            address: fromTokenId,
            symbol: 'Unknown',
            decimals: 18,
            chainId: newFromChain.id,
            coinKey: '' as CoinKey,
            name: 'Unknown',
            logoURI: '',
          }
          transferTokens[defaultParams.depositChain].push(newToken)

          updateTokenData(newToken)
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
        newToChain = availableChains.find((chain) => chain.id === newToChainId)

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
          const newToken = {
            address: toTokenId,
            symbol: 'Unknown',
            decimals: 18,
            chainId: newToChain.id,
            coinKey: '' as CoinKey,
            name: 'Unknown',
            logoURI: '',
          }
          transferTokens[defaultParams.withdrawChain].push(newToken)
          updateTokenData(newToken)
          defaultParams.withdrawToken = toTokenId
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(e)
      }
    }

    return defaultParams
  }

  // update query string
  useEffect(() => {
    if (startParamsDefined) {
      const params = {
        fromChain: fromChainKey,
        fromToken: fromTokenAddress,
        toChain: toChainKey,
        toToken: toTokenAddress,
        fromAmount: depositAmount.gt(0) ? depositAmount.toFixed() : undefined,
      }

      const search = QueryString.stringify(params)
      history.push({
        pathname: '/showcase/ukraine',
        search,
      })
    }
  }, [fromChainKey, fromTokenAddress, toChainKey, depositAmount, startParamsDefined])

  useEffect(() => {
    if (refreshTokens) {
      setRefreshTokens(false)

      availableChains.map(async (chain) => {
        const newTokens = {
          [chain.key]: await loadTokenListAsTokens(chain.id),
        }
        setTokens((tokens) => Object.assign(tokens, newTokens))
        setStateUpdate((stateUpdate) => stateUpdate + 1)
      })
    }
  }, [refreshTokens, availableChains])

  const updateBalances = useCallback(async () => {
    if (account.address) {
      // one call per chain to show balances as soon as the request comes back
      Object.entries(tokens).forEach(([chainKey, tokenList]) => {
        LiFi.getTokenBalances(account.address!, tokenList).then((portfolio: TokenAmount[]) => {
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
  }, [account.address, tokens])

  useEffect(() => {
    if (refreshBalances && account.address) {
      setRefreshBalances(false)
      updateBalances()
    }
  }, [refreshBalances, account.address, updateBalances])

  useEffect(() => {
    if (!account.address) {
      setBalances(undefined) // reset old balances
    }
  }, [account.address])

  useEffect(() => {
    // merge tokens and balances
    for (const chain of availableChains) {
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
  }, [tokens, balances, availableChains])

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
    const token = findDefaultToken(fromChain.coin, fromChain.id)
    const balance = getBalance(balances, fromChain.key, token.address)

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
    const token = findDefaultToken(crossChain.coin, crossChain.id)
    const balance = getBalance(balances, crossChain.key, token.address)

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
          fromAddress: account.address || undefined,
          toAddress: DONATION_WALLET, // TODO: change this to the recipient address
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
          // const result = await getRoute(request, web3.library?.getSigner())

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
        setNoRoutesAvailable(result.routes.length === 0)
        setRoutesLoading(false)
      }
    }
  }, [routeCallResult, currentRouteCallId])

  //TODO: check what is needed here!
  const openModal = () => {
    // structuredClone to open new modal without execution info of previous transfer using same route card
    setSelectedRoute(structuredClone(routes[0]))

    // Reset routes to avoid reexecution with same data
    setRoutes([])
    setNoRoutesAvailable(false)
  }

  const submitButton = () => {
    if (!account.isActive && isWalletDeactivated(account.address)) {
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
    if (!account.address) {
      return <ConnectButton className="btn-ukraine-swap-form" size="large" />
    }
    if (fromChainKey && account.chainId !== getChainByKey(fromChainKey).id) {
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
    if (!hasSufficientGasBalanceOnStartChain(routes[0])) {
      return (
        <Button disabled={true} shape="round" type="primary" size={'large'}>
          Insufficient Gas on Start Chain
        </Button>
      )
    }
    if (!hasSufficientGasBalanceOnCrossChain(routes[0])) {
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
        disabled={!routes}
        shape="round"
        className="btn-ukraine-swap-form"
        type="primary"
        size={'large'}
        onClick={() => openModal()}>
        <span className="ukraine-flag">&#127482;&#127462;</span> Donate
      </Button>
    )
  }

  return (
    <Content
      className="site-layout-swap-ukraine"
      style={{
        minHeight: 'calc(100vh - 64px)',
        marginTop: '64px',
      }}>
      <div className="swap-view-ukraine">
        {/* Swap Form */}
        <Row className="ukraine-title-row">
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
              minHeight: 'calc(100vh - 64px)',
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
                  availableChains={availableChains}
                  tokens={tokens}
                  balances={balances}
                  allowSameChains={true}
                  fixedWithdraw={true}
                  alternativeToSection={<ToSectionUkraine />}
                />
                <span>
                  {/* Disclaimer */}
                  <Row justify={'center'} className="beta-disclaimer">
                    <Typography.Text type="danger" style={{ textAlign: 'center' }}>
                      Beta product - use at own risk.
                    </Typography.Text>
                  </Row>
                  <Row style={{ marginTop: 24 }} justify={'center'}>
                    {submitButton()}
                  </Row>
                  {/* Advanced Options */}
                  <Row justify={'center'} style={{ marginTop: '12px' }}>
                    <Collapse ghost style={{ width: '100%' }}>
                      <Collapse.Panel
                        header={`Advanced Options`}
                        style={{ maxHeight: 390, overflow: 'scroll' }}
                        key="1">
                        Slippage
                        <div>
                          <InputNumber
                            defaultValue={optionSlippage}
                            min={0}
                            max={100}
                            formatter={(value) => `${value}%`}
                            parser={(value) => parseFloat(value ? value.replace('%', '') : '')}
                            onChange={(value: number | null) => {
                              setOptionSlippage(value || 3)
                            }}
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
                            onChange={(e) => setOptionInfiniteApproval(e.target.checked)}>
                            Activate Infinite Approval
                          </Checkbox>
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
              Pooling resources to avoid high transaction fees. This means even{' '}
              <b>the smallest donations count the most!</b>
            </Title>
            <br />

            <div className="ukraine-infographic">
              <Row gutter={[40, 24]} justify="center" align="middle">
                <Col xs={24} sm={24} md={8} lg={8} xl={8} style={{ height: 200 }}>
                  <DonateIcon />
                  <div style={{ maxWidth: 200, maxHeight: 200, margin: '0 auto' }}>
                    Choose your donation amount and currency.
                  </div>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8} xl={8} style={{ height: 200 }}>
                  <SecuredWalletIcon />

                  <div style={{ maxWidth: 200, maxHeight: 200, margin: '0 auto' }}>
                    Funds are sent to our multi-sig wallet on Polygon.
                  </div>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8} xl={8} style={{ height: 200 }}>
                  <UkraineIcon />
                  <div style={{ maxWidth: 200, maxHeight: 200, margin: '0 auto' }}>
                    Every 8h we donate all collected funds.
                  </div>
                </Col>
              </Row>
            </div>
            <Divider style={{ borderColor: 'black' }} />
            <Paragraph style={{ marginTop: 64 }}>
              Hello World 👋 <br />
              Ukraine is in a very tough situation right now, all of us want to help, but we can
              only do so much. We all know that Ethereum gas fees make it harder to donate smaller
              amounts. So, we’ve spun up a simple system using LI.FI protocol to donate from any EVM
              chain, it will be stored in a Hardware Wallet controlled by LI.FI team and will be
              bridged to Ethereum periodically and sent to the ETH address used by the{' '}
              <b>Ukraine government</b>.
            </Paragraph>

            <div className="tweet-wrapper" style={{ marginTop: 64 }}>
              <TwitterTweetEmbed tweetId="1497594592438497282"></TwitterTweetEmbed>
            </div>

            <Paragraph>You can verify our transactions on the blockchain.</Paragraph>
            <Button
              className="btn-info-ukraine"
              shape="round"
              type="primary"
              size={'large'}
              onClick={() => {
                // eslint-disable-next-line security/detect-non-literal-fs-filename
                window.open(MORE_INFO_PAGE_URL, '_blank')
              }}>
              More details <ArrowRightOutlined />
            </Button>

            <Button
              className="btn-wallet-ukraine"
              shape="round"
              type="primary"
              size={'large'}
              onClick={() => {
                const scanUrl = getChainById(ChainId.POL).metamask.blockExplorerUrls[0]
                // eslint-disable-next-line security/detect-non-literal-fs-filename
                window.open(scanUrl + 'address/' + DONATION_WALLET + '#tokentxns', '_blank')
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
          open={selectedRoute.steps.length > 0}
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
            fixedRecipient={true}
            route={selectedRoute}
            settings={{ infiniteApproval: optionInfiniteApproval }}
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
