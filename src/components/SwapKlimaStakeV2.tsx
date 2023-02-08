import './SwapEtherspotKlimaZap.css'

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
import QueryString from 'qs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { v4 as uuid } from 'uuid'

import { LifiTeam } from '../assets/Li.Fi/LiFiTeam'
import { PoweredByLiFi } from '../assets/Li.Fi/poweredByLiFi'
import { Etherspot } from '../assets/misc/etherspot'
import { etherspotSupportedChains, KLIMA_ADDRESS, sKLIMA_ADDRESS } from '../constants'
import { useMetatags } from '../hooks/useMetatags'
import LiFi from '../LiFi'
import { useChainsTokensTools } from '../providers/chainsTokensToolsProvider'
import { useWallet } from '../providers/WalletProvider'
import { getStakeKlimaTransaction } from '../services/etherspotTxService'
import { switchChain } from '../services/metamask'
import { loadTokenListAsTokens } from '../services/tokenListService'
import { formatTokenAmountOnly, getBalance, isWalletDeactivated } from '../services/utils'
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
  TokenAmountList,
  TokenWithAmounts,
} from '../types'
import forest from './../assets/misc/forest.jpg'
import SwapForm from './SwapForm/SwapForm'
import { FromSectionKlimaStaking } from './SwapForm/SwapFormFromSections/FromSectionKlimaStaking'
import { ToSectionKlimaStakingV2 } from './SwapForm/SwapFormToSections/ToSectionKlimaStakingV2'
import Swapping from './Swapping'
import ConnectButton from './web3/ConnectButton'

const TOKEN_POLYGON_USDC = findDefaultToken(CoinKey.USDC, ChainId.POL)

