import { ArrowUpOutlined, LoginOutlined, SwapOutlined, SyncOutlined, SettingOutlined } from '@ant-design/icons';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Alert, Avatar, Button, Col, Input, Modal, Row, Select, Steps } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { RefSelectProps } from 'antd/lib/select';
import Title from 'antd/lib/typography/Title';
import { BigNumber, constants, providers } from "ethers";
import React, { useEffect, useRef, useState } from 'react';
import { switchChain } from '../services/metamask';
import { getBalance as getBalanceTest, mintTokens } from '../services/testToken';
import { formatTokenAmount, formatTokenAmountOnly } from '../services/utils';
import { ChainKey, ChainPortfolio, CoinKey, Token } from '../types';
import { getChainByKey } from '../types/lists';
import { CrossAction, CrossEstimate, TranferStep } from '../types/server';
import './Swap.css';
import SwappingNxtp from './SwappingNxtp';
import ConnectButton from './web3/ConnectButton';
import { injected } from './web3/connectors';

const BALANCES_REFRESH_INTERVAL = 5000

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
  const [routesLoading, setRoutesLoading] = useState<boolean>(false)
  const [noRoutesAvailable, setNoRoutesAvailable] = useState<boolean>(false)
  const [selectedRoute, setselectedRoute] = useState<Array<TranferStep>>([]);
  const [selectedRouteIndex, setselectedRouteIndex] = useState<number>();
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

  // Wallet
  const web3 = useWeb3React<Web3Provider>()
  const { activate } = useWeb3React();
  const intervalRef = useRef<NodeJS.Timeout>()

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

  const parseStep = (step: TranferStep) => {
    switch (step.action.type) {
      case "swap":
        return {
          title: "Swap Tokens",
          description: `${formatTokenAmount(step.action.fromToken, step.estimate?.fromAmount)} for ${formatTokenAmount(step.action.toToken, step.estimate?.toAmount)} on ${step.action.chainKey}`,
        }
      case "paraswap":
        return {
          title: `Swap ${step.action.target === 'channel' ? ' and Deposit' : ''} Tokens`,
          description: `${formatTokenAmount(step.action.fromToken, step.estimate?.fromAmount)} for ${formatTokenAmount(step.action.toToken, step.estimate?.toAmount)} via Paraswap`
        }
      case "1inch":
        return {
          title: `Swap ${step.action.target === 'channel' ? ' and Deposit' : ''} Tokens`,
          description: `${formatTokenAmount(step.action.fromToken, step.estimate?.fromAmount)} for ${formatTokenAmount(step.action.toToken, step.estimate?.toAmount)} via 1Inch`
        }
      case "cross":
        return {
          title: "Cross Chains",
          description: `${formatTokenAmount(step.action.fromToken, step.estimate?.fromAmount)} on ${step.action.chainKey} to ${formatTokenAmount(step.action.toToken, step.estimate?.toAmount)} on ${step.action.toChainKey}`,
        }
      case "withdraw":
        return {
          title: "Withdraw",
          description: `${formatTokenAmount(step.action.token, step.estimate?.toAmount)} to 0x...`,
        }
      case "deposit":
        return {
          title: "Deposit",
          description: `${formatTokenAmount(step.action.token, step.estimate?.fromAmount)} from 0x...`,
        }
    }
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

    if (((isFinite(depositAmount) && depositAmount > 0) || (isFinite(withdrawAmount) && withdrawAmount > 0)) && depositChain && depositToken && withdrawChain && withdrawToken) {
      setRoutesLoading(true)
      const dToken = findToken(depositChain, depositToken)
      const wToken = findToken(withdrawChain, withdrawToken)
      const dAmount = depositAmount ? Math.floor(depositAmount * (10 ** dToken.decimals)) : Infinity
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
            toAmount: dAmount * 0.995,
            fees: {
              included: true,
              percentage: 0.5,
              token: dToken,
              amount: dAmount * 0.005,
            },
          } as CrossEstimate,
        }
      ]]

      setRoutes(sortedRoutes)
      setHighlightedIndex(sortedRoutes.length === 0 ? -1 : 0)
      setNoRoutesAvailable(sortedRoutes.length === 0)
      setRoutesLoading(false)
    }
  }

  useEffect(() => {
    getTransferRoutes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depositAmount, depositChain, depositToken, withdrawChain, withdrawToken])

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

  const openSwapModal = () => {
    setselectedRoute(routes[highlightedIndex])
    setselectedRouteIndex(highlightedIndex)
  }

  const updateRoute = (route: any, index: number) => {
    const newRoutes = [
      ...routes.slice(0, index),
      route,
      ...routes.slice(index + 1)
    ]
    setRoutes(newRoutes)
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

    return <Button disabled={highlightedIndex === -1} shape="round" type="primary" icon={<SwapOutlined />} size={"large"} onClick={() => openSwapModal()}>Swap</Button>
  }

  return (
    <Content className="site-layout" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <div className="swap-view" style={{ minHeight: '900px', maxWidth: 1600, margin: 'auto' }}>

        {/* Hero Image */}
        {/* <Row style={{ width: '80%', margin: '24px auto 0',transition: 'opacity 200ms', opacity: routes.length ? 0.3 : 1 }} justify={'center'}>
          <Image
            className="hero-image"
            src={heroImage}
          />
        </Row> */}

        <Row justify="center" style={{marginTop: 24}}>

        <Alert
      message={(<h1>Welcome to the <a href="https://github.com/connext/nxtp" target="_blank" rel="nofollow noreferrer">NXTP</a> Testnet Demo</h1>)}
      description={(
        <>
          <p>The demo allows to transfer custom <b>TEST</b> token between Rinkeby and Goerli testnet.</p>
          <p>To use the demo you need gas (ETH) and test token (TEST) on one of the chains. You can get free ETH for testing from public faucets and mint your own TEST here on the website.</p>

          <h3 style={{textAlign: 'center'}}>Your Balance</h3>
          { web3.account && balances &&
          <table style={{background: 'white', margin: 'auto'}}>
            <thead className="ant-table-thead">
              <tr className="ant-table-row">
                <th className="ant-table-cell"></th>
                <th className="ant-table-cell" colSpan={2}>Rinkeby</th>
                <th className="ant-table-cell" colSpan={2}>Goerli</th>
              </tr>
            </thead>
            <tbody className="ant-table-tbody">
              <tr className="ant-table-row">
                <td className="ant-table-cell">ETH</td>
                <td className="ant-table-cell" style={{textAlign: 'right'}}>{balances[ChainKey.RIN][0].amount.toFixed(4)}</td>
                <td className="ant-table-cell">(<a href="https://faucet.rinkeby.io/" target="_blank" rel="nofollow noreferrer">Get ETH <ArrowUpOutlined rotate={45} /></a>)</td>
                <td className="ant-table-cell" style={{textAlign: 'right'}}>{balances[ChainKey.GOR][0].amount.toFixed(4)}</td>
                <td className="ant-table-cell">(<a href="https://goerli-faucet.slock.it/" target="_blank" rel="nofollow noreferrer">Get ETH <ArrowUpOutlined rotate={45} /></a>)</td>
              </tr>
              <tr className="ant-table-row">
                <td className="ant-table-cell">TEST</td>
                <td className="ant-table-cell" style={{textAlign: 'right'}}>{balances[ChainKey.RIN][1].amount.toFixed(4)}</td>
                <td className="ant-table-cell">(
                  { minting
                    ? <span className="flashing">minting</span>
                    : web3.chainId === 4
                        ? <Button type="link" style={{padding: 0}} onClick={() => mintTestToken(ChainKey.RIN)}>Get TEST <SettingOutlined /></Button>
                        : <Button type="link" style={{padding: 0}} onClick={() => switchChain(4)}>Change Chain</Button>
                  }
                )</td>
                <td className="ant-table-cell" style={{textAlign: 'right'}}>{balances[ChainKey.GOR][1].amount.toFixed(4)}</td>
                <td className="ant-table-cell">(
                  { minting
                    ? <span className="flashing">minting</span>
                    : web3.chainId === 5
                      ? <Button type="link" style={{padding: 0}} onClick={() => mintTestToken(ChainKey.GOR)}>Get TEST <SettingOutlined /></Button>
                      : <Button type="link" style={{padding: 0}} onClick={() => switchChain(5)}>Change Chain</Button>
                  }
                  )</td>
              </tr>
            </tbody>
          </table>
          }
          { !web3.account &&
            <Row justify="center"><ConnectButton></ConnectButton></Row>
          }
        </>
      )}
      type="info"
    />
        </Row>

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

        {/* Routes */}
        <Row justify={"center"} style={{ marginTop: 48 }}>
          {routes.length > 0 &&
            <Col>
              <h3 style={{ textAlign: 'center' }}>Available routes<br className="only-mobile" /> (sorted by estimated withdraw)</h3>
              <div style={{ display: 'flex', flexDirection: 'row', overflowX: 'scroll' }}>
                {
                  routes.map((route, index) =>
                    <div
                      key={index}
                      className={'swap-route ' + (highlightedIndex === index ? 'optimal' : '')}
                      style={{ padding: 24, paddingTop: 24, paddingBottom: 24, marginLeft: 10, marginRight: 10 }}
                      onClick={() => setHighlightedIndex(index)}
                    >
                      <Steps progressDot size="small" direction="vertical" current={5} className="progress-step-list">
                        {
                          route.map(step => {
                            let { title, description } = parseStep(step)
                            return <Steps.Step key={title} title={title} description={description}></Steps.Step>
                          })
                        }
                      </Steps>

                      <div className="selected">
                        {highlightedIndex === index ? (
                          <div className="selected-label">Selected</div>
                        ) : (
                          <Button shape="round" size={"large"} onClick={() => setHighlightedIndex(index)}>Select Route</Button>
                        )}
                      </div>
                    </div>
                  )
                }
              </div>
            </Col>
          }
          {routesLoading &&
            <Col>
              <Row gutter={[32, 62]} justify={"center"} style={{ marginTop: 48 }}>
                <h3 style={{ textAlign: 'center' }}>Loading...</h3>
              </Row>
            </Col>
          }
          {!routesLoading && noRoutesAvailable &&
            <Col>
              <h3 style={{ textAlign: 'center' }}>No Route Found</h3>
            </Col>
          }
        </Row>

      </div>

      {selectedRoute.length &&
        <Modal
          className="swapModal"
          visible={selectedRoute.length > 0}
          onOk={() => setselectedRoute([])}
          onCancel={() => setselectedRoute([])}
          width={700}
          footer={null}
        >
          <SwappingNxtp route={selectedRoute} updateRoute={(route: any) => updateRoute(route, selectedRouteIndex ?? 0)}></SwappingNxtp>
        </Modal>
      }
    </Content>
  )
}

export default SwapNxtp
