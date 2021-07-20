import { ArrowUpOutlined, CheckOutlined, LoadingOutlined, LoginOutlined, SettingOutlined, SwapOutlined, SyncOutlined } from '@ant-design/icons';
import { NxtpSdk, NxtpSdkEvent, NxtpSdkEvents } from '@connext/nxtp-sdk';
import { TransactionData, TransactionPreparedEvent } from '@connext/nxtp-utils';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Alert, Avatar, Button, Col, Input, Modal, Row, Select, Spin, Table } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { RefSelectProps } from 'antd/lib/select';
import Title from 'antd/lib/typography/Title';
import { BigNumber, constants, providers } from "ethers";
import React, { useEffect, useRef, useState } from 'react';
import connextWordmark from '../assets/connext_wordmark.svg';
import lifiWordmark from '../assets/lifi_wordmark.svg';
import { switchChain } from '../services/metamask';
import { finishTransfer, getTransferQuote, setup, triggerTransfer } from '../services/nxtp';
import { getBalance as getBalanceTest, mintTokens } from '../services/testToken';
import { deepClone, formatTokenAmountOnly } from '../services/utils';
import { ChainKey, ChainPortfolio, CoinKey, Token } from '../types';
import { getChainById, getChainByKey } from '../types/lists';
import { CrossAction, CrossEstimate, Execution, TranferStep } from '../types/server';
import './Swap.css';
import SwappingNxtp from './SwappingNxtp';
import ConnectButton from './web3/ConnectButton';
import { injected } from './web3/connectors';

const BALANCES_REFRESH_INTERVAL = 30000

const transferChains = [
  getChainByKey(ChainKey.GOR),
  getChainByKey(ChainKey.RIN),
]

const testToken: { [ChainKey: string]: Array<TokenWithAmounts> } = {
  [ChainKey.RIN]: [
    {
      id: '0x9ac2c46d7acc21c881154d57c0dc1c55a3139198',
      symbol: CoinKey.TEST,
      decimals: 18,
      chainId: 4,
      chainKey: ChainKey.RIN,
      key: CoinKey.TEST,
      name: CoinKey.TEST,
      logoURI: '',
    },
  ],
  [ChainKey.GOR]: [
    {
      id: '0x8a1cad3703e0beae0e0237369b4fcd04228d1682',
      symbol: CoinKey.TEST,
      decimals: 18,
      chainId: 5,
      chainKey: ChainKey.GOR,
      key: CoinKey.TEST,
      name: CoinKey.TEST,
      logoURI: '',
    },
  ],
}

interface TokenWithAmounts extends Token {
  amount?: number
  amountRendered?: string
}