const history = createBrowserHistory()
let currentRouteCallId: string

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
    title: 'LI.FI - Etherspot KLIMA',
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
  const [toTokenAddress] = useState<string | undefined>(TOKEN_POLYGON_USDC.address) // TODO: Change This
  const [tokens, setTokens] = useState<TokenAmountList>(chainsTokensTools.tokens)
  const [refreshTokens, setRefreshTokens] = useState<boolean>(false)
  const [balances, setBalances] = useState<{ [ChainKey: string]: Array<TokenAmount> }>()
  const [refreshBalances, setRefreshBalances] = useState<boolean>(true)
  const [routeCallResult, setRouteCallResult] = useState<{
    result: RouteType
    id: string
  }>()

  // Options
  const [optionSlippage, setOptionSlippage] = useState<number>(3)
  const [optionInfiniteApproval, setOptionInfiniteApproval] = useState<boolean>(false)
  const [optionEnabledBridges, setOptionEnabledBridges] = useState<string[] | undefined>(
    chainsTokensTools.bridges,
  )
  const [availableBridges, setAvailableBridges] = useState<string[]>(chainsTokensTools.bridges)
  const [optionEnabledExchanges, setOptionEnabledExchanges] = useState<string[] | undefined>(
    chainsTokensTools.exchanges,
  )
  const [availableExchanges, setAvailableExchanges] = useState<string[]>(
    chainsTokensTools.exchanges,
  )

  // Routes
  const [route, setRoute] = useState<RouteType>({} as any)
  const [routesLoading, setRoutesLoading] = useState<boolean>(false)
  const [noRoutesAvailable, setNoRoutesAvailable] = useState<boolean>(false)
  const [selectedRoute, setSelectedRoute] = useState<RouteType | undefined>()
  // Misc
  const [balancePollingStarted, setBalancePollingStarted] = useState<boolean>(false)
  const [startParamsDefined, setStartParamsDefined] = useState<boolean>(false)

  const [tokenPolygonKLIMA, setTokenPolygonKlima] = useState<Token>()
  const [tokenPolygonSKLIMA, setTokenPolygonSKLIMA] = useState<Token>()
  const tokensAndChainsSet = useMemo(
    () => availableChains.length !== 0 && Object.keys(tokens).length !== 0,
    [tokens, availableChains],
  )

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
    const limitedChains = chainsTokensTools.chains.filter((chain) => {
      return etherspotSupportedChains.includes(chain.id)
    })
    setAvailableChains(limitedChains)

    // load()
  }, [chainsTokensTools.chains])

  //get tokens
  useEffect(() => {
    setTokens(chainsTokensTools.tokens)
    const loadAdditionalToken = async () => {
      const klimaToken = await LiFi.getToken(ChainId.POL, KLIMA_ADDRESS)
      const sKlimaToken = await LiFi.getToken(ChainId.POL, sKLIMA_ADDRESS)!
      setTokenPolygonKlima(klimaToken)
      setTokenPolygonSKLIMA(sKlimaToken)
    }
    loadAdditionalToken()
  }, [chainsTokensTools.tokens])

  //get tools
  useEffect(() => {
    setAvailableExchanges(chainsTokensTools.exchanges)
    setOptionEnabledExchanges(chainsTokensTools.exchanges)

    const allowedBridges = ['connext', 'stargate']
    const filteredBridges = chainsTokensTools.bridges?.filter((bridge) =>
      allowedBridges.includes(bridge),
    )
    setAvailableBridges(filteredBridges)
    setOptionEnabledBridges(filteredBridges)
  }, [chainsTokensTools.bridges, chainsTokensTools.exchanges])

  useEffect(() => {
    if (tokensAndChainsSet) {
      setRefreshBalances(true)
    }
  }, [availableChains, tokens])

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
        pathname: '/showcase/klima-stake-v2',
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
    if (!route?.steps?.length) {
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
    if (!route?.steps?.length) {
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
        depositAmount &&
        fromChainKey &&
        fromTokenAddress &&
        account.address &&
        tokenPolygonKLIMA &&
        tokenPolygonSKLIMA
      ) {
        setRoutesLoading(true)
        const fromToken = findToken(fromChainKey, fromTokenAddress)

        const klimaStakeTx = await getStakeKlimaTransaction(
          new BigNumber(depositAmount).shiftedBy(tokenPolygonKLIMA.decimals).toFixed(0),
        )
        const request: ContractCallQuoteRequest = {
          //from
          fromChain: fromToken.chainId,
          fromToken: fromTokenAddress,
          fromAddress: account.address,
          //to
          toChain: tokenPolygonKLIMA.chainId,
          toToken: tokenPolygonKLIMA.address,
          toAmount: new BigNumber(depositAmount).shiftedBy(tokenPolygonKLIMA.decimals).toFixed(0),
          toContractAddress: klimaStakeTx.to!,
          toContractCallData: klimaStakeTx.data!,
          toContractGasLimit: '200000', //'90000',
          contractOutputsToken: sKLIMA_ADDRESS,
          //optional
          integrator: 'lifi-klima-xchain-staking',
          slippage: optionSlippage / 100,
        }

        const id = uuid()
        try {
          currentRouteCallId = id
          const result = await LiFi.getContractCallQuote(request)

          result.estimate.toAmount = new BigNumber(depositAmount)
            .shiftedBy(tokenPolygonSKLIMA.decimals)
            .toFixed(0)
          result.estimate.toAmountMin = new BigNumber(depositAmount)
            .shiftedBy(tokenPolygonSKLIMA.decimals)
            .toFixed(0)

          result.action.toToken = tokenPolygonSKLIMA

          const route: RouteType = {
            id: result.id,
            fromChainId: result.action.fromChainId,
            fromAmountUSD: result.estimate.fromAmountUSD || '',
            fromAmount: result.action.fromAmount,
            fromToken: result.action.fromToken,
            fromAddress: result.action.fromAddress,
            toChainId: result.action.toChainId,
            toAmountUSD: result.estimate.toAmountUSD || '',
            toAmount: new BigNumber(depositAmount)
              .shiftedBy(tokenPolygonSKLIMA.decimals)
              .toFixed(0),
            toAmountMin: new BigNumber(depositAmount)
              .shiftedBy(tokenPolygonSKLIMA.decimals)
              .toFixed(0),
            toToken: tokenPolygonSKLIMA,
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
  ])

  // set route call results
  useEffect(() => {
    if (routeCallResult) {
      const { result, id } = routeCallResult

      if (id === currentRouteCallId) {
        setRoute(result)
        setNoRoutesAvailable(!route)
        setRoutesLoading(false)
      }
    }
  }, [routeCallResult, currentRouteCallId])

  const openModal = () => {
    // structuredClone to open new modal without execution info of previous transfer using same route card
    setSelectedRoute(structuredClone(route))
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
        <Tooltip title="The selected route requires a swap on the chain you are transferring to. You need to have gas on that chain to pay for the transaction there.">
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

    const disableStakeButton = !route || !(depositAmount.toNumber() > 0)

    return (
      <Button
        disabled={disableStakeButton}
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
                  // fixedWithdraw={true}
                  alternativeFromSection={
                    <FromSectionKlimaStaking
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
                    <ToSectionKlimaStakingV2
                      route={route}
                      fromToken={route.fromToken}
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
              LI.FI now supports xChain Contract Calls into the Klima staking contract with only one
              transaction confirmation.
            </Title>
            <br />

            <Divider style={{ borderColor: 'black' }} />
            <Paragraph style={{ marginTop: 64 }}>
              <h2>What is happening here?</h2>
              We are combining the power of asset bridging with cross-chain message passing to
              perform xChain Contract Call staking with one transaction confirmation. We are
              abstracting steps needed to perform such actions - from{' '}
              <b>9 steps on 3 different dApps</b>, to just a <b>single step</b> on LI.FI's
              interface.
            </Paragraph>
            <Paragraph style={{ marginTop: 64 }}>
              <h2>What is happening in the background?</h2>
              When a cross-chain swap is completed via LI.FI, we combine swap + bridge + destination
              contract call (xChain Contract Call) within our smart contract:
              <ol>
                <li>Swaps USDC to KLIMA. </li>
                <li>Send xChain Contract Call to staking contract. </li>
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
          <Swapping
            route={selectedRoute}
            settings={{ infiniteApproval: optionInfiniteApproval }}
            updateRoute={() => {}}
            fixedRecipient={true}
            onSwapDone={() => {
              updateBalances()
            }}></Swapping>
        </Modal>
      )}
    </Content>
  )
}

export default Swap
