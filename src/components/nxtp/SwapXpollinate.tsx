/* eslint-disable no-console,max-params */
import '../Swap.css'
import './SwapXpollinate.css'

import {
  CheckOutlined,
  CompassOutlined,
  EllipsisOutlined,
  ExportOutlined,
  HistoryOutlined,
  InfoCircleOutlined,
  LinkOutlined,
  LoadingOutlined,
  LoginOutlined,
  MenuOutlined,
  SwapOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import {
  GetTransferQuote,
  NxtpSdk,
  NxtpSdkEvent,
  NxtpSdkEvents,
  SubgraphSyncRecord,
} from '@connext/nxtp-sdk'
import { TransactionPreparedEvent } from '@connext/nxtp-utils'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import {
  Alert,
  Badge,
  Button,
  Checkbox,
  Col,
  Collapse,
  Form,
  Input,
  Menu,
  Modal,
  Row,
  Spin,
  Tooltip,
} from 'antd'
import { Content } from 'antd/lib/layout/layout'
import Title from 'antd/lib/typography/Title'
import BigNumber from 'bignumber.js'
import { providers } from 'ethers'
import { createBrowserHistory } from 'history'
import QueryString from 'qs'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'

import onehiveWordmark from '../../assets/1hive_wordmark_dark.svg'
import connextWordmark from '../../assets/connext_wordmark_dark.png'
import lifiWordmark from '../../assets/lifi_wordmark.svg'
import xpollinateWordmark from '../../assets/xpollinate_wordmark_dark.svg'
import { getBalancesForWalletFromChain } from '../../services/balanceService'
import { clearLocalStorage, readHideAbout, storeHideAbout } from '../../services/localStorage'
import { switchChain } from '../../services/metamask'
import { finishTransfer, getTransferQuote, setup, triggerTransfer } from '../../services/nxtp'
import { deepClone, formatTokenAmountOnly } from '../../services/utils'
import {
  Action,
  Chain,
  ChainKey,
  ChainPortfolio,
  CrossStep,
  Estimate,
  Execution,
  findDefaultCoinOnChain,
  getChainById,
  getChainByKey,
  Route,
  Step,
  Token,
  TokenWithAmounts,
} from '../../types'
import { getRpcProviders, injected } from '../web3/connectors'
import SwapFormNxtp from './SwapFormNxtp'
import SwappingNxtp from './SwappingNxtp'
import TestBalanceOverview from './TestBalanceOverview'
import TransactionsTableNxtp from './TransactionsTableNxtp'
import { ActiveTransaction, CrosschainTransaction } from './typesNxtp'

const history = createBrowserHistory()

const BALANCES_REFRESH_INTERVAL = 30000
const DEBOUNCE_TIMEOUT = 800
const MAINNET_LINK = 'https://xpollinate.io'
const TESTNET_LINK = 'https://testnet.xpollinate.io'
const DISABLED = false
const FEE_INFO: { [K in keyof Fees]: string } = {
  gas: 'Covers gas expense for sending funds to user on receiving chain.',
  relayer: 'Covers gas expense for claiming user funds on receiving chain.',
  router: 'Router service fee.',
}

type Fees = {
  gas: BigNumber
  relayer: BigNumber
  router: BigNumber
}

const getDefaultParams = (
  search: string,
  transferChains: Chain[],
  transferTokens: { [ChainKey: string]: Array<Token> },
) => {
  const defaultParams = {
    depositChain: transferChains[0].key,
    depositToken: transferTokens[transferChains[0].key][0].id,
    depositAmount: new BigNumber(-1),
    withdrawChain: transferChains[1].key,
    withdrawToken: transferTokens[transferChains[1].key][0].id,
  }

  const params = QueryString.parse(search, { ignoreQueryPrefix: true })

  // fromChain + old: senderChainId
  if (
    (params.fromChain && typeof params.fromChain === 'string') ||
    (params.senderChainId && typeof params.senderChainId === 'string')
  ) {
    try {
      const newFromChainId = parseInt(
        typeof params.fromChain === 'string' ? params.fromChain : (params.senderChainId as string),
      )
      const newFromChain = transferChains.find((chain) => chain.id === newFromChainId)

      if (newFromChain) {
        if (newFromChain.key === defaultParams.withdrawChain) {
          // switch with withdraw chain
          defaultParams.withdrawChain = defaultParams.depositChain
          defaultParams.withdrawToken = defaultParams.depositToken
        }

        const foundTokenSymbol = transferTokens[defaultParams.depositChain].find(
          (token) => token.id === defaultParams.depositToken,
        )!.symbol
        defaultParams.depositChain = newFromChain.key
        defaultParams.depositToken = transferTokens[newFromChain.key].find(
          (token) => token.symbol === foundTokenSymbol,
        )!.id
      }
    } catch (e) {
      console.error(e)
    }
  }

  // fromToken
  if (params.fromToken && typeof params.fromToken === 'string') {
    // does token exist?
    const foundToken = transferTokens[defaultParams.depositChain].find(
      (token) => token.id === params.fromToken,
    )
    if (foundToken) {
      defaultParams.depositToken = foundToken.id
      defaultParams.withdrawToken = transferTokens[defaultParams.withdrawChain].find(
        (token) => token.symbol === foundToken.symbol,
      )!.id
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
      console.error(e)
    }
  }

  // toChain + old: receiverChainId
  if (
    (params.toChain && typeof params.toChain === 'string') ||
    (params.receiverChainId && typeof params.receiverChainId === 'string')
  ) {
    try {
      const newToChainId = parseInt(
        typeof params.toChain === 'string' ? params.toChain : (params.receiverChainId as string),
      )
      const newToChain = transferChains.find((chain) => chain.id === newToChainId)

      if (newToChain && newToChain.key !== defaultParams.depositChain) {
        // only set if different chain
        const foundTokenSymbol = transferTokens[defaultParams.depositChain].find(
          (token) => token.id === defaultParams.depositToken,
        )!.symbol
        defaultParams.withdrawChain = newToChain.key
        defaultParams.withdrawToken = transferTokens[newToChain.key].find(
          (token) => token.symbol === foundTokenSymbol,
        )!.id
      }
    } catch (e) {
      console.error(e)
    }
  }

  // toToken
  if (params.toToken && typeof params.toToken === 'string') {
    // does token exist?
    const foundToken = transferTokens[defaultParams.withdrawChain].find(
      (token) => token.id === params.toToken,
    )
    if (foundToken) {
      defaultParams.withdrawToken = foundToken.id
      defaultParams.depositToken = transferTokens[defaultParams.depositChain].find(
        (token) => token.symbol === foundToken.symbol,
      )!.id
    }
  }

  // old: assset
  if (params.asset && typeof params.asset === 'string') {
    const foundToken = transferTokens[defaultParams.depositChain].find(
      (token) => token.symbol === params.asset,
    )
    if (foundToken) {
      defaultParams.depositToken = foundToken.id
      defaultParams.withdrawToken = transferTokens[defaultParams.withdrawChain].find(
        (token) => token.symbol === foundToken.symbol,
      )!.id
    }
  }

  return defaultParams
}

function debounce(func: Function, timeout: number = 300) {
  let timer: NodeJS.Timeout
  return (...args: any) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, timeout)
  }
}