const SwapNxtp = () => {
  const [stateUpdate, setStateUpdate] = useState<number>(0)
  const [routes, setRoutes] = useState<Array<Array<TranferStep>>>([])
  const [executionRoutes, setExecutionRoutes] = useState<Array<Array<TranferStep>>>([])
  const [modalRouteIndex, setModalRouteIndex] = useState<number>()
  const [routesLoading, setRoutesLoading] = useState<boolean>(false)
  const [noRoutesAvailable, setNoRoutesAvailable] = useState<boolean>(false)
  const [depositChain, setDepositChain] = useState<ChainKey>(ChainKey.RIN);
  const [depositAmount, setDepositAmount] = useState<number>(1);
  const [depositToken, setDepositToken] = useState<string>(testToken[ChainKey.RIN][0].id);
  const depositSelectRef = useRef<RefSelectProps>()
  const [withdrawChain, setWithdrawChain] = useState<ChainKey>(ChainKey.GOR);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(Infinity);
  const [withdrawToken, setWithdrawToken] = useState<string>(testToken[ChainKey.GOR][0].id);
  const withdrawSelectRef = useRef<RefSelectProps>()
  const [tokens, setTokens] = useState<{ [ChainKey: string]: Array<TokenWithAmounts> }>(testToken)
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
  const [balances, setBalances] = useState<{ [ChainKey: string]: Array<ChainPortfolio> }>()
  const [refreshBalances, setRefreshBalances] = useState<boolean>(true)
  const [minting, setMinting] = useState<boolean>(false)
  const [sdkChainId, setSdkChainId] = useState<number>()
  const [sdk, setSdk] = useState<NxtpSdk>()
  const [activeTransactions, setActiveTransactions] = useState<{ txData: TransactionData; status: NxtpSdkEvent; event: TransactionPreparedEvent }[]>([])

  // Wallet
  const web3 = useWeb3React<Web3Provider>()
  const { activate } = useWeb3React();
  const intervalRef = useRef<NodeJS.Timeout>()

  // auto-trigger finish if corresponding modal is opend
  useEffect(() => {
    // is modal open?
    if (modalRouteIndex !== undefined) {
      const crossEstimate = executionRoutes[modalRouteIndex][0].estimate! as CrossEstimate
      const transaction = activeTransactions.find((item) => item.txData.transactionId === crossEstimate.quote.bid.transactionId)
      if (transaction && transaction.status === NxtpSdkEvents.ReceiverTransactionPrepared) {
        finishTransfer(sdk!, transaction.event)
      }
    }
    // eslint-disable-next-line
  }, [modalRouteIndex, executionRoutes, sdk])

  // update table helpers
  const updateActiveTransactionsWith = (txData: TransactionData, status: NxtpSdkEvent, event: any) => {
    setActiveTransactions((activeTransactions) => {
      // update existing?
      let updated = false
      const updatedTransactions = activeTransactions.map((item) => {
        if (item.txData.transactionId === txData.transactionId) {
          item.txData = Object.assign(item.txData, txData)
          item.status = status
          item.event = event
          updated = true
        }
        return item
      })

      if (updated) {
        return updatedTransactions
      } else {
        return [
          ...activeTransactions,
          { txData, status, event },
        ]
      }
    })
  }

  const removeActiveTransaction = (transactionId: string) => {
    setActiveTransactions((activeTransactions) => {
        return activeTransactions.filter((t) => t.txData.transactionId !== transactionId)
    })
  }

  useEffect(() => {
    const initializeConnext = async () => {
      if (sdk && sdkChainId === web3.chainId) {
        return sdk
      }
      if (!web3.library || !web3.account) {
        throw Error('Connect Wallet first.')
      }

      const signer = web3.library.getSigner()

      if (sdk) {
        sdk.removeAllListeners()
      }
      const _sdk = await setup(signer)
      setSdk(_sdk)
      setSdkChainId(web3.chainId)


      // listen to events
      _sdk.attach(NxtpSdkEvents.SenderTransactionPrepared, (data) => {
        updateActiveTransactionsWith(data.txData, NxtpSdkEvents.SenderTransactionPrepared, data)
        setRefreshBalances(true)
      })

      _sdk.attach(NxtpSdkEvents.SenderTransactionFulfilled, (data) => {
        updateActiveTransactionsWith(data.txData, NxtpSdkEvents.SenderTransactionFulfilled, data)
        removeActiveTransaction(data.txData.transactionId)
      })

      _sdk.attach(NxtpSdkEvents.SenderTransactionCancelled, (data) => {
        updateActiveTransactionsWith(data.txData, NxtpSdkEvents.SenderTransactionCancelled, data)
        removeActiveTransaction(data.txData.transactionId)
      })

      _sdk.attach(NxtpSdkEvents.ReceiverTransactionPrepared, (data) => {
        updateActiveTransactionsWith(data.txData, NxtpSdkEvents.ReceiverTransactionPrepared, data)
      })

      _sdk.attach(NxtpSdkEvents.ReceiverTransactionFulfilled, (data) => {
        updateActiveTransactionsWith(data.txData, NxtpSdkEvents.ReceiverTransactionFulfilled, data)
        removeActiveTransaction(data.txData.transactionId)
        setRefreshBalances(true)
      })

      _sdk.attach(NxtpSdkEvents.ReceiverTransactionCancelled, (data) => {
        updateActiveTransactionsWith(data.txData, NxtpSdkEvents.ReceiverTransactionCancelled, data)
        removeActiveTransaction(data.txData.transactionId)
      })

      // get pending transactions
      const transactions = await _sdk.getActiveTransactions()
      for (const transaction of transactions) {
        updateActiveTransactionsWith(transaction.txData, transaction.status, transaction)
      }

      return _sdk
    }

    // init only once
    if (web3.library && web3.account && (!sdk || (sdk && sdkChainId))) {
      initializeConnext()
    }
  }, [web3, sdk, sdkChainId])

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
      } else if (lastStep.action.type === 'cross') {
        return formatTokenAmountOnly(lastStep.action.toToken, lastStep.estimate?.toAmount)
      } else {
        return '0.0'
      }
    }
  }

  const getBalancesForWallet = async (address: string) => {
    const providerRIN = new providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL_RINKEBY)
    const providerGOR = new providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL_GORLI)

    const pBalenceEthRin = getBalanceTest(
      address,
      constants.AddressZero,
      providerRIN,
    )
    const pBalenceTestRin = getBalanceTest(
      address,
      testToken[ChainKey.RIN][0].id,
      providerRIN,
    )
    const pBalenceEthGor = getBalanceTest(
      address,
      constants.AddressZero,
      providerGOR,
    )
    const pBalenceTestGor = getBalanceTest(
      address,
      testToken[ChainKey.GOR][0].id,
      providerGOR,
    )

    const portfolio = {
      [ChainKey.RIN]: [
        {
          id: '0x0000000000000000000000000000000000000000',
          name: 'ETH',
          symbol: 'ETH',
          img_url: '',
          amount: (await pBalenceEthRin).div(BigNumber.from(10).pow(14)).toNumber() / 10000,
          pricePerCoin: 0,
        },
        {
          id: '0x9ac2c46d7acc21c881154d57c0dc1c55a3139198',
          name: 'TEST',
          symbol: 'TEST',
          img_url: '',
          amount: (await pBalenceTestRin).div(BigNumber.from(10).pow(14)).toNumber() / 10000,
          pricePerCoin: 0,
        },
      ],
      [ChainKey.GOR]: [
        {
          id: '0x0000000000000000000000000000000000000000',
          name: 'ETH',
          symbol: 'ETH',
          img_url: '',
          amount: (await pBalenceEthGor).div(BigNumber.from(10).pow(14)).toNumber() / 10000,
          pricePerCoin: 0,
        },
        {
          id: '0x8a1cad3703e0beae0e0237369b4fcd04228d1682',
          name: 'TEST',
          symbol: 'TEST',
          img_url: '',
          amount: (await pBalenceTestGor).div(BigNumber.from(10).pow(14)).toNumber() / 10000,
          pricePerCoin: 0,
        },
      ],
    }
    return portfolio
  }

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
      setRefreshBalances(false)
      getBalancesForWallet(web3.account)
        .then(setBalances)
    }
  }, [web3.account])

  const mintTestToken = async (chainKey: ChainKey) => {
    if (!web3.library || !web3.account) return
    const chainId = getChainByKey(chainKey).id
    await switchChain(chainId)
    if (web3.chainId !== chainId) return
    setMinting(true)
    try {
      const res = await mintTokens(web3.library?.getSigner(), testToken[chainKey][0].id)
      await res.wait(1)
      await getBalancesForWallet(web3.account).then(setBalances)
    } finally {
      setMinting(false)
    }
  }

  const getBalance = (chainKey: ChainKey, tokenId: string) => {
    if (!balances) {
      return 0
    }

    const tokenBalance = balances[chainKey].find(portfolio => portfolio.id === tokenId)

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
          token.amount = getBalance(chain.key, token.id)
          token.amountRendered = token.amount.toFixed(4)
        }
      }
    }

    setTokens(tokens)
    setStateUpdate(stateUpdate + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens, balances])

  useEffect(() => {
    intervalRef.current = setInterval(() => setRefreshBalances(true), BALANCES_REFRESH_INTERVAL)

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
    return depositAmount <= getBalance(depositChain, depositToken)
  }

  const onChangeDepositChain = (chainKey: ChainKey) => {
    setWithdrawChain(depositChain)
    setWithdrawToken(depositToken)
    setDepositChain(chainKey)
    setDepositToken(testToken[chainKey][0].id)
  }

  const onChangeWithdrawChain = (chainKey: ChainKey) => {
    setDepositChain(withdrawChain)
    setDepositToken(withdrawToken)
    setDepositChain(chainKey)
    setDepositToken(testToken[chainKey][0].id)
  }

  const onChangeDepositToken = (tokenId: string) => {
    // unselect
    depositSelectRef?.current?.blur()

    // connect
    if (tokenId === 'connect') {
      activate(injected)
      return
    }

    // set token
    setDepositToken(tokenId)
    const balance = getBalance(depositChain, tokenId)
    if (balance < depositAmount && balance > 0) {
      setDepositAmount(Math.floor(balance * 10000) / 10000)
    }
  }

  const onChangeWithdrawToken = (tokenId: string) => {
    // unselect
    withdrawSelectRef?.current?.blur()

    // connect
    if (tokenId === 'connect') {
      activate(injected)
      return
    }

    // set token
    setWithdrawToken(tokenId)
  }

  const changeDirection = () => {
    setWithdrawChain(depositChain)
    setDepositChain(withdrawChain)
    setWithdrawToken(depositToken)
    setDepositToken(withdrawToken)
  }

  const findToken = (chainKey: ChainKey, tokenId: string) => {
    const token = tokens[chainKey].find(token => token.id === tokenId)
    if (!token) {
      throw new Error('Token not found')
    }
    return token
  }

  const getTransferRoutes = async () => {
    setRoutes([])
    setHighlightedIndex(-1)
    setNoRoutesAvailable(false)

    if (!sdk || !web3.account) {
      return
    }

    if (((isFinite(depositAmount) && depositAmount > 0) || (isFinite(withdrawAmount) && withdrawAmount > 0)) && depositChain && depositToken && withdrawChain && withdrawToken) {
      setRoutesLoading(true)
      const dToken = findToken(depositChain, depositToken)
      const wToken = findToken(withdrawChain, withdrawToken)
      const dAmount = depositAmount ? Math.floor(depositAmount * (10 ** dToken.decimals)) : Infinity

      try {
        const quote = await getTransferQuote(
          sdk,
          getChainByKey(depositChain).id,
          dToken.id,
          getChainByKey(withdrawChain).id,
          wToken.id,
          dAmount.toString(),
          web3.account,
        )
        if (!quote) {
          throw new Error('Empty Quote')
        }

        const toAmount = parseInt(quote.bid.amountReceived)
        const sortedRoutes: Array<Array<TranferStep>> = [[
          {
            action: {
              type: 'cross',
              method: 'nxtp',
              chainId: getChainByKey(depositChain).id,
              chainKey: depositChain,
              toChainKey: withdrawChain,
              amount: dAmount,
              fromToken: dToken,
              toToken: wToken,
            } as CrossAction,
            estimate: {
              fromAmount: dAmount,
              toAmount: toAmount,
              fees: {
                included: true,
                percentage: (dAmount - toAmount) / dAmount * 100,
                token: dToken,
                amount: dAmount - toAmount,
              },
              quote: quote,
            } as CrossEstimate,
          }
        ]]

        setRoutes(sortedRoutes)
        setHighlightedIndex(sortedRoutes.length === 0 ? -1 : 0)
        setNoRoutesAvailable(sortedRoutes.length === 0)
      } catch (e) {
        console.error(e)
        setNoRoutesAvailable(true)
      } finally {
        setRoutesLoading(false)
      }
    }
  }

  useEffect(() => {
    getTransferRoutes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depositAmount, depositChain, depositToken, withdrawChain, withdrawToken, web3, sdk])

  const onChangeDepositAmount = (amount: number) => {
    setDepositAmount(amount)
    setWithdrawAmount(Infinity)
  }
  const onChangeWithdrawAmount = (amount: number) => {
    setDepositAmount(Infinity)
    setWithdrawAmount(amount)
  }
  const formatAmountInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    return parseFloat(e.currentTarget.value)
  }

  const updateExecutionRoute = (route: Array<TranferStep>) => {
    setExecutionRoutes(routes => {
      let index = routes.findIndex(item => {
        return item[0].id === route[0].id
      })
      const newRoutes = [
        ...routes.slice(0, index),
        route,
        ...routes.slice(index + 1)
      ]
      return newRoutes
    })
  }

  const openSwapModal = () => {
    // add execution route
    const route = deepClone(routes[highlightedIndex]) as Array<TranferStep>
    setExecutionRoutes(routes => [...routes, route])

    // get new route to avoid triggering the same quote twice
    getTransferRoutes()

    // add as active
    const crossAction = route[0].action as CrossAction
    const crossEstimate = route[0].estimate as CrossEstimate
    const txData = {
      user: '',
      router: '',
      sendingAssetId: crossAction.fromToken.id,
      receivingAssetId: crossAction.toToken.id,
      sendingChainFallback: '',
      callTo: '',
      receivingAddress: '',
      sendingChainId: crossAction.chainId,
      receivingChainId: getChainByKey(crossAction.toChainKey).id,
      callDataHash: '',
      transactionId: crossEstimate.quote.bid.transactionId,
      amount: crossAction.amount.toString(),
      preparedBlockNumber: 0,
      expiry: Math.floor(Date.now() / 1000) + 3600 * 24 * 3, // 3 days
    } as TransactionData
    updateActiveTransactionsWith(txData, 'Started' as NxtpSdkEvent, {} as TransactionPreparedEvent)

    // start execution
    const update = (step: TranferStep, status: Execution) => {
      step.execution = status
      updateExecutionRoute(route)
    }
    triggerTransfer(sdk!, route[0], update, true)

    // open modal
    setModalRouteIndex(executionRoutes.length)
  }

  const openSwapModalFinish = (event: TransactionPreparedEvent) => {
    // open modal
    const index = executionRoutes.findIndex(item => {
      return item[0].id === event.txData.transactionId
    })

    if (index !== -1) {
      setModalRouteIndex(index)

      // trigger sdk
      const route = executionRoutes[index]
      const update = (step: TranferStep, status: Execution) => {
        step.execution = status
        updateExecutionRoute(route)
      }
      finishTransfer(sdk!, event, route[0], update)
    } else {
      finishTransfer(sdk!, event)
    }
  }

  const submitButton = () => {
    if (!web3.account) {
      return <Button shape="round" type="primary" icon={<LoginOutlined />} size={"large"} onClick={() => activate(injected)}>Connect Wallet</Button>
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
    if (web3.chainId !== getChainByKey(depositChain).id) {
      return <Button shape="round" type="primary" size={"large"} onClick={() => switchChain(getChainByKey(depositChain).id)}>Change Chain</Button>
    }

    return <Button disabled={highlightedIndex === -1} shape="round" type="primary" icon={<SwapOutlined />} size={"large"} onClick={() => openSwapModal()}>Swap</Button>
  }

  const activeTransactionsColumns = [
    {
      title: "View",
      dataIndex: ["txData", "transactionId"],
      render: (id: string) => {
        const index = executionRoutes.findIndex(item => {
          return (item[0].estimate as CrossEstimate).quote.bid.transactionId === id
        })

        if (index !== -1) {
          return <Button onClick={() => setModalRouteIndex(index)}>View</Button>
        } else {
          return ''
        }
      }
    },
    {
      title: "Transaction Id",
      dataIndex: ["txData", "transactionId"],
      render: (id: string) => {
        return <div style={{ width: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{id}</div>
      }
    },
    {
      title: "Sending Chain",
      dataIndex: ["txData", "sendingChainId"],
      render: (chainId: number) => {
        const chain = getChainById(chainId)
        return <>{chainId} - {chain.name}</>
      }
    },
    {
      title: "Receiving Chain",
      dataIndex: ["txData", "receivingChainId"],
      render: (chainId: number) => {
        const chain = getChainById(chainId)
        return <>{chainId} - {chain.name}</>
      }
    },
    {
      title: "Asset",
      dataIndex: ["txData"],
      render: (action: TransactionData) => {
        const chain = getChainById(action.receivingChainId)
        const token = testToken[chain.key].find(token => token.id === action.receivingAssetId.toLowerCase())
        const link = chain.metamask.blockExplorerUrls[0] + 'token/' + action.receivingAssetId
        return <a href={link} target="_blank" rel="nofollow noreferrer">{token?.name}</a>
      }
    },
    {
      title: "Amount",
      dataIndex: ["txData"],
      render: (action: TransactionData) => {
        const chain = getChainById(action.receivingChainId)
        const token = testToken[chain.key].find(token => token.id === action.receivingAssetId.toLowerCase())
        return (parseInt(action.amount) / (10 ** (token?.decimals || 18))).toFixed(4)
      }
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Expires",
      dataIndex: ["txData", "expiry"],
      render: (expiry: string) => {
        return parseInt(expiry) > Date.now() / 1000
          ? `${((parseInt(expiry) - Date.now() / 1000) / 3600).toFixed(2)} hours`
          : "Expired"
      }
    },
    {
      title: "Action",
      dataIndex: "",
      render: (action: any) => {
        if (Date.now() / 1000 > action.txData.expiry) {
          return (
            <Button
              type="link"
              onClick={() =>
                sdk?.cancelExpired({ relayerFee: "0", signature: "0x", txData: action }, action.sendingChainId)
              }
            >
              Cancel
            </Button>
          );
        } else if (action.status === NxtpSdkEvents.ReceiverTransactionPrepared && action.event) {
          return (
            <Button
              onClick={() => openSwapModalFinish(action.event)}
            >
              Finish
            </Button>
          )
        } else if (
          action.status === NxtpSdkEvents.ReceiverTransactionFulfilled
          || action.status === NxtpSdkEvents.SenderTransactionFulfilled
        ) {
          return <CheckOutlined style={{ margin: 'auto', display: 'block', color: 'green', fontSize: 24 }} />
        } else {
          return <Spin style={{ margin: 'auto', display: 'block' }} indicator={<LoadingOutlined spin style={{ fontSize: 24 }} />} />
        }
      },
    },
  ]

  return (
    <Content className="site-layout" style={{ minHeight: 'calc(100vh)', marginTop: 0 }}>
      <div className="swap-view" style={{ minHeight: '900px', maxWidth: 1600, margin: 'auto' }}>

        <Row justify="center" style={{ padding: 20 }}>
          <Alert
            message={(<h1>Welcome to the <a href="https://github.com/connext/nxtp" target="_blank" rel="nofollow noreferrer">NXTP</a> Testnet Demo</h1>)}
            description={(
              <>
                <p>The demo allows to transfer custom <b>TEST</b> token between Rinkeby and Goerli testnet.</p>
                <p>To use the demo you need gas (ETH) and test token (TEST) on one of the chains. You can get free ETH for testing from public faucets and mint your own TEST here on the website.</p>

                <h3 style={{ textAlign: 'center' }}>Your Balance</h3>
                {web3.account && balances &&
                  <table style={{ background: 'white', margin: 'auto' }}>
                    <thead className="ant-table-thead">
                      <tr className="ant-table-row">
                        <th className="ant-table-cell"></th>
                        <th className="ant-table-cell" style={{ textAlign: 'center' }}>Rinkeby</th>
                        <th className="ant-table-cell" style={{ textAlign: 'center' }}>Goerli</th>
                      </tr>
                    </thead>
                    <tbody className="ant-table-tbody" style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <tr className="ant-table-row">
                        <td className="ant-table-cell">ETH</td>
                        <td className="ant-table-cell">
                          <Row gutter={16}>
                            <Col xs={24} sm={12} >
                              {balances[ChainKey.RIN][0].amount.toFixed(4)}
                            </Col>
                            <Col xs={24} sm={12}>
                              (<a href="https://faucet.rinkeby.io/" target="_blank" rel="nofollow noreferrer">Get ETH <ArrowUpOutlined rotate={45} /></a>)
                            </Col>
                          </Row>
                        </td>
                        <td className="ant-table-cell">
                          <Row gutter={16}>
                            <Col xs={24} sm={12} >
                              {balances[ChainKey.GOR][0].amount.toFixed(4)}
                            </Col>
                            <Col xs={24} sm={12}>
                              (<a href="https://goerli-faucet.slock.it/" target="_blank" rel="nofollow noreferrer">Get ETH <ArrowUpOutlined rotate={45} /></a>)
                            </Col>
                          </Row>
                        </td>
                      </tr>
                      <tr className="ant-table-row" style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <td className="ant-table-cell">TEST</td>
                        <td className="ant-table-cell" >
                          <Row gutter={16}>
                            <Col xs={24} sm={12} >
                              {balances[ChainKey.RIN][1].amount.toFixed(4)}
                            </Col>
                            <Col xs={24} sm={12}>
                              ({minting
                                ? <span className="flashing">minting</span>
                                : web3.chainId === 4
                                  ? <Button type="link" style={{ padding: 0, height: 'auto' }} onClick={() => mintTestToken(ChainKey.RIN)}>Mint TEST <SettingOutlined /></Button>
                                  : <Button type="link" style={{ padding: 0, height: 'auto' }} onClick={() => switchChain(4)}>Change Chain</Button>
                              })
                            </Col>
                          </Row>
                        </td>
                        <td className="ant-table-cell">
                          <Row gutter={16}>
                            <Col xs={24} sm={12} >
                              {balances[ChainKey.GOR][1].amount.toFixed(4)}
                            </Col>
                            <Col xs={24} sm={12}>
                              ({minting
                                ? <span className="flashing">minting</span>
                                : web3.chainId === 5
                                  ? <Button type="link" style={{ padding: 0, height: 'auto' }} onClick={() => mintTestToken(ChainKey.GOR)}>Mint TEST <SettingOutlined /></Button>
                                  : <Button type="link" style={{ padding: 0, height: 'auto' }} onClick={() => switchChain(5)}>Change Chain</Button>
                              })
                            </Col>
                          </Row>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                }
                {!web3.account &&
                  <Row justify="center"><ConnectButton></ConnectButton></Row>
                }
              </>
            )}
            type="info"
          />
        </Row>

        {/* Active Transactions */}
        {activeTransactions.length ?
          <>
            <Row justify="center" style={{ marginTop: 24 }}>
              <h2>Active Transactions</h2>
            </Row>
            <Row justify="center">
              <div style={{ overflow: 'scroll', background: 'white', margin: '10px 20px' }}>
                <Table
                  columns={activeTransactionsColumns}
                  dataSource={activeTransactions}
                  style={{ whiteSpace: 'nowrap' }}
                  pagination={false}
                  rowKey={(row) => row.txData.transactionId}
                ></Table>
              </div>
            </Row>
          </> : <></>
        }

        {/* Swap Form */}
        <Row style={{ margin: 20 }} justify={"center"} className="swap-form">
          <Col>
            <div className="swap-input" style={{ maxWidth: 450, borderRadius: 6, padding: 24, margin: "0 auto" }}>
              <Row>
                <Title className="swap-title" level={4}>Please Specify Your Transaction</Title>
              </Row>

              <Row gutter={[{ xs: 8, sm: 16 }, { xs: 8, sm: 16 }]}>
                <Col span={10}>
                  <div className="form-text">
                    From:
                  </div>
                </Col>
                <Col span={14}>
                  <div className="form-input-wrapper">
                    <Avatar
                      size="small"
                      src={getChainByKey(depositChain).iconUrl}
                      alt={getChainByKey(depositChain).name}
                    >{getChainByKey(depositChain).name[0]}</Avatar>
                    <Select
                      placeholder="Select Chain"
                      value={depositChain}
                      onChange={((v: ChainKey) => onChangeDepositChain(v))}
                      bordered={false}
                    >
                      {transferChains.map(chain => (
                        <Select.Option key={chain.key} value={chain.key}>{chain.name}</Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>

                <Col span={10}>
                  <div className="form-input-wrapper">
                    <Input
                      type="number"
                      defaultValue={0.0}
                      min={0}
                      max={10}
                      value={isFinite(depositAmount) ? depositAmount : ''}
                      onChange={((event) => onChangeDepositAmount(formatAmountInput(event)))}
                      placeholder="0.0"
                      bordered={false}
                      className={web3.account && !hasSufficientBalance() ? 'insufficient' : ''}
                    />
                  </div>
                </Col>
                <Col span={14}>
                  <div className="form-input-wrapper">
                    <Avatar
                      size="small"
                      src={depositToken ? findToken(depositChain, depositToken).logoURI : undefined}
                      alt={depositToken ? findToken(depositChain, depositToken).name : undefined}
                    >{depositToken ? findToken(depositChain, depositToken).name[0] : '?'}</Avatar>
                    <Select
                      placeholder="Select Coin"
                      value={depositToken}
                      onChange={((v) => onChangeDepositToken(v))}
                      optionLabelProp="data-label"
                      bordered={false}
                      dropdownStyle={{ minWidth: 300 }}
                      showSearch
                      ref={(select) => {
                        if (select) {
                          depositSelectRef.current = select
                        }
                      }}
                      filterOption={(input, option) => {
                        return (option?.label as string || '').toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }}
                    >
                      <Select.OptGroup label="Owned Token">
                        {!web3.account &&
                          <Select.Option key="Select Coin" value="connect">
                            Connect your wallet
                          </Select.Option>
                        }
                        {balances && tokens[depositChain].filter(token => token.amount).map(token => (
                          <Select.Option key={'own_' + token.id} value={token.id} label={token.symbol + ' ' + token.name} data-label={token.symbol}>
                            <div className="option-item">
                              <span role="img" aria-label={token.symbol}>
                                <Avatar
                                  size="small"
                                  src={token.logoURI}
                                  alt={token.symbol}
                                  style={{ marginRight: 10 }}
                                >{token.symbol[0]}</Avatar>
                              </span>
                              <span className="option-name">{token.symbol} - {token.name}</span>
                              <span className="option-balance">
                                {token.amountRendered}
                              </span>
                            </div>
                          </Select.Option>
                        ))}
                      </Select.OptGroup>

                      <Select.OptGroup label="All Token">
                        {tokens[depositChain].map(token => (
                          <Select.Option key={token.id} value={token.id} label={token.symbol + '       - ' + token.name} data-label={token.symbol}>
                            <div className={'option-item ' + (token.amount === 0 ? 'disabled' : '')}>
                              <span role="img" aria-label={token.symbol}>
                                <Avatar
                                  size="small"
                                  src={token.logoURI}
                                  alt={token.symbol}
                                  style={{ marginRight: 10 }}
                                >{token.symbol[0]}</Avatar>
                              </span>
                              <span className="option-name">{token.symbol} - {token.name}</span>
                              <span className="option-balance">
                                {token.amountRendered}
                              </span>
                            </div>
                          </Select.Option>
                        ))}
                      </Select.OptGroup>
                    </Select>
                  </div>
                </Col>
              </Row>

              <Row style={{ margin: 32 }} justify={"center"} >
                <SwapOutlined onClick={() => changeDirection()} />
              </Row>

              <Row gutter={[{ xs: 8, sm: 16 }, { xs: 8, sm: 16 }]}>
                <Col span={10}>
                  <div className="form-text">
                    To:
                  </div>
                </Col>
                <Col span={14}>
                  <div className="form-input-wrapper">
                    <Avatar
                      size="small"
                      src={getChainByKey(withdrawChain).iconUrl}
                      alt={getChainByKey(withdrawChain).name}
                    >{getChainByKey(withdrawChain).name[0]}</Avatar>
                    <Select
                      placeholder="Select Chain"
                      value={withdrawChain}
                      onChange={((v: ChainKey) => onChangeWithdrawChain(v))}
                      bordered={false}
                    >
                      {transferChains.map(chain => (
                        <Select.Option key={chain.key} value={chain.key}>{chain.name}</Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>

                <Col span={10}>
                  <div className="form-input-wrapper disabled">
                    <Input
                      type="number"
                      defaultValue={0.0}
                      min={0}
                      max={10}
                      value={getSelectedWithdraw()}
                      // value={isFinite(withdrawAmount) ? withdrawAmount : ''}
                      onChange={((event) => onChangeWithdrawAmount(formatAmountInput(event)))}
                      placeholder="0.0"
                      bordered={false}
                      disabled
                    />
                  </div>
                </Col>
                <Col span={14}>
                  <div className="form-input-wrapper">
                    <Avatar
                      size="small"
                      src={withdrawToken ? findToken(withdrawChain, withdrawToken).logoURI : undefined}
                      alt={withdrawToken ? findToken(withdrawChain, withdrawToken).name : undefined}
                    >{withdrawToken ? findToken(withdrawChain, withdrawToken).name[0] : '?'}</Avatar>
                    <Select
                      placeholder="Select Coin"
                      value={withdrawToken}
                      onChange={((v) => onChangeWithdrawToken(v))}
                      optionLabelProp="data-label"
                      bordered={false}
                      dropdownStyle={{ minWidth: 300 }}
                      showSearch
                      ref={(select) => {
                        if (select) {
                          withdrawSelectRef.current = select
                        }
                      }}
                      filterOption={(input, option) => {
                        return (option?.label as string || '').toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }}
                    >
                      <Select.OptGroup label="Owned Token">
                        {!web3.account &&
                          <Select.Option key="Select Coin" value="connect">
                            Connect your wallet
                          </Select.Option>
                        }
                        {balances && tokens[withdrawChain].filter(token => token.amount).map(token => (
                          <Select.Option key={'own_' + token.id} value={token.id} label={token.symbol + ' ' + token.name} data-label={token.symbol}>
                            <div className="option-item">
                              <span role="img" aria-label={token.symbol}>
                                <Avatar
                                  size="small"
                                  src={token.logoURI}
                                  alt={token.symbol}
                                  style={{ marginRight: 10 }}
                                >{token.symbol[0]}</Avatar>
                              </span>
                              <span className="option-name">{token.symbol} - {token.name}</span>
                              <span className="option-balance">
                                {token.amountRendered}
                              </span>
                            </div>
                          </Select.Option>
                        ))}
                      </Select.OptGroup>

                      <Select.OptGroup label="All Token">
                        {tokens[withdrawChain].map(token => (
                          <Select.Option key={token.id} value={token.id} label={token.symbol + ' ' + token.name} data-label={token.symbol}>
                            <div className="option-item">
                              <span role="img" aria-label={token.symbol}>
                                <Avatar
                                  size="small"
                                  src={token.logoURI}
                                  alt={token.symbol}
                                  style={{ marginRight: 10 }}
                                >{token.symbol[0]}</Avatar>
                              </span>
                              <span className="option-name">{token.symbol} - {token.name}</span>
                              <span className="option-balance">
                                {token.amountRendered}
                              </span>
                            </div>
                          </Select.Option>
                        ))}
                      </Select.OptGroup>
                    </Select>
                  </div>
                </Col>
              </Row>


              <Row style={{ marginTop: 24 }} justify={"center"}>
                {submitButton()}
              </Row>

              {/* Add when withdraw to other address is included */}
              {/* <Row style={{marginBottom: 32}} justify={"center"} >
              <Collapse ghost>
                <Panel header ={`Send swapped ${withdrawToken} to another wallet`}  key="1">
                  <Input placeholder="0x0....." style={{border:"2px solid #f0f0f0", borderRadius: 20}}/>
                </Panel>
              </Collapse>
            </Row> */}

            </div>
          </Col>
        </Row>

        <Row justify="center" style={{ marginTop: 48, marginBottom: 8 }}>
          <Col>
            Powered by
          </Col>
        </Row>
        <Row justify="center" align="middle" style={{ marginBottom: 24 }}>
          <Col span={8} style={{ textAlign: 'right' }}>
            <a href="https://connext.network/" target="_blank" rel="nofollow noreferrer">
              <img src={connextWordmark} alt="Connext" style={{ width: '100%', maxWidth: '200px' }} />
            </a>
          </Col>
          <Col span={2} style={{ textAlign: 'center' }}>
            x
          </Col>
          <Col span={8} style={{ textAlign: 'left' }}>
            <a href="https://li.finance/" target="_blank" rel="nofollow noreferrer">
              <img src={lifiWordmark} alt="Li.Finance" style={{ width: '100%', maxWidth: '200px' }} />
            </a>
          </Col>
        </Row>


      </div>

      {modalRouteIndex !== undefined
        ? <Modal
          className="swapModal"
          visible={true}
          onOk={() => setModalRouteIndex(undefined)}
          onCancel={() => setModalRouteIndex(undefined)}
          width={700}
          footer={null}
        >
          <SwappingNxtp route={executionRoutes[modalRouteIndex]}></SwappingNxtp>
        </Modal>
        : ''
      }
    </Content>
  )
}

export default SwapNxtp
