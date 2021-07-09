// LIBS
import { SwapOutlined, SyncOutlined, LoginOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Input, Modal, Row, Select, Steps, Image } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import Title from 'antd/lib/typography/Title';
import axios, { CancelTokenSource } from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { loadTokenListAsTokens } from '../services/tokenListService';
import { formatTokenAmount, formatTokenAmountOnly } from '../services/utils';
import { ChainKey, ChainPortfolio, Token } from '../types';
import { defaultTokens, getChainByKey } from '../types/lists';
import { DepositAction, TranferStep, WithdrawAction } from '../types/server';
import './Swap.css';
import Swapping from './Swapping';
import heroImage from '../assets/swap-3chain-dexagg.png';
import { getBalancesForWallet } from '../services/balanceService';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { injected } from './web3/connectors';
import { RefSelectProps } from 'antd/lib/select';

const transferChains = [
  getChainByKey(ChainKey.POL),
  getChainByKey(ChainKey.BSC),
  getChainByKey(ChainKey.DAI),
]

interface TokenWithAmounts extends Token {
  amount?: number
  amountRendered?: string
}
let source: CancelTokenSource | undefined = undefined

const Swap = () => {
  const [stateUpdate, setStateUpdate] = useState<number>(0)
  const [routes, setRoutes] = useState<Array<Array<TranferStep>>>([])
  const [routesLoading, setRoutesLoading] = useState<boolean>(false)
  const [noRoutesAvailable, setNoRoutesAvailable] = useState<boolean>(false)
  const [selectedRoute, setselectedRoute] = useState<Array<TranferStep>>([]);
  const [selectedRouteIndex, setselectedRouteIndex] = useState<number>();
  const [depositChain, setDepositChain] = useState<ChainKey>(ChainKey.POL);
  const [depositAmount, setDepositAmount] = useState<number>(1);
  const [depositToken, setDepositToken] = useState<string | undefined>(); // tokenId
  const depositSelectRef = useRef<RefSelectProps>()
  const [withdrawChain, setWithdrawChain] = useState<ChainKey>(ChainKey.DAI);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(Infinity);
  const [withdrawToken, setWithdrawToken] = useState<string | undefined>(); // tokenId
  const withdrawSelectRef = useRef<RefSelectProps>()
  const [tokens, setTokens] = useState<{ [ChainKey: string]: Array<TokenWithAmounts> }>(defaultTokens)
  const [refreshTokens, setRefreshTokens] = useState<boolean>(true)
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
  const [balances, setBalances] = useState<{ [ChainKey: string]: Array<ChainPortfolio> }>()
  const [refreshBalances, setRefreshBalances] = useState<boolean>(true)

  // Wallet
  const web3 = useWeb3React<Web3Provider>()
  const { activate } = useWeb3React();

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
      } else {
        return '0.0'
      }
    }
  }

  useEffect(() => {
    if (refreshTokens) {
      setRefreshTokens(false)

      transferChains.map(async (chain) => {
        const newTokens = {
          [chain.key]: (await loadTokenListAsTokens(chain.id))
        }
        setTokens(tokens => Object.assign(tokens, newTokens))
        setStateUpdate(stateUpdate => stateUpdate + 1)
      })
    }
  }, [refreshTokens])

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

  const hasSufficientBalance = () => {
    if (!depositToken) {
      return true
    }
    return depositAmount <= getBalance(depositChain, depositToken)
  }

  const onChangeDepositChain = (chainKey: ChainKey) => {
    setDepositToken(undefined) // TODO: check if same coin is available on new chain
    setDepositChain(chainKey)
  }

  const onChangeWithdrawChain = (chainKey: ChainKey) => {
    setWithdrawToken(undefined) // TODO: check if same coin is available on new chain
    setWithdrawChain(chainKey)
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
      const deposit: DepositAction = {
        type: 'deposit',
        chainKey: depositChain,
        chainId: getChainByKey(depositChain).id,
        token: dToken,
        amount: depositAmount ? Math.floor(depositAmount * (10 ** dToken.decimals)) : Infinity
      }

      const wToken = findToken(withdrawChain, withdrawToken)
      const withdraw: WithdrawAction = {
        type: 'withdraw',
        chainKey: withdrawChain,
        chainId: getChainByKey(withdrawChain).id,
        token: wToken,
        amount: withdrawAmount ? Math.floor(withdrawAmount * (10 ** wToken.decimals)) : Infinity
      }

      // cancel previously running requests
      if (source) {
        source.cancel('cancel for new request')
      }
      source = axios.CancelToken.source()
      const cancelToken = source.token
      const config = {
        cancelToken
      }

      try {
        const result = await axios.post(process.env.REACT_APP_API_URL + 'transfer', { deposit, withdraw }, config)

        // remove swaps with native coins
        const filteredRoutes: Array<Array<TranferStep>> = result.data.filter((path: Array<TranferStep>) => {
          for (const step of path) {
            if (step.action.type === 'swap') {
              if (step.action.fromToken.id === '0x0000000000000000000000000000000000000000' || step.action.toToken.id === '0x0000000000000000000000000000000000000000') {
                return false
              }
            }
          }
          return true
        })

        // sortedRoutes
        const sortedRoutes = filteredRoutes.sort((routeA, routeB) => {
          const routeAResult = routeA[routeA.length - 1].estimate?.toAmount || 0
          const routeBResult = routeB[routeB.length - 1].estimate?.toAmount || 0

          return routeBResult - routeAResult
        })

        setRoutes(sortedRoutes)
        setHighlightedIndex(filteredRoutes.length === 0 ? -1 : 0)
        setNoRoutesAvailable(filteredRoutes.length === 0)
        setRoutesLoading(false)
      } catch (err) {
        // check if it we are still loading a new request
        if (!axios.isCancel(err)) {
          setNoRoutesAvailable(true)
          setRoutesLoading(false)
        }
      } finally {
        source = undefined
      }
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
    <Content className="site-layout" style={{minHeight: 'calc(100vh - 64px)'}}>
      <div className="swap-view" style={{ minHeight: '900px', maxWidth: 1600, margin: 'auto' }}>

        {/* Hero Image */}
        <Row style={{ width: '80%', margin: '24px auto 0',transition: 'opacity 200ms', opacity: routes.length ? 0.3 : 1 }} justify={'center'}>
          <Image
            className="hero-image"
            src={heroImage}
          />
        </Row>

        {/* Swap Form */}
        <Row style={{margin: 20}} justify={"center"} className="swap-form">
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
                    />
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
                    />
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
                                />
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
                                />
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
                    />
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
                    />
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
                                />
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
                                />
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
          <Swapping route={selectedRoute} updateRoute={(route: any) => updateRoute(route, selectedRouteIndex ?? 0)}></Swapping>
        </Modal>
      }
    </Content>
  )
}

export default Swap
