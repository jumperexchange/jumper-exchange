import './SwapEtherspotKlimaZap.css'

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
import { NetworkNames, Sdk, Web3WalletProvider } from 'etherspot'
import { CHAIN_ID_TO_NETWORK_NAME } from 'etherspot/dist/sdk/network/constants'
import { createBrowserHistory } from 'history'
import { animate, stagger } from 'motion'
import QueryString from 'qs'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'

import { LifiTeam } from '../assets/Li.Fi/LiFiTeam'
import { PoweredByLiFi } from '../assets/Li.Fi/poweredByLiFi'
import { Etherspot } from '../assets/misc/etherspot'
import { KLIMA_ADDRESS, sKLIMA_ADDRESS } from '../constants'
import LiFi from '../LiFi'
import { readActiveRoutes, readHistoricalRoutes, storeRoute } from '../services/localStorage'
import { switchChain } from '../services/metamask'
import getRoute, { ExtendedTransactionRequest } from '../services/routingService'
import { loadTokenListAsTokens } from '../services/tokenListService'
import {
  deepClone,
  formatTokenAmountOnly,
  isLiFiRoute,
  isWalletDeactivated,
} from '../services/utils'
import {
  BridgeDefinition,
  Chain,
  ChainId,
  ChainKey,
  CoinKey,
  ExchangeDefinition,
  ExchangeTool,
  ExtendedRouteOptional,
  findDefaultToken,
  getChainById,
  getChainByKey,
  isSwapStep,
  PossibilitiesResponse,
  Route as RouteType,
  RoutesRequest,
  Step,
  Token,
  TokenAmount,
} from '../types'
import forest from './../assets/misc/forest.jpg'
import { ResidualRouteKlimaStakeModal } from './ResidualRouteSwappingModal/ResidualRouteKlimaStakeModal'
import SwapForm from './SwapForm/SwapForm'
import { ToSectionKlimaStaking } from './SwapForm/SwapFormToSections/ToSectionKlimaStaking'
import SwappingEtherspotKlima from './SwappingEtherspot/SwappingEtherspotKlima'
import ConnectButton from './web3/ConnectButton'
import { getInjectedConnector } from './web3/connectors'

const TOKEN_POLYGON_USDC = findDefaultToken(CoinKey.USDC, ChainId.POL)

