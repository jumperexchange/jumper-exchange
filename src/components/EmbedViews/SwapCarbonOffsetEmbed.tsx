import './SwapEtherspotKlimaEmbed.css'

import { LoadingOutlined, SwapOutlined, SyncOutlined } from '@ant-design/icons'
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
import QueryString from 'qs'
import { useCallback, useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'

import { PoweredByLiFi } from '../../assets/Li.Fi/poweredByLiFi'
import { TOUCAN_BCT_ADDRESS } from '../../constants'
import LiFi from '../../LiFi'
import { useChainsTokensTools } from '../../providers/chainsTokensToolsProvider'
import { useBeneficiaryInfo } from '../../providers/ToSectionCarbonOffsetProvider'
import { useWallet } from '../../providers/WalletProvider'
import {
  getCarbonOffsetSourceAmount,
  getOffsetCarbonTransaction,
} from '../../services/etherspotTxService'
import { readActiveRoutes, readHistoricalRoutes } from '../../services/localStorage'
import { switchChain } from '../../services/metamask'
import { loadTokenListAsTokens } from '../../services/tokenListService'
import { deepClone, formatTokenAmountOnly, isWalletDeactivated } from '../../services/utils'
import {
  Chain,
  ChainId,
  ChainKey,
  CoinKey,
  ContractCallQuoteRequest,
  findDefaultToken,
  getChainById,
  getChainByKey,
  isSwapStep,
  Route as RouteType,
  SwapPageStartParams,
  Token,
  TokenAmount,
} from '../../types'
import { FromSectionCarbonOffset } from '../SwapForm/SwapFormFromSections/FromSectionCarbonOffset'
import Swapping from '../Swapping'
import SwapForm from './../SwapForm/SwapForm'
import { ToSectionCarbonOffset } from './../SwapForm/SwapFormToSections/ToSectionCarbonOffset'
import ConnectButton from './../web3/ConnectButton'

const TOKEN_POLYGON_USDC = findDefaultToken(CoinKey.USDC, ChainId.POL)
const history = createBrowserHistory()
let currentRouteCallId: string

interface TokenWithAmounts extends Token {
  amount?: BigNumber
  amountRendered?: string
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

interface TokenAmountList {
  [ChainKey: string]: Array<TokenWithAmounts>
}

const Swap = () => {
  const chainsTokensTools = useChainsTokensTools()
  const beneficiaryInfo = useBeneficiaryInfo()

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
  const [toTokenAddress] = useState<string | undefined>(TOKEN_POLYGON_USDC.address)
  const [tokens, setTokens] = useState<TokenAmountList>({})
  const [refreshTokens, setRefreshTokens] = useState<boolean>(false)
  const [balances, setBalances] = useState<{ [ChainKey: string]: Array<TokenAmount> }>()
  const [refreshBalances, setRefreshBalances] = useState<boolean>(true)
  const [routeCallResult, setRouteCallResult] = useState<{ result: RouteType; id: string }>()

  // Options
  const [optionSlippage, setOptionSlippage] = useState<number>(3)
  const [optionInfiniteApproval, setOptionInfiniteApproval] = useState<boolean>(false)
  const [optionEnabledBridges, setOptionEnabledBridges] = useState<string[] | undefined>()
  const [availableBridges, setAvailableBridges] = useState<string[]>([])
  const [optionEnabledExchanges, setOptionEnabledExchanges] = useState<string[] | undefined>()
  const [availableExchanges, setAvailableExchanges] = useState<string[]>([])

  // Routes
  const [route, setRoute] = useState<RouteType | undefined>(undefined)
  const [routesLoading, setRoutesLoading] = useState<boolean>(false)
  const [noRoutesAvailable, setNoRoutesAvailable] = useState<boolean>(false)
  const [selectedRoute, setSelectedRoute] = useState<RouteType>()
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
  const [, setActiveRoutes] = useState<Array<RouteType>>(readActiveRoutes())
  const [, setHistoricalRoutes] = useState<Array<RouteType>>(readHistoricalRoutes())

  // Misc
  const [balancePollingStarted, setBalancePollingStarted] = useState<boolean>(false)
  const [startParamsDefined, setStartParamsDefined] = useState<boolean>(false)
  const [tokenPolygonBCT, setTokenPolygonBCT] = useState<Token>()

  // Wallet
  const { account } = useWallet()

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
    setTokens(chainsTokensTools.tokens)
    const loadAdditionalToken = async () => {
      const tokenBCT = await LiFi.getToken(ChainId.POL, TOUCAN_BCT_ADDRESS)!
      setTokenPolygonBCT(tokenBCT)
    }
    loadAdditionalToken()
  }, [chainsTokensTools.tokens])

  //get tools
  useEffect(() => {
    setAvailableExchanges(chainsTokensTools.bridges)
    setOptionEnabledExchanges(chainsTokensTools.exchanges)
    setAvailableBridges(chainsTokensTools.bridges)
    setOptionEnabledBridges(chainsTokensTools.bridges)
  }, [chainsTokensTools.bridges, chainsTokensTools.exchanges])

  useEffect(() => {
    if (
      chainsTokensTools.chainsLoaded &&
      chainsTokensTools.tokensLoaded &&
      chainsTokensTools.toolsLoaded
    ) {
      setRefreshBalances(true)
    }
  }, [])

  // autoselect from chain based on wallet
  useEffect(() => {
    LiFi.getChains().then((chains: Chain[]) => {
      const walletChainIsSupported = chains.some((chain) => chain.id === account.chainId)
      if (!walletChainIsSupported) return
      if (account.chainId && !fromChainKey) {
        const chain = availableChains.find((chain) => chain.id === account.chainId)
        if (chain) {
          setFromChainKey(chain.key)
        }
      }
    })
  }, [account.chainId, fromChainKey, availableChains])

  useEffect(() => {
    if (
      !!chainsTokensTools.chains.length &&
      !!(Object.keys(chainsTokensTools.tokens).length === 0) &&
      !!chainsTokensTools.exchanges.length &&
      !!chainsTokensTools.bridges.length
    ) {
      const startParams = getDefaultParams(history.location.search, availableChains, tokens)
      setFromChainKey(startParams.depositChain)
      setDepositAmount(startParams.depositAmount)
      setFromTokenAddress(startParams.depositToken)
      setToChainKey(startParams.withdrawChain)
      setStartParamsDefined(true)
    }
  }, [chainsTokensTools])

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
        pathname: '/embed/carbon-offset',
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
      setRoute(undefined)
      setHighlightedIndex(-1)
      setNoRoutesAvailable(false)

      if (
        depositAmount.gt(0) &&
        depositAmount &&
        fromChainKey &&
        fromTokenAddress &&
        toChainKey &&
        toTokenAddress &&
        tokenPolygonBCT &&
        account.address
      ) {
        setRoutesLoading(true)
        const fromToken = findToken(fromChainKey, fromTokenAddress)
        const toToken = findToken(toChainKey, toTokenAddress)

        const polygonProvider = await LiFi.getRpcProvider(ChainId.POL)

        const sourceAmount = await getCarbonOffsetSourceAmount(polygonProvider, {
          inputToken: TOKEN_POLYGON_USDC,
          retirementToken: tokenPolygonBCT,
          amountInCarbon: new BigNumber(depositAmount)
            .shiftedBy(tokenPolygonBCT.decimals)
            .toFixed(0),
        })

        const txOffset = await getOffsetCarbonTransaction({
          address: account.address,
          amountInCarbon: true,
          quantity: sourceAmount.inputToken,
          inputTokenAddress: toTokenAddress,
          retirementTokenAddress: TOUCAN_BCT_ADDRESS,
          beneficiaryAddress: beneficiaryInfo.beneficiaryAddress || account.address,
          beneficiaryName: beneficiaryInfo.beneficiaryName,
          retirementMessage: beneficiaryInfo.retirementMessage,
        })

        const request: ContractCallQuoteRequest = {
          //from
          fromChain: fromToken.chainId,
          fromToken: fromTokenAddress,
          fromAddress: account.address,
          //to
          toChain: toToken.chainId,
          toToken: toTokenAddress,
          toAmount: sourceAmount.inputToken,
          toContractAddress: txOffset.to!,
          toContractCallData: txOffset.data!,
          toContractGasLimit: '90000',
          //optional
          integrator: 'lifi-klima-carbon-offset',
          slippage: optionSlippage / 100,
          allowBridges: ['connext'],
        }
        const id = uuid()
        try {
          currentRouteCallId = id
          const result = await LiFi.getContractCallQuote(request)

          result.estimate.toAmount = new BigNumber(depositAmount)
            .shiftedBy(fromToken.decimals)
            .toFixed(0)
          result.estimate.toAmountMin = new BigNumber(depositAmount)
            .shiftedBy(fromToken.decimals)
            .toFixed(0)

          result.action.toToken = tokenPolygonBCT

          const route: RouteType = {
            id: result.id,
            fromChainId: result.action.fromChainId,
            fromAmountUSD: result.estimate.fromAmountUSD || '',
            fromAmount: result.action.fromAmount,
            fromToken: result.action.fromToken,
            fromAddress: result.action.fromAddress,
            toChainId: result.action.toChainId,
            toAmountUSD: result.estimate.toAmountUSD || '',
            toAmount: new BigNumber(depositAmount).shiftedBy(tokenPolygonBCT.decimals).toFixed(0),
            toAmountMin: new BigNumber(depositAmount)
              .shiftedBy(tokenPolygonBCT.decimals)
              .toFixed(0),
            toToken: tokenPolygonBCT,
            toAddress: result.action.toAddress,
            gasCostUSD: result.estimate.gasCosts?.[0].amountUSD,
            steps: [result],
          }

          setRouteCallResult({
            result: route,
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
    beneficiaryInfo.beneficiaryAddress,
    beneficiaryInfo.beneficiaryName,
    beneficiaryInfo.retirementMessage,
  ])

  // set route call results
  useEffect(() => {
    if (routeCallResult) {
      const { result, id } = routeCallResult

      if (id === currentRouteCallId) {
        setRoute(result)
        setHighlightedIndex(result ? 0 : -1)
        setNoRoutesAvailable(!result)
        setRoutesLoading(false)
      }
    }
  }, [routeCallResult, currentRouteCallId])

  const openModal = () => {
    // deepClone to open new modal without execution info of previous transfer using same route card
    setSelectedRoute(deepClone(route))
    setHighlightedIndex(-1)
    setNoRoutesAvailable(false)
  }

  const submitButton = () => {
    if (!account.isActive && isWalletDeactivated(account.address)) {
      return (
        <Button
          disabled={true}
          shape="round"
          type="primary"
          icon={<LoadingOutlined />}
          size={'large'}></Button>
      )
    }
    if (!account.address) {
      return <ConnectButton size="large" />
    }
    if (fromChainKey && account.chainId !== getChainByKey(fromChainKey).id) {
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
    if (!hasSufficientGasBalanceOnStartChain(route)) {
      return (
        <Button disabled={true} shape="round" type="primary" size={'large'}>
          Insufficient Gas on Start Chain
        </Button>
      )
    }
    if (!hasSufficientGasBalanceOnCrossChain(route)) {
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
        size={'large'}
        onClick={() => openModal()}>
        Retire Carbon
      </Button>
    )
  }

  return (
    <Content className="site-layout site-layout-swap-klima-embed">
      <div className="swap-view-klima-embed">
        {/* Swap Form */}
        <Col className="swap-form-klima-embed">
          <div className="swap-input-klima-embed">
            <Row>
              <Title
                className="swap-title"
                level={3}
                style={{ marginLeft: '0', fontWeight: 'bold', marginBottom: 16 }}>
                Carbon offsets via BCT
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
                fromSectionDesignator={'Use'}
                toSectionDesignator={'To retire'}
                alternativeFromSection={
                  <FromSectionCarbonOffset
                    depositChain={fromChainKey}
                    setDepositChain={setFromChainKey}
                    depositToken={fromTokenAddress}
                    setDepositToken={setFromTokenAddress}
                    depositAmount={depositAmount}
                    availableChains={availableChains}
                    tokens={tokens}
                    balances={balances}
                    setDepositAmount={setDepositAmount}
                  />
                }
                alternativeToSection={
                  <ToSectionCarbonOffset
                    className="to-section-carbon-offset-klima-embed"
                    route={route}
                    tokenPolygonBCT={tokenPolygonBCT}
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
          </div>
        </Col>
      </div>

      {selectedRoute && !!selectedRoute.steps.length && (
        <Modal
          className="modal-klima-embed swapModal"
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
          maskClosable={false}
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
