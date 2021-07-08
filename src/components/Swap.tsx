// LIBS
import { SwapOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Input, Modal, Row, Select, Steps, Image, Tooltip } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import Title from 'antd/lib/typography/Title';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { CountdownCircleTimer } from "react-countdown-circle-timer";
// CSS
import './Swap.css';
// TYPES
import { ChainKey, Token } from '../types';
import { defaultTokens, getChainByKey } from '../types/lists';
import { DepositAction, TranferStep, WithdrawAction } from '../types/server';
// SERVICES
import { formatTokenAmount, formatTokenAmountOnly } from '../services/utils';
import { loadTokenListAsTokens } from '../services/tokenListService';
// COMPONENTS
import Swapping from './Swapping';
import heroImage from '../assets/swap-3chain-dexagg.png';
import { truncateSync } from 'fs';

const transferChains = [
  getChainByKey(ChainKey.POL),
  getChainByKey(ChainKey.BSC),
  getChainByKey(ChainKey.DAI),
]

const Swap = () => {
  const [routes, setRoutes] = useState<Array<Array<TranferStep>>>([])
  const [routesLoading, setRoutesLoading] = useState<boolean>(false)
  const [noRoutesAvailable, setNoRoutesAvailable] = useState<boolean>(false)
  const [selectedRoute, setselectedRoute] = useState<Array<TranferStep>>([]);
  const [selectedRouteIndex, setselectedRouteIndex] = useState<number>();
  const [depositChain, setDepositChain] = useState<ChainKey>(ChainKey.BSC);
  const [depositAmount, setDepositAmount] = useState<number>(1);
  const [depositToken, setDepositToken] = useState<string|undefined>(); // tokenId
  const [withdrawChain, setWithdrawChain] = useState<ChainKey>(ChainKey.DAI);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(Infinity);
  const [withdrawToken, setWithdrawToken] = useState<string|undefined>(); // tokenId
  const [tokens, setTokens] = useState<{ [ChainKey: string]: Array<Token> }>(defaultTokens)
  const [refreshTokens, setRefreshTokens] = useState<boolean>(true)
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)


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

      const promises = transferChains.map(async (chain) => {
        const newTokens = {
          [chain.key]: (await loadTokenListAsTokens(chain.id))
        }
        setTokens(tokens => Object.assign(tokens, newTokens))
      })

      Promise.all(promises).then(() => {
        setDepositChain(ChainKey.POL)
      })
    }
  }, [refreshTokens])

  const onChangeDepositChain = (chainKey: ChainKey) => {
    setDepositToken(undefined) // TODO: check if same coin is available on new chain
    setDepositChain(chainKey)
  }

  const onChangeWithdrawChain = (chainKey: ChainKey) => {
    setWithdrawToken(undefined) // TODO: check if same coin is available on new chain
    setWithdrawChain(chainKey)
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

  const findeToken = (chainKey: ChainKey, tokenId: string) => {
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

    if ((isFinite(depositAmount) || isFinite(withdrawAmount)) && depositChain && depositToken && withdrawChain && withdrawToken) {
      setRoutesLoading(true)
      const dToken = findeToken(depositChain, depositToken)
      const deposit: DepositAction = {
        type: 'deposit',
        chainKey: depositChain,
        chainId: getChainByKey(depositChain).id,
        token: dToken,
        amount: depositAmount ? depositAmount * (10 ** dToken.decimals) : Infinity
      }

      const wToken = findeToken(withdrawChain, withdrawToken)
      const withdraw: WithdrawAction = {
        type: 'withdraw',
        chainKey: withdrawChain,
        chainId: getChainByKey(withdrawChain).id,
        token: wToken,
        amount: withdrawAmount ? withdrawAmount * (10 ** wToken.decimals) : Infinity
      }
      const result = await axios.post(process.env.REACT_APP_API_URL + 'transfer', { deposit, withdraw })

      // remove swaps with native coins
      const filteredRoutes : Array<Array<TranferStep>> = result.data.filter((path : Array<TranferStep>) => {
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

  const updateRoute = (route : any, index: number) => {
    const newRoutes = [
      ...routes.slice(0, index),
      route,
      ...routes.slice(index + 1)
    ]
    setRoutes(newRoutes)
  }

  return (
    <Content className="site-layout">
      <div className="swap-view" style={{ padding: 24, paddingTop: 24, minHeight: 'calc(100vh - 64px)', maxWidth: 1600, margin: 'auto' }}>

        {/* Hero Image */}
        <Row style={{width: '80%', margin: 'auto', opacity: routes.length ? 0.3 : 1}} justify={'center'}>
          <Image
            className="hero-image"
            src={heroImage}
          />
        </Row>

        {/* Swap Form */}
        <Row gutter={[32, 16]} justify={"center"} style={{marginTop: 36}}>
          <Col>
            <div className="swap-input" style={{ maxWidth: 500, border: "2px solid #f0f0f0", borderRadius: 6, padding: 24, margin: "0 auto" }}>
              <Row style={{ marginBottom: 32, paddingTop: 32 }}>
                <Title style={{ margin: '0 auto', color: '#1e1451' }} level={4} type="secondary">Please Specify Your Transaction</Title>
              </Row>

              <Row style={{ marginBottom: 32, paddingTop: 24 }} justify={"center"}>
                <Col>
                  <Input.Group compact style={{ border: "1px solid #f0f0f0", padding: 16, borderRadius: 6 }}>
                    <Select
                      style={{ width: 150 }}
                      placeholder="select chain"
                      value={depositChain}
                      onChange={((v: ChainKey) => onChangeDepositChain(v))}
                      bordered={false}
                    >
                      {transferChains.map(chain => (
                        <Select.Option key={chain.key} value={chain.key}>{chain.name}</Select.Option>
                      ))}
                    </Select>
                    <Input
                      style={{ width: 100, textAlign: "right" }}
                      type="number"
                      defaultValue={0.0}
                      min={0}
                      max={10}
                      value={isFinite(depositAmount) ? depositAmount : ''}
                      onChange={((event) => onChangeDepositAmount(formatAmountInput(event)))}
                      placeholder="0.0"
                      bordered={false}
                    />
                    <Select
                      placeholder="select coin"
                      value={depositToken}
                      onChange={((v) => setDepositToken(v))}
                      optionLabelProp="key"
                      bordered={false}
                      style={{ width: 100 }}
                      dropdownStyle={{ minWidth: 300 }}
                      showSearch
                      filterOption={(input, option) => {
                        return (option?.label as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }}
                    >
                      {tokens[depositChain].map(token => (
                        <Select.Option key={token.symbol} value={token.id} label={token.symbol + ' ' + token.name}>
                          <div className="demo-option-label-item">
                            <span role="img" aria-label={token.symbol}>
                              <Avatar
                                size="small"
                                src={token.logoURI}
                                alt={token.symbol}
                                style={{marginRight: 10}}
                              />
                            </span>
                            {token.symbol} - {token.name}
                          </div>
                        </Select.Option>
                      ))}
                    </Select>
                  </Input.Group>
                </Col>
              </Row>

              <Row style={{ marginBottom: 32 }} justify={"center"} >
                <SwapOutlined onClick={() => changeDirection()} />
              </Row>

              <Row style={{ marginBottom: 32 }} justify={"center"}>
                <Col>
                  <Input.Group compact style={{ border: "1px solid #f0f0f0", padding: 16, borderRadius: 6 }}>
                    <Select
                      style={{ width: 150 }}
                      placeholder="select chain"
                      value={withdrawChain}
                      onChange={((v: ChainKey) => onChangeWithdrawChain(v))}
                      bordered={false}
                    >
                      {transferChains.map(chain => (
                        <Select.Option key={chain.key} value={chain.key}>{chain.name}</Select.Option>
                      ))}
                    </Select>
                    <Input
                      style={{ width: 100, textAlign: "right" }}
                      type="number"
                      defaultValue={0.0}
                      min={0}
                      max={10}
                      disabled
                      onChange={((event) => onChangeWithdrawAmount(formatAmountInput(event)))}
                      value={ routesLoading? "0.0" : getSelectedWithdraw() }
                      placeholder="0.0"
                      bordered={false}
                    />
                    <Select
                      placeholder="Select coin"
                      value={withdrawToken}
                      onChange={((v) => setWithdrawToken(v))}
                      optionLabelProp="key"
                      bordered={false}
                      style={{ width: 100 }}
                      dropdownStyle={{ minWidth: 300 }}
                      showSearch
                      filterOption={(input, option) => {
                        return (option?.label as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }}
                    >
                      {tokens[withdrawChain].map(token => (
                        <Select.Option key={token.symbol} value={token.id} label={token.symbol + ' ' + token.name}>
                          <div className="demo-option-label-item">
                            <span role="img" aria-label={token.symbol}>
                              <Avatar
                                size="small"
                                src={token.logoURI}
                                alt={token.symbol}
                                style={{marginRight: 10}}
                              />
                            </span>
                            {token.symbol} - {token.name}
                          </div>
                        </Select.Option>
                      ))}
                    </Select>
                  </Input.Group>
                </Col>
              </Row>

              <Row justify={"center"}>
                <Button disabled={highlightedIndex === -1} shape="round" type="primary" icon={<SwapOutlined />} size={"large"} onClick={() => openSwapModal()}>
                  { routesLoading && 'Searching Routes...' }
                  { noRoutesAvailable && 'No Route Found' }
                  { !routesLoading && !noRoutesAvailable && 'Swap' }
                  </Button>
                  <br />
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
        <Row gutter={[32, 16]} justify={"center"} style={{marginTop: 48}}>
          {routes.length > 0 &&
            <Col>
              <h3 style={{textAlign: 'center'}}>
                Available routes (sorted by estimated withdraw)
              </h3>
              <Tooltip  style={{margin: "0 auto", textAlign: 'center'}} title="Auto Refresh Countdown">
                        <CountdownCircleTimer
                          onComplete={() => {
                            setRoutesLoading(true)
                            getTransferRoutes()
                            // repeat animation in 1.5 seconds
                          }}
                          isPlaying
                          size={30}
                          strokeWidth = {3}
                          duration={30}
                          trailColor="#ffffff"
                          colors={[["#47DAFE", 0.33], ["#5D97FE", 0.33], ["#A369FE", 0.33]]}
                        >
                        </CountdownCircleTimer>
                      </Tooltip>

              <div style={{ display: 'flex', flexDirection: 'row', overflowX: 'scroll' }}>
                {
                  routes.map((route, index) =>
                    <div
                      key={index}
                      className={'swap-route ' + (highlightedIndex === index ? 'optimal' : '')}
                      style={{padding: 24, paddingTop: 24, paddingBottom: 24}}
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
                        { highlightedIndex === index ? (
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
              <h3 style={{textAlign: 'center'}}>Loading...</h3>
              </Row>
            </Col>
          }
          {!routesLoading && noRoutesAvailable &&
            <Col>
              <h3 style={{textAlign: 'center'}}>No Route Found</h3>
            </Col>
          }
        </Row>

      </div>

      {!routesLoading &&
        <Modal
          visible={selectedRoute.length > 0}
          onOk={() => setselectedRoute([])}
          onCancel={() => setselectedRoute([])}
          width={700}
          footer={null}
        >
          <Swapping route={selectedRoute} updateRoute={(route : any) => updateRoute(route, selectedRouteIndex ?? 0)}></Swapping>
        </Modal>
      }
    </Content>
  )
}

export default Swap
