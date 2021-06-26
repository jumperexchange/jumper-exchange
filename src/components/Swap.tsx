// CSS
import './Swap.css'
// LIBS
import { SwapOutlined } from '@ant-design/icons';
import { Col, Row, Select, Steps, Avatar, Button, Input } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
// OWN STUFF
import { ChainKey, Coin, CoinKey, ProgressStep } from '../types';
import { TranferStep } from '../types/server';
import Title from 'antd/lib/typography/Title';

const { Step } = Steps;
const { Option } = Select;

const chainInfo  = [
  {
    key:ChainKey.ETH, 
    name: 'Ethereum Mainnet'
  },
  {
    key:ChainKey.POL, 
    name: 'Polygon Mainnet'
  },
  {
    key:ChainKey.BSC, 
    name: 'BSC Mainnet'
  },
  {
    key:ChainKey.DAI, 
    name: 'xDai Mainnet'
  },
  {
    key:ChainKey.OKT, 
    name: 'OKExChain Mainnet'
  },
  {
    key:ChainKey.FTM, 
    name: 'FTM Mainnet'
  },
]

const coins : Array<Coin> = [
  {
    key: CoinKey.ETH,
    name: CoinKey.ETH,
    img_url: 'https://zapper.fi/images/networks/ethereum/0x0000000000000000000000000000000000000000.png',
    contracts: {
      [ChainKey.ETH]: 'eth',
      [ChainKey.BSC]: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
      [ChainKey.POL]: '0xfd8ee443ab7be5b1522a1c020c097cff1ddc1209',
      [ChainKey.DAI]: '0xa5c7cb68cd81640d40c85b2e5ec9e4bb55be0214',
      [ChainKey.FTM]: '',
      [ChainKey.OKT]: '',
    },
  },
  {
    key: CoinKey.MATIC,
    name: CoinKey.MATIC,
    img_url: 'https://zapper.fi/images/networks/polygon/0x0000000000000000000000000000000000000000.png',
    contracts: {
      [ChainKey.ETH]: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
      [ChainKey.BSC]: '0xa90cb47c72f2c7e4411e781772735d9317d08dd4',
      [ChainKey.POL]: 'matic',
      [ChainKey.DAI]: '0x7122d7661c4564b7c6cd4878b06766489a6028a2',
      [ChainKey.FTM]: '',
      [ChainKey.OKT]: '',
    },
  },
  {
    key: CoinKey.BNB,
    name: CoinKey.BNB,
    img_url: 'https://zapper.fi/images/networks/binance-smart-chain/0x0000000000000000000000000000000000000000.png',
    contracts: {
      [ChainKey.ETH]: '0xb8c77482e45f1f44de1745f52c74426c631bdd52',
      [ChainKey.BSC]: 'bsc',
      [ChainKey.POL]: '0xa649325aa7c5093d12d6f98eb4378deae68ce23f',
      [ChainKey.DAI]: '0xca8d20f3e0144a72c6b5d576e9bd3fd8557e2b04',
      [ChainKey.FTM]: '',
      [ChainKey.OKT]: '',
    },
  },
  {
    key: CoinKey.DAI,
    name: CoinKey.DAI,
    img_url: 'https://zapper.fi/images/networks/ethereum/0x6b175474e89094c44da98b954eedeac495271d0f.png',
    contracts: {
      [ChainKey.ETH]: '0x6b175474e89094c44da98b954eedeac495271d0f',
      [ChainKey.BSC]: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
      [ChainKey.POL]: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
      [ChainKey.DAI]: 'xdai',
      [ChainKey.FTM]: '',
      [ChainKey.OKT]: '',
    },
  },
  {
    key: CoinKey.USDT,
    name: CoinKey.USDT,
    img_url: 'https://zapper.fi/images/networks/ethereum/0xdac17f958d2ee523a2206206994597c13d831ec7.png',
    contracts: {
      [ChainKey.ETH]: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      [ChainKey.BSC]: '0x55d398326f99059ff775485246999027b3197955',
      [ChainKey.POL]: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
      [ChainKey.DAI]: '0x4ecaba5870353805a9f068101a40e0f32ed605c6',
      [ChainKey.FTM]: '',
      [ChainKey.OKT]: '',
    },
  },
  {
    key: CoinKey.USDC,
    name: CoinKey.USDC,
    img_url: 'https://zapper.fi/images/networks/ethereum/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png',
    contracts: {
      [ChainKey.ETH]: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      [ChainKey.BSC]: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      [ChainKey.POL]: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
      [ChainKey.DAI]: '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83',
      [ChainKey.FTM]: '',
      [ChainKey.OKT]: '',
    },
  },
  {
    key: CoinKey.LINK,
    name: CoinKey.LINK,
    img_url: 'https://zapper.fi/images/networks/ethereum/0x514910771af9ca656af840dff83e8264ecf986ca.png',
    contracts: {
      [ChainKey.ETH]: '0x514910771af9ca656af840dff83e8264ecf986ca',
      [ChainKey.BSC]: '0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd',
      [ChainKey.POL]: '0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39',
      [ChainKey.DAI]: '0xE2e73A1c69ecF83F464EFCE6A5be353a37cA09b2',
      [ChainKey.FTM]: '',
      [ChainKey.OKT]: '',
    },
  },
  {
    key: CoinKey.UNI,
    name: CoinKey.UNI,
    img_url: 'https://zapper.fi/images/networks/ethereum/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984.png',
    contracts: {
      [ChainKey.ETH]: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
      [ChainKey.BSC]: '0xbf5140a22578168fd562dccf235e5d43a02ce9b1',
      [ChainKey.POL]: '0xb33EaAd8d922B1083446DC23f610c2567fB5180f',
      [ChainKey.DAI]: '0x4537e328Bf7e4eFA29D05CAeA260D7fE26af9D74',
      [ChainKey.FTM]: '',
      [ChainKey.OKT]: '',
    },
  },
  {
    key: CoinKey.AAVE,
    name: CoinKey.AAVE,
    img_url: 'https://zapper.fi/images/networks/ethereum/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.png',
    contracts: {
      [ChainKey.ETH]: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
      [ChainKey.BSC]: '0xfb6115445bff7b52feb98650c87f44907e58f802',
      [ChainKey.POL]: '0xd6df932a45c0f255f85145f286ea0b292b21c90b',
      [ChainKey.DAI]: '0xDF613aF6B44a31299E48131e9347F034347E2F00',
      [ChainKey.FTM]: '',
      [ChainKey.OKT]: '',
    },
  },
  {
    key: CoinKey.FTM,
    name: CoinKey.FTM,
    img_url: 'https://zapper.fi/images/networks/ethereum/0x4e15361fd6b4bb609fa63c81a2be19d873717870.png',
    contracts: {
      [ChainKey.ETH]: '',
      [ChainKey.BSC]: '',
      [ChainKey.POL]: '',
      [ChainKey.DAI]: '',
      [ChainKey.FTM]: 'ftm',
      [ChainKey.OKT]: '',
    },
  },
  {
    key: CoinKey.OKT,
    name: CoinKey.OKT,
    img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/8267.png',
    contracts: {
      [ChainKey.ETH]: '',
      [ChainKey.BSC]: '',
      [ChainKey.POL]: '',
      [ChainKey.DAI]: '',
      [ChainKey.FTM]: '',
      [ChainKey.OKT]: 'okt',
    },
  },

]


