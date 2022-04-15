import './SwapPillarZap.css'

import { ArrowRightOutlined, LoadingOutlined, SwapOutlined, SyncOutlined } from '@ant-design/icons'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import {
  Button,
  Checkbox,
  Col,
  Collapse,
  Divider,
  Form,
  Input,
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
import { NetworkNames, Sdk, Web3WalletProvider } from 'etherspot'
import { createBrowserHistory } from 'history'
import { animate, stagger } from 'motion'
import QueryString from 'qs'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'

import { DonateIcon } from '../assets/icons/donateIcon'
import { SecuredWalletIcon } from '../assets/icons/securedWalletIcon'
import { UkraineIcon } from '../assets/icons/ukraineIcon'
import { LifiTeam } from '../assets/Li.Fi/LiFiTeam'
import { PoweredByLiFi } from '../assets/Li.Fi/poweredByLiFi'
import { KLIMA_ADDRESS, sKLIMA_ADDRESS } from '../constants'
import LiFi from '../LiFi'
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
  findDefaultToken,
  getChainById,
  getChainByKey,
  isSwapStep,
  PossibilitiesResponse,
  Route,
  Route as RouteType,
  RoutesRequest,
  Step,
  Token,
  TokenAmount,
} from '../types'
import SwapForm from './SwapForm'
import SwappingPillar from './SwappingPillar'
import ConnectButton from './web3/ConnectButton'
import { getInjectedConnector } from './web3/connectors'

