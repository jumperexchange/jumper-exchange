// LIBS
import { SwapOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Input, Row, Select, Steps } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import Title from 'antd/lib/typography/Title';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
// OWN STUFF
import { ProgressStep } from '../types';
import { defaultCoins, supportedChains } from '../types/lists';
import { TranferStep } from '../types/server';
import './Swap.css';

const chainInfo = supportedChains.filter(chain => chain.visible)
const coins = defaultCoins

const Swap = () => {
  const [routes, setRoutes] = useState<Array<Array<ProgressStep>>>([])
  const [depositChain, setDepositChain] = useState<string>("");
  const [depositAmount, setDepositAmount] = useState<number>(Infinity);
  const [depositToken, setDepositToken] = useState<string>("");
  const [withdrawChain, setWithdrawChain] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState<number>(Infinity);
  const [withdrawToken, setWithdrawToken] = useState<string>("");

  const parseToProgressSteps = (routes: Array<Array<TranferStep>>) => {
    if (!routes.length) {
      return setRoutes([])
    }

    const routeOptions: Array<Array<ProgressStep>> = []
    routes.forEach(route => {
      const stepList: Array<ProgressStep> = route.map(step => {
        let title: string = ""
        let description: string = ""
        switch (step.action.type) {
          case "swap":
            title = "Swap Tokens"
            description = `${step.estimate?.fromAmount.toFixed(4)} ${step.action.fromToken.symbol} for ${step.estimate?.toAmount.toFixed(4)} ${step.action.toToken.symbol} on ${step.action.chainKey}`
            break;
          case "cross":
            title = "Cross Chains"
            description = `${step.estimate?.fromAmount.toFixed(4)} ${step.action.token.symbol} on ${step.action.chainKey} to ${step.estimate?.toAmount.toFixed(4)} ${step.action.token.symbol} ${step.action.toChainKey}`
            break;
          case "withdraw":
            title = "Withdraw"
            description = `${step.estimate?.toAmount} ${step.action.token.symbol} to 0x...`
            break;
          case "deposit":
            title = "Deposit"
            description = `${step.estimate?.fromAmount.toFixed(4)} ${step.action.token.symbol} from 0x...`
            break;
        }

        return { title, description }
      });
      routeOptions.push(stepList)
    })

    setRoutes(routeOptions)
  }

  const getTransferRoutes = async () => {
    if ((isFinite(depositAmount) || isFinite(withdrawAmount)) && depositChain !== "" && depositToken !== "" && withdrawChain !== "" && withdrawToken !== "") {
      const deposit = {
        type: "deposit",
        chainKey: depositChain,
        token: { symbol: depositToken },
        amount: depositAmount ? depositAmount : Infinity
      }
      const withdraw = {
        type: "withdraw",
        chainKey: withdrawChain,
        token: { symbol: withdrawToken },
        amount: withdrawAmount ? withdrawAmount : Infinity
      }
      const result = await axios.post("http://localhost:8000/api/transfer", { deposit, withdraw })
      parseToProgressSteps(result.data)
    } else {
      parseToProgressSteps([])
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


  return (
    <Content className="site-layout">
      <div className="swap-view" style={{ padding: 24, paddingTop: 64, minHeight: 'calc(100vh - 64px)' }}>
        <Row gutter={[32, 16]} justify={"center"}>

          {/* Swap Form */}
          <Col>
            <div className="swap-input" style={{ width: 500, border: "2px solid #f0f0f0", borderRadius: 20, padding: 24, margin: "0 auto" }}>
              <Row style={{ marginBottom: 32, paddingTop: 32 }}>
                <Title style={{ margin: "0 auto" }} level={4} type="secondary">Please Specify A Transaction</Title>
              </Row>

              <Row style={{ marginBottom: 32, paddingTop: 24 }} justify={"center"}>
                <Col>
                  <Input.Group compact style={{ border: "1px solid #f0f0f0", padding: 16, borderRadius: 24 }}>
                    <Select
                      style={{ width: 150 }}
                      placeholder="select chain"
                      onChange={((v: string) => setDepositChain(v))}
                      bordered={false}
                    >
                      {chainInfo.map(chain => (
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
                      onChange={((v: string) => setDepositToken(v))}
                      optionLabelProp="label"
                      bordered={false}
                      style={{ width: 100 }}
                      dropdownStyle={{ minWidth: 100 }}
                    >
                      {coins.map(coin => (
                        <Select.Option key={coin.key} value={coin.key} label={coin.key}>
                          <div className="demo-option-label-item">
                            <span role="img" aria-label={coin.key}>
                              <Avatar
                                size="small"
                                src={coin.img_url}
                                alt={coin.name}
                              />
                            </span>
                            {` ${coin.name}`}
                          </div>
                        </Select.Option>
                      ))}
                    </Select>
                  </Input.Group>
                </Col>
              </Row>

              <Row style={{ marginBottom: 32 }} justify={"center"} >
                <SwapOutlined />
              </Row>

              <Row style={{ marginBottom: 32 }} justify={"center"}>
                <Col>
                  <Input.Group compact style={{ border: "1px solid #f0f0f0", padding: 16, borderRadius: 24 }}>
                    <Select
                      style={{ width: 150 }}
                      placeholder="select chain"
                      onChange={((v: string) => setWithdrawChain(v))}
                      bordered={false}
                    >
                      {chainInfo.map(chain => (
                        <Select.Option key={chain.key} value={chain.key}>{chain.name}</Select.Option>
                      ))}
                    </Select>
                    <Input
                      style={{ width: 100, textAlign: "right" }}
                      type="number"
                      defaultValue={0.0}
                      min={0}
                      max={10}
                      value={isFinite(withdrawAmount) ? withdrawAmount : ''}
                      onChange={((event) => onChangeWithdrawAmount(formatAmountInput(event)))}
                      placeholder="0.0"
                      bordered={false}
                    />
                    <Select
                      placeholder="select coin"
                      onChange={((v: string) => setWithdrawToken(v))}
                      optionLabelProp="label"
                      bordered={false}
                      style={{ width: 100 }}
                      dropdownStyle={{ minWidth: 100 }}
                    >
                      {coins.map(coin => (
                        <Select.Option key={coin.key} value={coin.key} label={coin.key}>
                          <div className="demo-option-label-item">
                            <span role="img" aria-label={coin.key}>
                              <Avatar
                                size="small"
                                src={coin.img_url}
                                alt={coin.name}
                              />
                            </span>
                            {` ${coin.name}`}
                          </div>
                        </Select.Option>
                      ))}
                    </Select>
                  </Input.Group>
                </Col>
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

          {/* Routes */}
          {routes.length > 0 &&
            <Col>
              <Row gutter={[32, 62]} justify={"space-between"} className="swap-routes" style={{ width: "65vw", border: "2px solid #f0f0f0", borderRadius: 20, padding: 24 }}>
                {
                  routes.map((route, index) =>
                    <Col key={index}>
                      <Steps progressDot size="small" direction="vertical" className="progress-step-list">
                        {
                          route.map(step =>
                            <Steps.Step key={step.title} title={step.title} description={step.description}></Steps.Step>
                          )
                        }
                      </Steps>
                      <Row justify={"start"} style={{ margin: 16 }}>
                        <Button shape="round" icon={<SwapOutlined />} size={"large"}>Swap</Button>
                      </Row>
                    </Col>
                  )
                }
              </Row>
            </Col>
          }
        </Row>
      </div>
    </Content>
  )
}

export default Swap