// const renderStep = (step: ProgressStep) => {
//   return (
//     <li>
//       <p className="progress-step-title">{step.title}</p>
//       <p className="progress-step-descripion">{step.description}</p>
//     </li>
//   )
// }

const Swap = () => {
  const [routes, setRoutes] = useState<Array<Array<ProgressStep>>>([[]])
  // const [currentProgress, setCurrentProgress] = useState<number>(0)
  const [depositChain, setDepositChain] = useState<string>("");
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [depositToken, setDepositToken] = useState<string>("");
  const [withdrawChain, setWithdrawChain] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [withdrawToken, setWithdrawToken] = useState<string>("");

  const parseToProgressSteps = (routes: Array<Array<TranferStep>>) => {
    console.log(routes)
    if (!routes.length) {
      return setRoutes([[]])
    }
    
    const routeOptions:  Array<Array<ProgressStep>>= []
    routes.forEach(route =>{
      const stepList: Array<ProgressStep> = route.map(step => {
        let title: string = ""
        let description: string = "" 
        switch (step.action.type){
          case "swap": 
            title = "Swap Tokens"
            description = `${step.action.fromAmount.toFixed(4)} ${step.action.fromToken.symbol} for ${step.estimate?.toAmount.toFixed(4)} ${step.action.toToken.symbol} on ${step.action.chainKey}`
            break;
          case "cross":
            title = "Cross Chains"
            description = `${step.estimate?.fromAmount.toFixed(4)} ${step.action.token.symbol} on ${step.action.chainKey} to ${step.action.toChainKey}`
            break;
          case "withdraw":
            title = "Withdraw"
            description = `${step.action.amount} ${step.action.token.symbol} to 0x...`
            break;
          case "deposit":
            title = "Deposit"
            description = `${step.action.amount.toFixed(4)} ${step.action.token.symbol} from 0x...`
            break;
        }
         
        return {title, description}
      });
      routeOptions.push(stepList)

    })
    

    setRoutes(routeOptions)

  }

  const getTransferRoutes = async () => {
    if(depositAmount !== 0 && depositChain !== "" && depositToken !== "" && withdrawChain !== "" && withdrawToken !== ""){
      const deposit = {
        type:"deposit",
        chainKey: depositChain,
        token: {symbol: depositToken},
        amount: depositAmount
      }
      const withdraw = {
        type: "withdraw",
        chainKey: withdrawChain, 
        token: {symbol: withdrawToken}, 
        amount: Infinity
      }
      const result = await axios.post("http://localhost:8000/api/transfer", {deposit, withdraw})
      parseToProgressSteps(result.data)
    }
  }

  useEffect(() => {
    getTransferRoutes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depositAmount, depositChain, depositToken, withdrawChain, withdrawToken])

  const formatAmountInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    return parseFloat(e.currentTarget.value)
  }


  return (
    <Content className="site-layout">
    <div className="swap-view" style={{ padding: 32, paddingTop: 64, minHeight: 'calc(100vh - 64px)' }}>
      <Row gutter={[32, 16]} justify={"center"}>
        <Col>
          <div className="swap-input" style={{ width: 500, border:"2px solid #f0f0f0", borderRadius: 20, padding: 24, margin: "0 auto"}}>
            <Row style={{marginBottom:32, paddingTop : 32}}>
              <Title style={{margin: "0 auto"}} level={4} type="secondary">Please Specify A Transaction</Title>
            </Row>

            <Row style={{marginBottom:32, paddingTop : 24}} justify={"center"}>
              <Col>
               <Input.Group compact style={{border: "1px solid #f0f0f0", padding: 16, borderRadius:24}}>
                    <Select style={{width: 150}} placeholder="select chain" onChange={((v:string) => setDepositChain(v))} bordered={false}>
                      {chainInfo.map(chain => (<Option value={chain.key}>{chain.name}</Option>))}
                    </Select>
                    <Input
                        style={{ width:100, textAlign: "right" }}
                        type="number"
                        defaultValue={0.0}
                        min={0}
                        max={10}
                        value={depositAmount}
                        onChange={((event) => setDepositAmount(formatAmountInput(event)))}
                        placeholder="0.0"
                        bordered={false}
                      />
                      <Select
                      placeholder="select coin"
                      onChange={((v:string) => setDepositToken(v))}
                      optionLabelProp="label"
                      bordered={false}
                      style={{width: 100}}
                      dropdownStyle={{minWidth: 100}}
                    >
                      {coins.map(coin => (
                        <Option value={coin.key} label={coin.key}>
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
                        </Option>
                      ))}
                    </Select>
                  </Input.Group>
            </Col>
            </Row>

            <Row style={{marginBottom: 32}} justify={"center"} >
              <SwapOutlined />
            </Row>

            <Row style={{marginBottom: 32}} justify={"center"}>
              <Col>
              <Input.Group style={{border: "1px solid #f0f0f0", padding: 16, borderRadius:24}}>
                  <Select style={{ width:150}} placeholder="select chain" onChange={((v:string) => setWithdrawChain(v))} bordered={false}>
                    {chainInfo.map(chain => (<Option value={chain.key}>{chain.name}</Option>))}
                  </Select>
                  <span style={{ width:100, display: "inline-block",textAlign: "right"  }}>{withdrawAmount}</span>
                  <Select
                      placeholder="select coin"
                      onChange={((v:string) => setWithdrawToken(v))}
                      optionLabelProp="label"
                      bordered={false}
                      style={{width: 100}}
                      dropdownStyle={{minWidth: 100}}
                    >
                      {coins.map(coin => (
                        <Option value={coin.key} label={coin.key}>
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
                        </Option>
                      ))}
                    </Select>
                </Input.Group>
            </Col>
            </Row>
            
            
              

          </div>
        </Col>
        <Col >
          <Row gutter={[32, 32]} justify={"space-between"} className="swap-routes" style={{ width: "65vw",  border:"2px solid #f0f0f0", borderRadius: 20, padding: 24, margin: "0 auto"  }}>
            {
              !routes[0].length
              ? <Title style={{margin: "0 auto"}} level={4} type="secondary">Please Specify A Transaction</Title>
              : routes.map(route =>
                <Col>
                  <Steps progressDot size="small" direction="vertical" className="progress-step-list">
                    {
                      // route.map(step=> renderStep(step))
                      route.map(step =>
                        <Step title={step.title} description={step.description}></Step>
                        )
                    }
                  </Steps>
                  <Row justify={"center"} style={{margin: "16px 0 16px 0"}}>
                    <Button type="primary" shape="round" icon={<SwapOutlined />} size={"large"}>Swap</Button>
                  </Row>
                </Col>
                )
            }
                        
          </Row>              
        </Col>


      </Row>

     

         




   
          
   
    </div>  
    </Content>
  )
}

export default Swap