const history = createBrowserHistory()
let currentRouteCallId: string
const allowedDex = ExchangeTool.zerox

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
    withdrawToken: TOKEN_POLYGON_USDC.address,
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
  lifiRoute?: RouteType
  simpleTransfer?: ExtendedTransactionRequest
  gasStep: Step
  stakingStep: Step
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
  const [toTokenAddress] = useState<string | undefined>(TOKEN_POLYGON_USDC.address) // TODO: Change This
  const [tokens, setTokens] = useState<TokenAmountList>({})
  const [refreshTokens, setRefreshTokens] = useState<boolean>(false)
  const [balances, setBalances] = useState<{ [ChainKey: string]: Array<TokenAmount> }>()
  const [refreshBalances, setRefreshBalances] = useState<boolean>(true)
  const [routeCallResult, setRouteCallResult] = useState<{
    lifiRoute?: RouteType
    simpleTransfer?: ExtendedTransactionRequest
    gasStep: Step
    stakingStep: Step
    id: string
  }>()

  // Options
  const [optionSlippage, setOptionSlippage] = useState<number>(3)
  const [optionInfiniteApproval, setOptionInfiniteApproval] = useState<boolean>(false)
  const [optionEnabledBridges, setOptionEnabledBridges] = useState<string[] | undefined>()
  const [availableBridges, setAvailableBridges] = useState<string[]>([])
  const [optionEnabledExchanges, setOptionEnabledExchanges] = useState<string[] | undefined>()
  const [availableExchanges, setAvailableExchanges] = useState<string[]>([])

  // Routes
  const [route, setRoute] = useState<ExtendedRoute>({} as any)
  const [routesLoading, setRoutesLoading] = useState<boolean>(false)
  const [noRoutesAvailable, setNoRoutesAvailable] = useState<boolean>(false)
  const [selectedRoute, setSelectedRoute] = useState<ExtendedRoute | undefined>()
  const [activeRoutes, setActiveRoutes] = useState<Array<RouteType>>(readActiveRoutes())
  const [, setHistoricalRoutes] = useState<Array<RouteType>>(readHistoricalRoutes())
  const [residualRoute, setResidualRoute] = useState<ExtendedRouteOptional>()
  // Misc
  const [restartedOnPageLoad, setRestartedOnPageLoad] = useState<boolean>(false)
  const [balancePollingStarted, setBalancePollingStarted] = useState<boolean>(false)
  const [startParamsDefined, setStartParamsDefined] = useState<boolean>(false)
  const [possibilitiesLoaded, setPossibilitiesLoaded] = useState<boolean>(false)
  const [tokenPolygonKLIMA, setTokenPolygonKlima] = useState<Token>()
  const [tokenPolygonSKLIMA, setTokenPolygonSKLIMA] = useState<Token>()

  // Wallet
  const web3 = useWeb3React<Web3Provider>()
  const { active, account, library, chainId } = useWeb3React()
  const [etherSpotSDK, setEtherSpotSDK] = useState<Sdk>()
  const [etherspotWalletBalance, setEtherspotWalletBalance] = useState<BigNumber>()

  // setup etherspot sdk
  useEffect(() => {
    const etherspotSDKSetup = async () => {
      // overwrite know chains in etherspot SDK
      for (const chain of availableChains) {
        CHAIN_ID_TO_NETWORK_NAME[chain.id] = chain.name as NetworkNames
      }

      // get provider
      const connector = await getInjectedConnector()
      const provider = await Web3WalletProvider.connect(await connector.getProvider())

      // setup sdk for polygon
      const sdk = new Sdk(provider, {
        // don't fail if provider is on unknown chain
        omitWalletProviderNetworkCheck: true,
      })
      // all sdk actions will be executed on polygon
      sdk.services.networkService.switchNetwork(NetworkNames.Matic)
      // generate smart contract wallet address
      await sdk.computeContractAccount({
        sync: false,
      })
      setEtherSpotSDK(sdk)
    }

    if (active && account && library && availableChains.find((chain) => chain.id === chainId)) {
      etherspotSDKSetup()
    }
  }, [active, account, library, chainId, availableChains])

  // Check Etherspot Wallet balance
  useEffect(() => {
    const checkEtherspotWalletBalance = async (wallet: string) => {
      const balance = await LiFi.getTokenBalance(wallet, TOKEN_POLYGON_USDC)
      const amount = new BigNumber(balance?.amount || 0)
      if (amount.gte(0.3)) {
        setEtherspotWalletBalance(amount)
      } else {
        setEtherspotWalletBalance(undefined)
        return
      }
      const amountUsdc = ethers.BigNumber.from(
        amount.shiftedBy(TOKEN_POLYGON_USDC.decimals).toString(),
      )
      const amountUsdcToMatic = ethers.utils.parseUnits('0.2', TOKEN_POLYGON_USDC.decimals)
      const amountUsdcToKlima = amountUsdc.sub(amountUsdcToMatic)

      const gasStep = calculateFinalGasStep(amountUsdcToMatic.toString())
      const stakingStep = calculateFinalStakingStep(amountUsdcToKlima.toString())
      const quotes = await Promise.all([gasStep, stakingStep])

      const residualRoute: ExtendedRouteOptional = {
        gasStep: quotes[0],
        stakingStep: quotes[1],
      }
      setResidualRoute(residualRoute)
    }
    if (etherSpotSDK?.state.accountAddress) {
      checkEtherspotWalletBalance(etherSpotSDK.state.accountAddress)
    }
  }, [etherSpotSDK, tokenPolygonKLIMA, tokenPolygonSKLIMA])

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
        bridges: { deny: ['multichain'] },
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
      const chains = possibilities.chains
      setAvailableChains(chains)

      // bridges
      const bridges: string[] = possibilities.bridges
        .map((bridge: BridgeDefinition) => bridge.tool)
        .map((bridgeTool: string) => bridgeTool.split('-')[0])
      const allBridges = Array.from(new Set(bridges))
      setAvailableBridges(allBridges)
      setOptionEnabledBridges(allBridges)

      // exchanges
      const exchanges: string[] = possibilities.exchanges
        .map((exchange: ExchangeDefinition) => exchange.tool)
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
    LiFi.getChains().then((chains: Chain[]) => {
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
        pathname: '/showcase/etherspot-klima',
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
        LiFi.getTokenBalances(web3.account!, tokenList).then((portfolio: TokenAmount[]) => {
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

  useEffect(() => {
    const getTransferRoutes = async () => {
      setRoute({} as any)
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
            integrator: 'lifi-etherspot',
            slippage: optionSlippage / 100,
            allowSwitchChain: false, // This is important for fixed recipients
            bridges: {
              allow: optionEnabledBridges,
              deny: ['multichain'],
            },
            exchanges: {
              allow: optionEnabledExchanges,
            },
          },
        }

        const id = uuid()
        try {
          currentRouteCallId = id
          const signer = web3.library?.getSigner()
          const routeCall = await getRoute(request, signer)

          let toAmountMin
          if (isLiFiRoute(routeCall[0])) {
            toAmountMin = routeCall[0].toAmountMin
          } else {
            toAmountMin = request.fromAmount // get this from the request as there is no specific amount field in TransactionRequest
          }
          const amountUsdc = ethers.BigNumber.from(toAmountMin)
          const toToken = await LiFi.getToken(request.toChainId, request.toTokenAddress)
          const amountUsdcToMatic = ethers.utils.parseUnits('0.2', toToken.decimals)
          const amountUsdcToKlima = amountUsdc.sub(amountUsdcToMatic)
          const gasStep = calculateFinalGasStep(amountUsdcToMatic.toString())
          const stakingStep = calculateFinalStakingStep(amountUsdcToKlima.toString())
          const additionalQuotes = await Promise.all([gasStep, stakingStep])

          if (isLiFiRoute(routeCall[0])) {
            setRouteCallResult({
              lifiRoute: routeCall[0],
              gasStep: additionalQuotes[0],
              stakingStep: additionalQuotes[1],
              id: id,
            })
          } else {
            setRouteCallResult({
              simpleTransfer: routeCall[0],
              gasStep: additionalQuotes[0],
              stakingStep: additionalQuotes[1],
              id: id,
            })
          }
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
    etherSpotSDK,
  ])

  // set route call results
  useEffect(() => {
    if (routeCallResult) {
      const { lifiRoute, gasStep, stakingStep, simpleTransfer, id } = routeCallResult

      if (id === currentRouteCallId) {
        setRoute({ lifiRoute, gasStep, stakingStep: stakingStep, simpleTransfer })
        fadeInAnimation(routeCards)
        setNoRoutesAvailable((!lifiRoute && !simpleTransfer) || !gasStep || !stakingStep)
        setRoutesLoading(false)
      }
    }
  }, [routeCallResult, currentRouteCallId])

  const calculateFinalGasStep = async (amount: string) => {
    const polChain = getChainByKey(ChainKey.POL)

    const quoteUsdcToMatic = await LiFi.getQuote({
      fromChain: polChain.id,
      fromToken: TOKEN_POLYGON_USDC.address,
      fromAddress: etherSpotSDK?.state.accountAddress!,
      fromAmount: amount,
      toChain: polChain.id,
      toToken: (await LiFi.getToken(polChain.id, 'MATIC')!).address, // hardcode return gastoken
      slippage: 0.005,
      integrator: 'lifi-etherspot',
      allowExchanges: [allowedDex],
    })
    return quoteUsdcToMatic
  }
  const calculateFinalStakingStep = async (amount: string) => {
    const polChain = getChainByKey(ChainKey.POL)

    const quoteUsdcToKlima = await LiFi.getQuote({
      fromChain: polChain.id,
      fromToken: TOKEN_POLYGON_USDC.address,
      fromAddress: etherSpotSDK?.state.accountAddress!,
      fromAmount: amount,
      toChain: polChain.id,
      toToken: KLIMA_ADDRESS,
      slippage: 0.005,
      integrator: 'lifi-etherspot',
      allowExchanges: [allowedDex],
    })
    return quoteUsdcToKlima
  }

  const openModal = () => {
    // deepClone to open new modal without execution info of previous transfer using same route card
    setSelectedRoute(deepClone(route))
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
      return <ConnectButton size="large" />
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
        disabled={!route.lifiRoute && !route.simpleTransfer}
        shape="round"
        type="primary"
        size={'large'}
        onClick={() => openModal()}>
        Stake
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
            <Title level={1}>Cross-Chain Klima Staking</Title>
          </Col>
          <Col
            className="swap-form-etherspot"
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={12}
            style={{
              minHeight: 'calc(100vh - 64px)',
              backgroundImage: `url(${forest})`,
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
                  Cross-chain Stake into sKlima
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
                  withdrawToken={TOKEN_POLYGON_USDC.address}
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
                  alternativeToSection={
                    <ToSectionKlimaStaking
                      step={route?.stakingStep}
                      tokenPolygonSKLIMA={tokenPolygonSKLIMA}
                      routesLoading={routesLoading}
                    />
                  }
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
              style={{
                margin: '32px auto',
                padding: '14px 20px 10px',
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.69)',
                borderRadius: 18,
                cursor: 'pointer',
              }}>
              <a href="https://li.fi/" target="_blank" rel="nofollow noreferrer">
                <PoweredByLiFi />
              </a>

              <span style={{ verticalAlign: 'super', margin: 8 }}>&</span>

              <a href="https://etherspot.io/" target="_blank" rel="nofollow noreferrer">
                <Etherspot />
              </a>
            </div>
          </Col>
        </Row>

        <Row>
          <Col xs={24} sm={24} md={24} lg={24} xl={12} className="ukraine-content-column">
            <Title level={4}>
              LI.FI and Etherspot teams have joined hands to support cross-chain deposits into the
              Klima staking contract.
            </Title>
            <br />

            <Divider style={{ borderColor: 'black' }} />
            <Paragraph style={{ marginTop: 64 }}>
              <h2>What is happening here?</h2>
              We’re combining
              <ol>
                <li>
                  LI.FI’s ability to perform <b>any-2-any cross-chain swaps</b> and
                </li>
                <li>
                  Etherspot’s smart contract wallet feature through which we can{' '}
                  <b>batch transactions and sign cross-chain transactions</b> without RPC switch,{' '}
                </li>
              </ol>
              to <b>facilitate cross-chain staking into the Klima</b> smart contract in just 3 steps
              which would normally be 9 steps on 3 different dapps.
            </Paragraph>
            <Paragraph style={{ marginTop: 64 }}>
              <h2>What is happening in the background?</h2>
              When a cross-chain swap is completed via LI.FI, the asset is received on the
              counterfactual smart wallet that the user controls on Polygon. The user then executes
              a transaction that:
              <ol>
                <li>Swaps USDC to MATIC.</li>
                <li>Swaps the USDC to KLIMA.</li>
                <li>Deploys the Smart Wallet.</li>
                <li>Stakes KLIMA to receive sKLIMA.</li>
                <li>Sends sKLIMA back to the keywallet address (e.g. Metamask)</li>
              </ol>
              All in a single transaction on the destination chain, with no need to switch RPC
              networks and no need to have the gas token.
            </Paragraph>

            <Button
              className="btn-info-ukraine"
              shape="round"
              type="primary"
              size={'large'}
              onClick={() => {
                window.open('https://etherspot.io/', '_blank')
              }}>
              Etherspot <ArrowRightOutlined />
            </Button>

            <Button
              className="btn-wallet-ukraine"
              shape="round"
              type="primary"
              size={'large'}
              onClick={() => {
                window.open('https://www.klimadao.finance/', '_blank')
              }}>
              KlimaDAO <ArrowRightOutlined />
            </Button>
            <div
              onClick={() => window.open('https://li.fi', '_blank')}
              style={{ marginTop: 34, cursor: 'pointer' }}>
              <LifiTeam></LifiTeam>
            </div>
          </Col>
        </Row>
      </div>

      {selectedRoute && (
        <Modal
          className="swapModal"
          visible={!!selectedRoute}
          onOk={() => {
            setSelectedRoute(undefined)
            updateBalances()
          }}
          onCancel={() => {
            setSelectedRoute(undefined)
            updateBalances()
          }}
          destroyOnClose={true}
          maskClosable={false}
          width={700}
          footer={null}>
          <SwappingEtherspotKlima
            fixedRecipient={true}
            route={selectedRoute}
            etherspot={etherSpotSDK}
            settings={{ infiniteApproval: optionInfiniteApproval }}
            updateRoute={() => {
              setActiveRoutes(readActiveRoutes())
              setHistoricalRoutes(readHistoricalRoutes())
            }}
            onSwapDone={() => {
              setActiveRoutes(readActiveRoutes())
              setHistoricalRoutes(readHistoricalRoutes())
              updateBalances()
            }}></SwappingEtherspotKlima>
        </Modal>
      )}

      {etherspotWalletBalance && residualRoute && (
        <Modal
          onCancel={() => {
            setEtherspotWalletBalance(undefined)
            setResidualRoute(undefined)
          }}
          visible={!!etherspotWalletBalance && !!residualRoute}
          okText="Swap, stake and receive sKlima"
          // cancelText="Send USDC to my wallet"
          footer={null}>
          <ResidualRouteKlimaStakeModal
            etherSpotSDK={etherSpotSDK!}
            etherspotWalletBalance={etherspotWalletBalance}
            setEtherspotWalletBalance={setEtherspotWalletBalance}
            residualRoute={residualRoute}
            setResidualRoute={setResidualRoute}
            tokenPolygonSKLIMA={tokenPolygonSKLIMA!}
          />
        </Modal>
      )}
    </Content>
  )
}

export default Swap