const history = createBrowserHistory()
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
  availableChains: Chain[],
  transferTokens: { [ChainKey: string]: Array<Token> },
) => {
  const defaultParams: StartParams = {
    depositChain: undefined,
    depositToken: undefined,
    depositAmount: new BigNumber(-1),
    withdrawChain: ChainKey.POL,
    withdrawToken: findDefaultToken(CoinKey.USDC, ChainId.POL).address,
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

interface ExtendedRoute {
  lifiRoute: RouteType
  gasStep: Step
  klimaStep: Step
}

interface StartParams {
  depositChain?: ChainKey
  depositToken?: string
  depositAmount: BigNumber
  withdrawChain?: ChainKey
  withdrawToken?: string
}

const Swap = () => {
  // chains
  const [availableChains, setAvailableChains] = useState<Chain[]>([])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [unused, setStateUpdate] = useState<number>(0)

  // From
  const [fromChainKey, setFromChainKey] = useState<ChainKey | undefined>()
  const [depositAmount, setDepositAmount] = useState<BigNumber>(new BigNumber(0))
  const [fromTokenAddress, setFromTokenAddress] = useState<string | undefined>()
  const [toChainKey, setToChainKey] = useState<ChainKey | undefined>()
  const [withdrawAmount, setWithdrawAmount] = useState<BigNumber>(new BigNumber(Infinity))
  const [toTokenAddress] = useState<string | undefined>(
    findDefaultToken(CoinKey.USDC, ChainId.POL).address,
  ) // TODO: Change This
  const [tokens, setTokens] = useState<TokenAmountList>({})
  const [refreshTokens, setRefreshTokens] = useState<boolean>(false)
  const [balances, setBalances] = useState<{ [ChainKey: string]: Array<TokenAmount> }>()
  const [refreshBalances, setRefreshBalances] = useState<boolean>(true)
  const [routeCallResult, setRouteCallResult] =
    useState<{ lifiRoute: RouteType; gasStep: Step; stakingStep: Step; id: string }>()

  // Options
  const [optionSlippage, setOptionSlippage] = useState<number>(3)
  const [optionInfiniteApproval, setOptionInfiniteApproval] = useState<boolean>(false)
  const [optionEnabledBridges, setOptionEnabledBridges] = useState<string[] | undefined>()
  const [, setAvailableBridges] = useState<string[]>([])
  const [optionEnabledExchanges, setOptionEnabledExchanges] = useState<string[] | undefined>()
  const [, setAvailableExchanges] = useState<string[]>([])

  // Routes
  const [route, setRoute] = useState<ExtendedRoute>({} as any)
  const [routesLoading, setRoutesLoading] = useState<boolean>(false)
  const [noRoutesAvailable, setNoRoutesAvailable] = useState<boolean>(false)
  const [selectedRoute, setSelectedRoute] = useState<ExtendedRoute | undefined>()
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
  const [activeRoutes, setActiveRoutes] = useState<Array<RouteType>>(readActiveRoutes())
  const [, setHistoricalRoutes] = useState<Array<RouteType>>(readHistoricalRoutes())

  // Misc
  const [restartedOnPageLoad, setRestartedOnPageLoad] = useState<boolean>(false)
  const [balancePollingStarted, setBalancePollingStarted] = useState<boolean>(false)
  const [startParamsDefined, setStartParamsDefined] = useState<boolean>(false)
  const [possibilitiesLoaded, setPossibilitiesLoaded] = useState<boolean>(false)
  const [tokenPolygonKLIMA, setTokenPolygonKlima] = useState<Token>()
  const [tokenPolygonSKLIMA, setTokenPolygonSKLIMA] = useState<Token>()

  // Wallet
  const web3 = useWeb3React<Web3Provider>()
  const { active, account, library } = useWeb3React()
  const [etherSpotSDK, setEtherSpotSDK] = useState<Sdk>()

  // setup etherspot sdk
  useEffect(() => {
    const ethersportSDKSetup = async () => {
      // TODO: try generalized connector from web3 object
      const connector = await getInjectedConnector()
      const provider = await Web3WalletProvider.connect(await connector.getProvider())
      const sdk = new Sdk(provider, {
        networkName: NetworkNames.Matic,
      })
      sdk
        .computeContractAccount({
          sync: false,
        })
        .then(() => {
          setEtherSpotSDK(sdk)
        })
    }
    if (active && account && library) {
      ethersportSDKSetup()
    }
  }, [active, account])

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
      const possibilitiesPromise = LiFi.getPossibilities({
        exchanges: { deny: ['dodo', 'openocean', '0x'] },
      })

      const klimaTokenPromise = LiFi.getToken(ChainId.POL, KLIMA_ADDRESS)
      const sKlimaTokenPromise = LiFi.getToken(ChainId.POL, sKLIMA_ADDRESS)!
      const setupPromises: [PossibilitiesResponse, Token, Token] = await Promise.all([
        possibilitiesPromise,
        klimaTokenPromise,
        sKlimaTokenPromise,
      ])
      const possibilities = setupPromises[0]
      setTokenPolygonKlima(setupPromises[1])
      setTokenPolygonSKLIMA(setupPromises[2])
      if (
        !possibilities.chains ||
        !possibilities.bridges ||
        !possibilities.exchanges ||
        !possibilities.tokens
      ) {
        // eslint-disable-next-line
        console.warn('possibilities request did not contain required setup information')
        return
      }

      // chains
      setAvailableChains(possibilities.chains)

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
      possibilities.tokens.forEach((token: TokenWithAmounts) => {
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
      setPossibilitiesLoaded(true)
    }

    load()
  }, [])

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

  // autoselect from chain based on wallet
  useEffect(() => {
    LiFi.getChains().then((chains: any[]) => {
      const walletChainIsSupported = chains.some((chain) => chain.id === web3.chainId)
      if (!walletChainIsSupported) return
      if (web3.chainId && !fromChainKey) {
        const chain = availableChains.find((chain) => chain.id === web3.chainId)
        if (chain) {
          setFromChainKey(chain.key)
        }
      }
    })
  }, [web3.chainId, fromChainKey, availableChains])

  useEffect(() => {
    if (possibilitiesLoaded) {
      const startParams = getDefaultParams(history.location.search, availableChains, tokens)
      setFromChainKey(startParams.depositChain)
      setDepositAmount(startParams.depositAmount)
      setFromTokenAddress(startParams.depositToken)
      setToChainKey(startParams.withdrawChain)
      setStartParamsDefined(true)
    }
  }, [possibilitiesLoaded])

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
        pathname: 'pillar',
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
    if (web3.account) {
      // one call per chain to show balances as soon as the request comes back
      Object.entries(tokens).forEach(([chainKey, tokenList]) => {
        LiFi.getTokenBalances(web3.account!, tokenList).then((portfolio: any) => {
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
  // TODO: fix TODOs here
  useEffect(() => {
    const getTransferRoutes = async () => {
      setRoute({} as any)
      setHighlightedIndex(-1)
      setNoRoutesAvailable(false)

      if (
        depositAmount.gt(0) &&
        fromChainKey &&
        fromTokenAddress &&
        toChainKey &&
        toTokenAddress &&
        etherSpotSDK?.state.accountAddress
      ) {
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
          toAddress: etherSpotSDK.state.accountAddress,
          options: {
            integrator: 'lifi-pillar',
            slippage: optionSlippage / 100,
            bridges: {
              allow: ['connext'], // TODO: check if connext is only option
            },
            allowSwitchChain: false, // This is important for fixed recipients
          },
        }

        const id = uuid()
        try {
          currentRouteCallId = id
          const result = await LiFi.getRoutes(request)
          const amountUsdc = ethers.BigNumber.from(result.routes[0].toAmountMin)
          const amountUsdcToMatic = ethers.utils.parseUnits(
            '0.2',
            result.routes[0].toToken.decimals,
          )
          const amountUsdcToKlima = amountUsdc.sub(amountUsdcToMatic)
          const gasStep = calculateFinalGasStep(result.routes[0], amountUsdcToMatic.toString())
          const stakingStep = calculateFinalStakingStep(
            result.routes[0],
            amountUsdcToKlima.toString(),
          )
          const additionalQuotes = await Promise.all([gasStep, stakingStep])

          setRouteCallResult({
            lifiRoute: result.routes[0],
            gasStep: additionalQuotes[0],
            stakingStep: additionalQuotes[1],
            id,
          })
        } catch (e) {
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
    etherSpotSDK?.state.accountAddress,
  ])

  // set route call results
  useEffect(() => {
    if (routeCallResult) {
      const { lifiRoute, gasStep, stakingStep, id } = routeCallResult

      if (id === currentRouteCallId) {
        setRoute({ lifiRoute, gasStep, klimaStep: stakingStep })
        fadeInAnimation(routeCards)
        setHighlightedIndex(lifiRoute && gasStep && stakingStep ? 0 : -1)
        setNoRoutesAvailable(!lifiRoute || !gasStep || !stakingStep)
        setRoutesLoading(false)
      }
    }
  }, [routeCallResult, currentRouteCallId])

  const calculateFinalGasStep = async (route: Route, amount: string) => {
    const initialTransferDestChain = getChainByKey(toChainKey!)
    const initialTransferDestToken = toTokenAddress!

    const quoteUsdcToMatic = await LiFi.getQuote({
      fromChain: initialTransferDestChain.id, // has been hardcoded in the routeRequest
      fromToken: initialTransferDestToken, // has been hardcoded in the routeRequest
      fromAddress: etherSpotSDK?.state.accountAddress!,
      fromAmount: amount, // TODO: check if correct value
      toChain: initialTransferDestChain.id,
      toToken: (await LiFi.getToken(initialTransferDestChain.id, 'MATIC')!).address, // hardcode return gastoken
      slippage: 0.003,
      integrator: 'lifi-pillar',
      preferExchanges: ['sushiswap-pol'],
    })
    return quoteUsdcToMatic
  }
  const calculateFinalStakingStep = async (route: Route, amount: string) => {
    const initialTransferDestChain = getChainByKey(toChainKey!)
    const initialTransferDestToken = toTokenAddress!

    const quoteUsdcToKlima = await LiFi.getQuote({
      fromChain: initialTransferDestChain.id, // has been hardcoded in the routeRequest
      fromToken: initialTransferDestToken, // has been hardcoded in the routeRequest
      fromAddress: etherSpotSDK?.state.accountAddress!,
      fromAmount: amount, // TODO: check if correct value
      toChain: initialTransferDestChain.id,
      toToken: tokenPolygonKLIMA!.address,
      slippage: 0.003,
      integrator: 'lifi-pillar',
      preferExchanges: ['sushiswap-pol'],
    })
    return quoteUsdcToKlima
  }

  const openModal = () => {
    // deepClone to open new modal without execution info of previous transfer using same route card
    setSelectedRoute(deepClone(route))
    setHighlightedIndex(-1)
    setNoRoutesAvailable(false)
  }

  const submitButton = () => {
    if (!active && isWalletDeactivated(web3.account)) {
      return (
        <Button
          className="btn-pillar-swap-form"
          disabled={true}
          shape="round"
          type="primary"
          icon={<LoadingOutlined />}
          size={'large'}></Button>
      )
    }
    if (!web3.account) {
      return <ConnectButton className="btn-pillar-swap-form" size="large" />
    }
    if (fromChainKey && web3.chainId !== getChainByKey(fromChainKey).id) {
      const fromChain = getChainByKey(fromChainKey)
      return (
        <Button
          className="btn-pillar-swap-form"
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
    if (!hasSufficientGasBalanceOnStartChain(route.lifiRoute)) {
      return (
        <Button disabled={true} shape="round" type="primary" size={'large'}>
          Insufficient Gas on Start Chain
        </Button>
      )
    }
    if (!hasSufficientGasBalanceOnCrossChain(route.lifiRoute)) {
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
        className="btn-pillar-swap-form"
        type="primary"
        size={'large'}
        onClick={() => openModal()}>
        Stake
      </Button>
    )
  }

  const toSection = () => {
    const amount = route?.klimaStep?.estimate?.toAmountMin || '0'
    const formattedAmount = tokenPolygonSKLIMA ? formatTokenAmount(tokenPolygonSKLIMA, amount) : '0'
    return (
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
              value={`${formattedAmount}`}
              bordered={false}
              disabled
              style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: '400' }}
            />
          </div>
        </Col>
      </Row>
    )
  }

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
        <Row className="ukraine-title-row">
          <Col xs={24} sm={24} md={24} lg={24} xl={12} className="ukraine-content-column title-row">
            <Title level={1}>Cross-chain Klima Staking</Title>
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
                  Cross-chain Stake Klima into sKlima
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
                  withdrawChain={ChainKey.POL}
                  setWithdrawChain={() => {}}
                  withdrawToken={findDefaultToken(CoinKey.USDC, ChainId.POL).address}
                  setWithdrawToken={() => {}}
                  withdrawAmount={withdrawAmount}
                  setWithdrawAmount={setWithdrawAmount}
                  estimatedWithdrawAmount={'0'}
                  estimatedMinWithdrawAmount={'0'}
                  availableChains={availableChains}
                  tokens={tokens}
                  balances={balances}
                  allowSameChains={true}
                  fixedWithdraw={true}
                  alternativeToSection={toSection()}
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

            <Paragraph>You can verify our transactions on the blockchain.</Paragraph>
            <Button
              className="btn-info-ukraine"
              shape="round"
              type="primary"
              size={'large'}
              onClick={() => {
                window.open('https://li.fi', '_blank')
              }}>
              More details <ArrowRightOutlined />
            </Button>

            <Button
              className="btn-wallet-ukraine"
              shape="round"
              type="primary"
              size={'large'}
              onClick={() => {
                window.open('https://li.fi', '_blank')
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

      {selectedRoute && !!selectedRoute.lifiRoute.steps.length && (
        <Modal
          className="swapModal"
          visible={selectedRoute.lifiRoute.steps.length > 0}
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
          <SwappingPillar
            fixedRecipient={true}
            route={selectedRoute}
            etherspot={etherSpotSDK!}
            settings={{ infiniteApproval: optionInfiniteApproval }}
            updateRoute={() => {
              setActiveRoutes(readActiveRoutes())
              setHistoricalRoutes(readHistoricalRoutes())
            }}
            onSwapDone={() => {
              setActiveRoutes(readActiveRoutes())
              setHistoricalRoutes(readHistoricalRoutes())
              updateBalances()
            }}></SwappingPillar>
        </Modal>
      )}
    </Content>
  )
}

export default Swap