let chainProviders: Record<number, providers.FallbackProvider>

let startParams: {
  depositChain: ChainKey
  depositToken: string
  depositAmount: BigNumber
  withdrawChain: ChainKey
  withdrawToken: string
}

interface SwapXpollinateProps {
  aboutMessage?: React.ReactNode
  aboutDescription?: React.ReactNode
  transferChains: Chain[]
  transferTokens: { [ChainKey: string]: Array<Token> }
  testnet?: boolean
}

const SwapXpollinate = ({
  aboutMessage,
  aboutDescription,
  transferChains,
  transferTokens,
  testnet,
}: SwapXpollinateProps) => {
  // INIT
  startParams =
    startParams ?? getDefaultParams(history.location.search, transferChains, transferTokens)
  chainProviders = chainProviders ?? getRpcProviders(transferChains.map((chain) => chain.id))

  const [stateUpdate, setStateUpdate] = useState<number>(0)
  const [showAbout, setShowAbout] = useState<boolean>(!readHideAbout())

  // Form
  const [depositChain, setDepositChain] = useState<ChainKey>(startParams.depositChain)
  const [depositAmount, setDepositAmount] = useState<BigNumber>(startParams.depositAmount)
  const [depositToken, setDepositToken] = useState<string>(startParams.depositToken)
  const [withdrawChain, setWithdrawChain] = useState<ChainKey>(startParams.withdrawChain)
  const [withdrawAmount, setWithdrawAmount] = useState<BigNumber>(new BigNumber(Infinity))
  const [withdrawToken, setWithdrawToken] = useState<string>(startParams.withdrawToken)
  const [tokens, setTokens] =
    useState<{ [ChainKey: string]: Array<TokenWithAmounts> }>(transferTokens)
  const [refreshBalances, setRefreshBalances] = useState<number>(1)
  const [balances, setBalances] = useState<{ [ChainKey: string]: Array<ChainPortfolio> }>()
  const [updatingBalances, setUpdatingBalances] = useState<boolean>(false)

  // Advanced Options
  const [optionInfiniteApproval, setOptionInfiniteApproval] = useState<boolean>(true)
  const [optionReceivingAddress, setOptionReceivingAddress] = useState<string>('')
  const [optionContractAddress, setOptionContractAddress] = useState<string>('')
  const [optionCallData, setOptionCallData] = useState<string>('')
  const [optionPreferredRouter, setOptionPreferredRouter] = useState<string>('')

  // Routes
  const [routeUpdate, setRouteUpdate] = useState<number>(1)
  const [routeRequest, setRouteRequest] = useState<any>()
  const [routeQuote, setRouteQuote] = useState<GetTransferQuote>()
  const [routeQuoteFees, setRouteQuoteFees] = useState<Fees>({
    gas: new BigNumber(0),
    relayer: new BigNumber(0),
    router: new BigNumber(0),
  })
  const [routesLoading, setRoutesLoading] = useState<boolean>(false)
  const [noRoutesAvailable, setNoRoutesAvailable] = useState<boolean>(false)
  const [routes, setRoutes] = useState<Route[]>([])
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
  const [executionRoutes, setExecutionRoutes] = useState<Route[]>([])
  const [modalRouteIndex, setModalRouteIndex] = useState<number>()

  // nxtp
  const [sdk, setSdk] = useState<NxtpSdk>()
  const [sdkChainId, setSdkChainId] = useState<number>()
  const [sdkAccount, setSdkAccount] = useState<string>()
  const [syncStatus, setSyncStatus] = useState<Record<number, SubgraphSyncRecord>>()
  const [activeTransactions, setActiveTransactions] = useState<Array<ActiveTransaction>>([])
  const [updatingActiveTransactions, setUpdatingActiveTransactions] = useState<boolean>(false)
  const [activeKeyTransactions, setActiveKeyTransactions] = useState<string>('')

  // Wallet
  const web3 = useWeb3React<Web3Provider>()
  const { activate, deactivate } = useWeb3React()
  const intervalRef = useRef<NodeJS.Timeout>()

  // Alerts
  const [alert, setAlert] = useState<string>()

  // update query string
  useEffect(() => {
    // TODO: Could use local estimate to determine what the minimum we could possibly send would
    // likely be here.
    if (depositAmount.lte(0)) {
      return
    }
    const params = {
      fromChain: getChainByKey(depositChain).id,
      fromToken: depositToken,
      toChain: getChainByKey(withdrawChain).id,
      toToken: withdrawToken,
      fromAmount: depositAmount.gt(0) ? depositAmount.toString() : undefined,
    }
    const search = QueryString.stringify(params)
    history.push({
      search,
    })
  }, [depositChain, withdrawChain, depositToken, withdrawToken, depositAmount])

  // hide about
  useEffect(() => {
    storeHideAbout(!showAbout)
  }, [showAbout])

  // alert error if subgraph(s) out of sync.
  useEffect(() => {
    if (!syncStatus) return
    const sendingChain = getChainByKey(depositChain)
    const sendingSyncStatus = syncStatus[sendingChain.id]
    const receivingChain = getChainByKey(withdrawChain)
    const receivingSyncStatus = syncStatus[receivingChain.id]
    if (!sendingSyncStatus.synced) {
      setAlert(`${sendingChain.name} subgraph is out of sync. Please try again later.`)
    } else if (!receivingSyncStatus.synced) {
      setAlert(`${receivingChain.name} subgraph is out of sync. Please try again later.`)
    } else {
      setAlert(undefined)
    }
  }, [syncStatus])

  // auto-trigger finish if corresponding modal is opend
  // useEffect(() => {
  //   // is modal open?
  //   if (modalRouteIndex !== undefined) {
  //     const Estimate = executionRoutes[modalRouteIndex][0].estimate! as Estimate
  //     const transaction = activeTransactions.find((item) => item.txData.invariant.transactionId === Estimate.quote.bid.transactionId)
  //     if (transaction && transaction.status === NxtpSdkEvents.ReceiverTransactionPrepared) {
  //       const route = executionRoutes[modalRouteIndex]
  //       const update = (step: TranferStep, status: Execution) => {
  //         step.execution = status
  //         updateExecutionRoute(route)
  //       }
  //       finishTransfer(sdk!, transaction.event, route[0], update)
  //     }
  //   }
  // }, [modalRouteIndex, executionRoutes, sdk, activeTransactions])

  const updateSyncStatus = useCallback(
    (sdk: NxtpSdk) => {
      const newSyncStatus: { [ChainKey: number]: SubgraphSyncRecord } = {}
      transferChains.forEach((chain) => {
        newSyncStatus[chain.id] = sdk.getSubgraphSyncStatus(chain.id)
      })
      setSyncStatus(newSyncStatus)
    },
    [transferChains],
  )

  // update table helpers
  const updateActiveTransactionsWith = (
    transactionId: string,
    status: NxtpSdkEvent,
    event: any,
    txData?: CrosschainTransaction,
  ) => {
    setActiveTransactions((activeTransactions) => {
      // update existing?
      let updated = false
      const updatedTransactions = activeTransactions.map((item) => {
        if (item.txData.invariant.transactionId === transactionId) {
          if (txData) {
            item.txData = Object.assign({}, item.txData, txData)
          }
          item.status = status
          item.event = event
          updated = true
        }
        return item
      })

      if (updated) {
        return updatedTransactions
      } else {
        return [...activeTransactions, { txData: txData!, status, event }]
      }
    })
  }

  const removeActiveTransaction = (transactionId: string) => {
    setActiveTransactions((activeTransactions) => {
      return activeTransactions.filter((t) => t.txData.invariant.transactionId !== transactionId)
    })
  }

  useEffect(() => {
    const initializeConnext = async () => {
      if (sdk && sdkChainId === web3.chainId && sdkAccount === web3.account) {
        return sdk
      }
      if (!web3.library || !web3.account) {
        throw Error('Connect Wallet first.')
      }

      const signer = web3.library.getSigner()
      setSdkChainId(web3.chainId)
      setSdkAccount(web3.account)

      if (sdk) {
        sdk.removeAllListeners()
      }

      const _sdk = await setup(signer, chainProviders)
      setSdk(_sdk)

      // listen to events
      _sdk.attach(NxtpSdkEvents.SenderTransactionPrepared, (data) => {
        updateActiveTransactionsWith(
          data.txData.transactionId,
          NxtpSdkEvents.SenderTransactionPrepared,
          data,
          { invariant: data.txData, sending: data.txData },
        )
        setRefreshBalances((state) => state + 1)
      })

      _sdk.attach(NxtpSdkEvents.SenderTransactionFulfilled, async (data) => {
        updateActiveTransactionsWith(
          data.txData.transactionId,
          NxtpSdkEvents.SenderTransactionFulfilled,
          data,
          { invariant: data.txData, sending: data.txData },
        )
        removeActiveTransaction(data.txData.transactionId)
        setRefreshBalances((state) => state + 1)
      })

      _sdk.attach(NxtpSdkEvents.SenderTransactionCancelled, async (data) => {
        updateActiveTransactionsWith(
          data.txData.transactionId,
          NxtpSdkEvents.SenderTransactionCancelled,
          data,
          { invariant: data.txData, sending: data.txData },
        )
        removeActiveTransaction(data.txData.transactionId)
      })

      _sdk.attach(NxtpSdkEvents.ReceiverPrepareSigned, (data) => {
        updateActiveTransactionsWith(data.transactionId, NxtpSdkEvents.ReceiverPrepareSigned, data)
        setActiveKeyTransactions('active')
      })

      _sdk.attach(NxtpSdkEvents.ReceiverTransactionPrepared, (data) => {
        updateActiveTransactionsWith(
          data.txData.transactionId,
          NxtpSdkEvents.ReceiverTransactionPrepared,
          data,
          { invariant: data.txData, receiving: data.txData },
        )
      })

      _sdk.attach(NxtpSdkEvents.ReceiverTransactionFulfilled, async (data) => {
        updateActiveTransactionsWith(
          data.txData.transactionId,
          NxtpSdkEvents.ReceiverTransactionFulfilled,
          data,
          { invariant: data.txData, receiving: data.txData },
        )
        removeActiveTransaction(data.txData.transactionId)
        setRefreshBalances((state) => state + 1)
      })

      _sdk.attach(NxtpSdkEvents.ReceiverTransactionCancelled, async (data) => {
        updateActiveTransactionsWith(
          data.txData.transactionId,
          NxtpSdkEvents.ReceiverTransactionCancelled,
          data,
          { invariant: data.txData, receiving: data.txData },
        )
        removeActiveTransaction(data.txData.transactionId)
      })

      // get pending transactions
      setUpdatingActiveTransactions(true)
      const transactions = await _sdk.getActiveTransactions()
      for (const transaction of transactions) {
        // merge to txData to be able to pass event to fulfillTransfer
        ;(transaction as any).txData = {
          ...transaction.crosschainTx.invariant,
          ...(transaction.crosschainTx.receiving ?? transaction.crosschainTx.sending),
        }
        updateActiveTransactionsWith(
          transaction.crosschainTx.invariant.transactionId,
          transaction.status as NxtpSdkEvent,
          transaction,
          transaction.crosschainTx,
        )
      }
      if (transactions.length) {
        setActiveKeyTransactions('active')
      }
      setUpdatingActiveTransactions(false)

      updateSyncStatus(_sdk)

      return _sdk
    }

    // init only once
    if (web3.library && web3.account && ((!sdk && !sdkChainId) || (sdk && sdkChainId))) {
      initializeConnext()
    }

    // deactivate
    if (!web3.account) {
      setHighlightedIndex(-1)
      setActiveTransactions([])
      setExecutionRoutes([])
      setSdkChainId(undefined)
      if (sdk) {
        sdk.removeAllListeners()
        sdk.detach()
        setSdk(undefined)
      }
    }
  }, [web3, sdk, sdkChainId, sdkAccount, updateSyncStatus, transferChains])

  const getSelectedWithdraw = () => {
    if (highlightedIndex === -1) {
      return '...'
    } else {
      const selectedRoute = routes[highlightedIndex]
      const lastStep = selectedRoute.steps[selectedRoute.steps.length - 1]
      if (lastStep.type === 'cross') {
        return formatTokenAmountOnly(lastStep.action.toToken, lastStep.estimate?.toAmount)
      } else {
        return '...'
      }
    }
  }

  const updateBalances = useCallback(
    async (address: string) => {
      setUpdatingBalances(true)

      // add gas token
      const token = deepClone(transferTokens)
      Object.entries(token).forEach(async ([chainKey, tokens]) => {
        const chain = getChainByKey(chainKey as ChainKey)
        const gasToken = findDefaultCoinOnChain(chain.coin, chain.key)
        token[chainKey].unshift(gasToken)
      })

      await getBalancesForWalletFromChain(address, token).then(setBalances)
      setUpdatingBalances(false)
    },
    [transferTokens],
  )

  useEffect(() => {
    if (refreshBalances && web3.account) {
      setRefreshBalances((state) => 0)
      updateBalances(web3.account)
    }
  }, [refreshBalances, web3.account, updateBalances])

  useEffect(() => {
    if (!web3.account) {
      setBalances(undefined) // reset old balances
    } else {
      setRefreshBalances((state) => state + 1)
    }
  }, [web3.account])

  const getBalance = (chainKey: ChainKey, tokenId: string) => {
    if (!balances) {
      return new BigNumber(0)
    }

    const tokenBalance = balances[chainKey].find((portfolio) => portfolio.id === tokenId)

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
          token.amount = getBalance(chain.key, token.id)
          token.amountRendered = token.amount.gte(0.0001)
            ? token.amount.toFixed(4)
            : token.amount.toFixed()
        }
      }
    }

    setTokens(tokens)
    setStateUpdate(stateUpdate + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens, balances])

  useEffect(() => {
    intervalRef.current = setInterval(
      () => setRefreshBalances((state) => state + 1),
      BALANCES_REFRESH_INTERVAL,
    )

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const hasSufficientBalance = () => {
    if (!depositToken) {
      return true
    }
    return depositAmount.lte(getBalance(depositChain, depositToken))
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

  const doRequestAndBidMatch = (request: any, quote: GetTransferQuote) => {
    if (
      getChainByKey(request.depositChain).id !== quote.bid.sendingChainId ||
      request.depositToken !== quote.bid.sendingAssetId ||
      getChainByKey(request.withdrawChain).id !== quote.bid.receivingChainId ||
      request.withdrawToken !== quote.bid.receivingAssetId ||
      request.depositAmount !== quote.bid.amount ||
      request.receivingAddress !== quote.bid.receivingAddress ||
      // NOTE: If user executes with a preferred router and gets a quote, but then removes the preferred router,
      // the request and quote here will still be considered a match (i.e. we won't get another quote).
      // TODO: Is this desirable behavior?
      (request.preferredRouters && !request.preferredRouters.includes(quote.bid.router))
      // || request.callTo !== quote.bid.callTo
      // || request.callData !== quote.bid.callDataHash
    ) {
      return false
    }

    return true
  }

  // update request based on UI
  const defineRoute = (
    depositChain: ChainKey,
    depositToken: string,
    withdrawChain: ChainKey,
    withdrawToken: string,
    depositAmount: string,
    receivingAddress: string,
    callTo: string | undefined,
    callData: string | undefined,
    preferredRouters: string[] | undefined,
  ) => {
    setRouteRequest({
      depositChain,
      depositToken,
      withdrawChain,
      withdrawToken,
      depositAmount,
      receivingAddress,
      callTo,
      callData,
      preferredRouters,
    })
  }
  const debouncedSave = useRef(debounce(defineRoute, DEBOUNCE_TIMEOUT)).current
  const getTransferRoutes = useCallback(async () => {
    setRoutes([])
    setHighlightedIndex(-1)
    setNoRoutesAvailable(false)

    if (!sdk || !web3.account || !routeUpdate) {
      return
    }

    const preferredRouterPattern = /^0x[a-fA-F0-9]{40}$/
    const preferredRouters =
      optionPreferredRouter && preferredRouterPattern.exec(optionPreferredRouter)
        ? [optionPreferredRouter]
        : undefined
    if (depositAmount.gt(0) && depositChain && depositToken && withdrawChain && withdrawToken) {
      const receiving = optionReceivingAddress !== '' ? optionReceivingAddress : web3.account
      const callTo = optionContractAddress !== '' ? optionContractAddress : undefined
      const callData = optionCallData !== '' ? optionCallData : undefined
      const dToken = findToken(depositChain, depositToken)
      const dAmount = new BigNumber(depositAmount).shiftedBy(dToken.decimals)
      debouncedSave(
        depositChain,
        depositToken,
        withdrawChain,
        withdrawToken,
        dAmount.toFixed(0),
        receiving,
        callTo,
        callData,
        preferredRouters,
      )
    }
  }, [
    depositAmount,
    depositChain,
    depositToken,
    withdrawChain,
    withdrawToken,
    web3,
    sdk,
    optionPreferredRouter,
    optionReceivingAddress,
    optionContractAddress,
    optionCallData,
    debouncedSave,
    findToken,
    routeUpdate,
  ])
  useEffect(() => {
    getTransferRoutes()
  }, [getTransferRoutes])

  // route generation if needed
  const generateRoutes = useCallback(
    async (
      sdk: NxtpSdk,
      depositChain: ChainKey,
      depositToken: string,
      withdrawChain: ChainKey,
      withdrawToken: string,
      depositAmount: string,
      receivingAddress: string,
      callTo: string | undefined,
      callData: string | undefined,
      preferredRouters: string[] = [],
    ) => {
      setRoutesLoading(true)

      try {
        const quote = await getTransferQuote(
          sdk!,
          getChainByKey(depositChain).id,
          depositToken,
          getChainByKey(withdrawChain).id,
          withdrawToken,
          depositAmount,
          receivingAddress,
          callTo,
          callData,
          undefined,
          preferredRouters,
        )

        if (!quote) {
          throw new Error('Empty Quote')
        }

        setRouteQuote(quote)
      } catch (e) {
        console.error(e)
        setNoRoutesAvailable(true)
        setRoutesLoading(false)
        updateSyncStatus(sdk)
      }
    },
    [updateSyncStatus],
  )
  useEffect(() => {
    if (routeRequest && routeQuote && doRequestAndBidMatch(routeRequest, routeQuote)) {
      return // already calculated
    }

    if (sdk && routeRequest) {
      generateRoutes(
        sdk,
        routeRequest.depositChain,
        routeRequest.depositToken,
        routeRequest.withdrawChain,
        routeRequest.withdrawToken,
        routeRequest.depositAmount,
        routeRequest.receivingAddress,
        routeRequest.callTo,
        routeRequest.callData,
        routeRequest.preferredRouters,
      )
    }
  }, [sdk, routeRequest, routeQuote, generateRoutes])

  // parse routeQuote if still it matches current request
  useEffect(() => {
    if (!routeRequest || !routeQuote || !doRequestAndBidMatch(routeRequest, routeQuote)) {
      return
    }
    const id = uuid()
    const dAmount = routeRequest.depositAmount
    const fToken = findToken(routeRequest.depositChain, routeRequest.depositToken)
    const tToken = findToken(routeRequest.withdrawChain, routeRequest.withdrawToken)

    // Calculate fees.
    const fromAmount = new BigNumber(dAmount).shiftedBy(-fToken.decimals)
    const toAmount = new BigNumber(routeQuote.bid.amountReceived).shiftedBy(-tToken.decimals)

    const gasFee = new BigNumber(routeQuote.gasFeeInReceivingToken).shiftedBy(-tToken.decimals)
    const relayerFee = new BigNumber(routeQuote.metaTxRelayerFee ?? '0').shiftedBy(-tToken.decimals)
    const routerFee = fromAmount.minus(toAmount).minus(gasFee)

    const actualAmountReceived = fromAmount
      .minus(gasFee)
      .minus(relayerFee)
      .minus(routerFee)
      .shiftedBy(tToken.decimals)
      .toString()

    const action: Action = {
      fromChainId: getChainByKey(routeRequest.depositChain).id,
      toChainId: getChainByKey(routeRequest.withdrawChain).id,
      fromToken: fToken,
      toToken: tToken,
      fromAmount: dAmount,
      toAddress: '',
      slippage: 0,
    }

    const estimate: Estimate = {
      fromAmount: routeQuote.bid.amount,
      toAmount: actualAmountReceived,
      toAmountMin: actualAmountReceived,
      approvalAddress: '',
      data: routeQuote,
    }

    const crossStep: CrossStep = {
      id,
      type: 'cross',
      tool: 'nxtp',
      action: action,
      estimate: estimate,
    }

    const route: Route = {
      id,
      fromChainId: getChainByKey(routeRequest.depositChain).id,
      fromAmountUSD: '',
      fromAmount: routeQuote.bid.amount,
      fromToken: fToken,
      // fromAddress?: string,
      toChainId: getChainByKey(routeRequest.withdrawChain).id,
      toAmountUSD: '',
      toAmount: actualAmountReceived,
      toAmountMin: actualAmountReceived,
      toToken: tToken,
      // toAddress?: string,
      // gasCostUSD?: string;
      // containsSwitchChain?: boolean,
      // containsEncryption?: boolean,
      // infiniteApproval?: boolean,
      steps: [crossStep],
    }

    // const sortedRoutes: Step[][] = [[crossStep]]
    const sortedRoutes: Route[] = [route]
    setRoutes(sortedRoutes)
    setRouteQuoteFees({
      gas: gasFee,
      relayer: relayerFee,
      router: routerFee,
    })
    setHighlightedIndex(sortedRoutes.length === 0 ? -1 : 0)
    setNoRoutesAvailable(sortedRoutes.length === 0)
    setRoutesLoading(false)
  }, [routeRequest, routeQuote, findToken])

  const updateExecutionRoute = (route: Route) => {
    setExecutionRoutes((routes: Route[]) => {
      let index = routes.findIndex((oldRoute) => {
        return oldRoute.steps[0].id === route.steps[0].id
      })
      const newRoutes = [...routes.slice(0, index), route, ...routes.slice(index + 1)]
      return newRoutes
    })
  }

  const openSwapModal = () => {
    if (!web3.library || !web3.account) return
    const signer = web3.library.getSigner()

    // add execution route
    const route = deepClone(routes[highlightedIndex]) as Route
    setExecutionRoutes((routes: Route[]) => [...routes, route])

    // get new route to avoid triggering the same quote twice
    setDepositAmount(new BigNumber(-1))
    setRouteRequest(undefined)
    setRouteQuote(undefined)

    // add as active
    const action = route.steps[0].action
    const estimate = route.steps[0].estimate
    const txData: CrosschainTransaction = {
      invariant: {
        user: '',
        router: '',
        initiator: '',
        sendingAssetId: action.fromToken.id,
        receivingAssetId: action.toToken.id,
        sendingChainFallback: '',
        callTo: '',
        receivingAddress: '',
        sendingChainId: action.fromChainId,
        receivingChainId: action.toChainId,
        callDataHash: '',
        transactionId: estimate.data.bid.transactionId,
        receivingChainTxManagerAddress: '',
      },
      sending: {
        amount: action.fromAmount,
        preparedBlockNumber: 0,
        expiry: Math.floor(Date.now() / 1000) + 3600 * 24 * 3, // 3 days
      },
    }
    updateActiveTransactionsWith(
      estimate.data.bid.transactionId,
      'Started' as NxtpSdkEvent,
      {} as TransactionPreparedEvent,
      txData,
    )
    setActiveKeyTransactions('active')

    // start execution
    const update = (step: Step, status: Execution) => {
      step.execution = status
      updateExecutionRoute(route)
    }
    triggerTransfer(
      signer,
      sdk!,
      route.steps[0],
      (status: Execution) => update(route.steps[0], status),
      optionInfiniteApproval,
    )

    // open modal
    setModalRouteIndex(executionRoutes.length)
  }

  const openSwapModalFinish = (action: ActiveTransaction) => {
    if (!web3.library || !web3.account) return
    const signer = web3.library.getSigner()

    // open modal
    const index = executionRoutes.findIndex((route) => {
      return route.id === action.txData.invariant.transactionId
    })

    if (index !== -1) {
      setModalRouteIndex(index)

      // trigger sdk
      const route = executionRoutes[index]
      const update = (step: Step, status: Execution) => {
        step.execution = status
        updateExecutionRoute(route)
      }
      finishTransfer(signer, sdk!, action.event, route.steps[0], update)
    } else {
      finishTransfer(signer, sdk!, action.event)
    }
  }

  const submitButton = () => {
    if (DISABLED) {
      return (
        <Button disabled={true} shape="round" type="primary" size={'large'}>
          Down for Maintenance
        </Button>
      )
    }
    if (!web3.account) {
      return (
        <Button
          shape="round"
          type="primary"
          icon={<LoginOutlined />}
          size={'large'}
          htmlType="submit"
          onClick={() => activate(injected)}>
          Connect Wallet
        </Button>
      )
    }
    if (web3.chainId !== getChainByKey(depositChain).id) {
      return (
        <Button
          shape="round"
          type="primary"
          size={'large'}
          htmlType="submit"
          onClick={() => switchChain(getChainByKey(depositChain).id)}>
          Change Chain
        </Button>
      )
    }
    if (depositAmount.lte(new BigNumber(0))) {
      return (
        <Button disabled={true} shape="round" type="primary" size={'large'}>
          Enter Amount
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
        <Button
          shape="round"
          type="primary"
          size={'large'}
          className="grayed"
          onClick={() => {
            setRouteUpdate(routeUpdate + 1)
          }}>
          No Route Found (Retry)
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
        htmlType="submit"
        size={'large'}
        onClick={() => openSwapModal()}>
        Swap
      </Button>
    )
  }

  const cancelTransfer = async (txData: CrosschainTransaction) => {
    try {
      await sdk?.cancel(
        {
          signature: '0x',
          txData: { ...txData.invariant, ...txData.sending! },
        },
        txData.invariant.sendingChainId,
      )
      removeActiveTransaction(txData.invariant.transactionId)
    } catch (e) {
      console.error('Failed to cancel', e)
    }
  }

  const handleMenuSelect = (e: any) => {
    if (e.key.startsWith('chain-')) {
      const key = e.key.split('-')[1]
      if (key === 'mainnet' || key === 'testnet') {
        // open link
      } else {
        switchChain(parseInt(key))
      }
    } else if (e.key === 'connect-wallet') {
      activate(injected)
    }
  }

  const getCurrentChain = () => {
    if (!web3.chainId) return undefined

    try {
      return getChainById(web3.chainId)
    } catch {
      return undefined
    }
  }
  const currentChain = getCurrentChain()
  const menuChain = (
    <Menu.SubMenu
      className="xpol-menu"
      key="chain"
      style={{}}
      title={
        <>
          <Badge
            color={
              syncStatus && currentChain && syncStatus[currentChain.id]
                ? syncStatus[currentChain.id].synced
                  ? 'green'
                  : 'orange'
                : 'gray'
            }
            text={currentChain?.name || 'Unsupported Chain'}
          />{' '}
        </>
      }>
      <Menu.ItemGroup title="Supported Chains">
        {transferChains.map((chain) => {
          return (
            <Menu.Item
              key={`chain-${chain.id}`}
              icon={<LoginOutlined />}
              disabled={web3.chainId === chain.id}>
              <Badge
                color={syncStatus ? (syncStatus[chain.id].synced ? 'green' : 'orange') : 'gray'}
                text={chain.name}
              />
            </Menu.Item>
          )
        })}
      </Menu.ItemGroup>
      <Menu.ItemGroup title="Other Chains">
        {testnet ? (
          <Menu.Item key="mainnet" icon={<ExportOutlined />}>
            <a href={MAINNET_LINK} target="_blank" rel="nofollow noreferrer">
              Visit Mainnet Version
            </a>
          </Menu.Item>
        ) : (
          <Menu.Item key="testnet" icon={<ExportOutlined />}>
            <a href={TESTNET_LINK} target="_blank" rel="nofollow noreferrer">
              Visit Testnet Version
            </a>
          </Menu.Item>
        )}
      </Menu.ItemGroup>
    </Menu.SubMenu>
  )

  const menuAccount = web3.account && (
    <Menu.SubMenu
      className="xpol-menu"
      key="account"
      title={`${web3.account.substr(0, 6)}...${web3.account.substr(-4, 4)}`}>
      <Menu.Item key="account-disconnect" onClick={() => disconnect()}>
        Disconnect
      </Menu.Item>
    </Menu.SubMenu>
  )

  const disconnect = () => {
    deactivate()
    clearLocalStorage()
  }

  const priceImpact = () => {
    const token = transferTokens[withdrawChain].find((token) => token.id === withdrawToken)
    const total = routeQuoteFees.gas.plus(routeQuoteFees.relayer).plus(routeQuoteFees.router)
    let decimals = 2
    if (highlightedIndex !== -1) {
      if (routeQuoteFees.router.lt('0.01')) {
        decimals = 4
      }
    }

    return (
      <Collapse className="fees-collapse" ghost>
        <Collapse.Panel
          header={`Total Fees: ${total.toFixed(decimals)} ${token?.symbol}`}
          key={'fees'}>
          <Row>
            <Col span={24}>
              {Object.entries(routeQuoteFees).map(([label, amount], index) => {
                const info = FEE_INFO[label as keyof typeof FEE_INFO]
                return (
                  <Row key={index} style={{ padding: '6px 0 0 0' }}>
                    <Col span={12}>{label.slice(0, 1).toUpperCase() + label.slice(1)} Fee</Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      {amount.toFixed(decimals, 1)} {token?.symbol}
                      <Tooltip color={'gray'} placement="topRight" title={info}>
                        <Badge
                          count={<InfoCircleOutlined style={{ color: 'gray' }} />}
                          offset={[4, -3]}
                        />
                      </Tooltip>
                    </Col>
                  </Row>
                )
              })}
            </Col>
          </Row>
        </Collapse.Panel>
      </Collapse>
    )
  }

  return (
    <Content className="site-layout xpollinate">
      <div className="xpollinate-header">
        <Row justify="space-between" style={{ padding: 20, height: 84 }} wrap={false}>
          <Col flex="auto">
            <Menu
              id="testmenu"
              className="xpol-menu"
              overflowedIndicator={<MenuOutlined />}
              mode="horizontal"
              selectable={false}
              // style={{ marginLeft: 'auto' }}
              // style={{ float: 'right' }}
              style={{ margin: '0 0 0 auto' }}
              onClick={handleMenuSelect}>
              {web3.account ? (
                <>
                  {menuChain}
                  {menuAccount}
                  <Menu.Item key="history" icon={<HistoryOutlined />}>
                    <a
                      href={`https://connextscan.io/address/${web3.account}`}
                      target="_blank"
                      rel="nofollow noreferrer">
                      Transaction History
                    </a>
                  </Menu.Item>
                </>
              ) : (
                <Menu.Item key="connect-wallet" icon={<LoginOutlined />}>
                  Connect Wallet
                </Menu.Item>
              )}
              <Menu.Item key="explorer" icon={<CompassOutlined />}>
                <a href="https://connextscan.io" target="_blank" rel="nofollow noreferrer">
                  Explorer
                </a>
              </Menu.Item>
              <Menu.Item key="support" icon={<LinkOutlined />}>
                <a href="https://chat.connext.network/" target="_blank" rel="nofollow noreferrer">
                  Support
                </a>
              </Menu.Item>
            </Menu>
          </Col>
          <Col style={{ marginRight: 24 }}>
            <a href="/">
              <img src={xpollinateWordmark} alt="xPollinate" width="160" height="38" />
              <span className="version">v2 {testnet && 'Testnet'}</span>
            </a>
          </Col>
        </Row>
      </div>

      <div className="swap-view" style={{ minHeight: '900px', maxWidth: 1600, margin: 'auto' }}>
        {/* Infos */}
        {showAbout && (
          <Row justify="center" style={{ padding: 20, paddingBottom: 0 }}>
            <Col span={24} flex="auto" style={{ maxWidth: 700 }}>
              <Alert
                afterClose={() => setShowAbout(false)}
                message={aboutMessage}
                description={aboutDescription}
                type="info"
                closable={true}
              />
            </Col>
          </Row>
        )}

        {/* Balances */}
        {testnet && (
          <Collapse activeKey={activeKeyTransactions} accordion ghost>
            <Collapse.Panel
              className={balances ? '' : 'empty'}
              header={
                <h2
                  onClick={() =>
                    setActiveKeyTransactions((key) => (key === 'balances' ? '' : 'balances'))
                  }
                  style={{ display: 'inline' }}>
                  Balances (
                  {updatingBalances ? (
                    <SyncOutlined spin style={{ verticalAlign: -4 }} />
                  ) : !balances ? (
                    '-'
                  ) : (
                    <CheckOutlined />
                  )}
                  )
                </h2>
              }
              key="balances">
              <div
                style={{
                  overflowX: 'scroll',
                  background: 'white',
                  margin: '10px 20px',
                }}>
                <TestBalanceOverview
                  transferChains={transferChains}
                  updateBalances={() => updateBalances(web3.account!)}
                  updatingBalances={updatingBalances}
                  balances={balances}
                />
              </div>
            </Collapse.Panel>
          </Collapse>
        )}

        <Col style={{ padding: 20, paddingBottom: 0 }}>
          <Row justify={'center'} align={'middle'}>
            <Col
              style={{
                marginBottom: 20,
                width: '100%',
                maxWidth: 940,
                minWidth: 392,
                textAlign: activeTransactions.length === 0 ? 'center' : 'inherit',
              }}>
              {/* Active Transactions */}
              <Collapse
                className="active-transactions"
                activeKey={activeKeyTransactions}
                accordion
                ghost>
                <Collapse.Panel
                  className={activeTransactions.length ? '' : 'empty'}
                  header={
                    <h2
                      onClick={() =>
                        setActiveKeyTransactions((key) => (key === 'active' ? '' : 'active'))
                      }
                      style={{ display: 'inline' }}>
                      Active Transactions (
                      {!sdk ? (
                        '-'
                      ) : updatingActiveTransactions ? (
                        <SyncOutlined spin style={{ verticalAlign: -4 }} />
                      ) : (
                        activeTransactions.length
                      )}
                      )
                    </h2>
                  }
                  key="active">
                  {activeTransactions.length > 0 ? (
                    <div
                      style={{
                        overflowX: 'scroll',
                      }}>
                      <TransactionsTableNxtp
                        activeTransactions={activeTransactions}
                        executionRoutes={executionRoutes}
                        setModalRouteIndex={setModalRouteIndex}
                        openSwapModalFinish={openSwapModalFinish}
                        switchChain={switchChain}
                        cancelTransfer={cancelTransfer}
                        tokens={tokens}
                      />
                    </div>
                  ) : updatingActiveTransactions ? (
                    <Spin
                      style={{ margin: 'auto', display: 'block' }}
                      indicator={<LoadingOutlined spin style={{ fontSize: 24 }} />}
                    />
                  ) : (
                    <EllipsisOutlined style={{ fontSize: 24 }} />
                  )}
                </Collapse.Panel>
              </Collapse>
            </Col>
          </Row>
          {/* Swap Form */}
          <Row style={{ margin: 20, marginTop: 0 }} justify={'center'}>
            <Col
              className="swap-form"
              style={{
                borderRadius: 12,
                margin: '6px 12px 0',
                maxWidth: 940,
                minWidth: 392,
              }}>
              <div
                className="swap-input"
                style={{
                  borderRadius: 12,
                  padding: 24,
                  margin: '0 auto',
                }}>
                <Row>
                  <Title className="swap-title" level={4}>
                    Cross-Chain Swap
                  </Title>
                </Row>

                {/* Warning Message */}
                <Row
                  justify="center"
                  style={{ marginBottom: 20, display: alert ? 'flex' : 'none' }}>
                  <Col span={24} flex="auto">
                    <Alert banner message={alert} type="warning" />
                  </Col>
                </Row>

                <Form>
                  <SwapFormNxtp
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
                    forceSameToken={true}
                    syncStatus={syncStatus}
                  />

                  <div
                    style={{
                      marginTop: 12,
                      padding: '12px 0',
                      display: 'flex',
                      justifyContent: 'center',
                    }}>
                    <div style={{ maxWidth: 400, width: '100%' }}>{priceImpact()}</div>
                  </div>

                  <Row style={{ marginTop: 12 }} justify={'center'}>
                    {submitButton()}
                  </Row>
                </Form>

                {/* Advanced Options */}
                <Row className="advanced-options">
                  <Col span={24}>
                    <Collapse ghost>
                      <Collapse.Panel header={`Advanced Options`} key="1">
                        <Row gutter={[16, 16]}>
                          <Col style={{ display: 'flex', flexDirection: 'column' }} span={24}>
                            Infinite Approval
                            <Checkbox
                              style={{ margin: '4px 0 0 0' }}
                              checked={optionInfiniteApproval}
                              onChange={(e) => setOptionInfiniteApproval(e.target.checked)}>
                              Activate Infinite Approval
                            </Checkbox>
                          </Col>

                          <Col style={{ display: 'flex', flexDirection: 'column' }} span={24}>
                            Receiving Address
                            <Input
                              value={optionReceivingAddress}
                              onChange={(e) => setOptionReceivingAddress(e.target.value)}
                              pattern="^0x[a-fA-F0-9]{40}$"
                              placeholder="Send funds to an address other than your current wallet"
                              style={{
                                margin: '4px 0 0 0',
                                border: '1px solid rgba(0,0,0,0.25)',
                                borderRadius: 6,
                              }}
                            />
                          </Col>

                          <Col style={{ display: 'flex', flexDirection: 'column' }} span={24}>
                            Contract Address
                            <Input
                              value={optionContractAddress}
                              onChange={(e) => setOptionContractAddress(e.target.value)}
                              pattern="^0x[a-fA-F0-9]{40}$"
                              placeholder="To call a contract"
                              style={{
                                margin: '4px 0 0 0',
                                border: '1px solid rgba(0,0,0,0.25)',
                                borderRadius: 6,
                              }}
                            />
                          </Col>

                          <Col style={{ display: 'flex', flexDirection: 'column' }} span={24}>
                            Call Data
                            <Input
                              value={optionCallData}
                              onChange={(e) => setOptionCallData(e.target.value)}
                              pattern="^0x[a-fA-F0-9]{64}$"
                              placeholder="Only when calling a contract directly"
                              style={{
                                margin: '4px 0 0 0',
                                border: '1px solid rgba(0,0,0,0.25)',
                                borderRadius: 6,
                              }}
                            />
                          </Col>

                          <Col style={{ display: 'flex', flexDirection: 'column' }} span={24}>
                            Preferred Router
                            <Input
                              value={optionPreferredRouter}
                              onChange={(e) => setOptionPreferredRouter(e.target.value)}
                              pattern="^0x[a-fA-F0-9]{64}$"
                              placeholder="Specify a target router to handle transaction"
                              style={{
                                margin: '4px 0 0 0',
                                border: '1px solid rgba(0,0,0,0.25)',
                                borderRadius: 6,
                              }}
                            />
                          </Col>
                        </Row>
                      </Collapse.Panel>
                    </Collapse>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Col>

        {/* Footer */}
        <div className="xpollinate-footer">
          <Row justify="center" style={{ marginTop: 48, marginBottom: 8 }}>
            <Col>Powered by</Col>
          </Row>
          <Row justify="center" align="middle" style={{ marginBottom: 24 }}>
            <Col span={6} style={{ textAlign: 'right' }}>
              <a href="https://connext.network/" target="_blank" rel="nofollow noreferrer">
                <img
                  src={connextWordmark}
                  alt="Connext"
                  width="200"
                  height="50"
                  style={{ width: '100%', maxWidth: '200px', height: 'auto' }}
                />
              </a>
            </Col>
            <Col span={1} style={{ textAlign: 'center' }}>
              x
            </Col>
            <Col span={6} style={{ textAlign: 'center' }}>
              <a href="https://li.finance/" target="_blank" rel="nofollow noreferrer">
                <img
                  src={lifiWordmark}
                  alt="Li.Finance"
                  width="200"
                  height="50"
                  style={{ width: '100%', maxWidth: '200px', height: 'auto' }}
                />
              </a>
            </Col>
            <Col span={1} style={{ textAlign: 'center' }}>
              x
            </Col>
            <Col span={6} style={{ textAlign: 'left' }}>
              <a href="https://about.1hive.org/" target="_blank" rel="nofollow noreferrer">
                <img
                  src={onehiveWordmark}
                  alt="1hive"
                  width="160"
                  height="42"
                  style={{ width: '80%', maxWidth: '160px', height: 'auto' }}
                />
              </a>
            </Col>
          </Row>
        </div>
      </div>

      {modalRouteIndex !== undefined ? (
        <Modal
          className="xpol-swap-modal"
          visible={true}
          onOk={() => setModalRouteIndex(undefined)}
          onCancel={() => setModalRouteIndex(undefined)}
          width={700}
          footer={null}>
          <SwappingNxtp route={executionRoutes[modalRouteIndex]}></SwappingNxtp>
        </Modal>
      ) : (
        ''
      )}
    </Content>
  )
}

export default SwapXpollinate
