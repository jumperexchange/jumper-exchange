// LIBS
import { SwapOutlined } from '@ant-design/icons';
import { Col, InputNumber, Row, Select, Steps, Avatar, Button } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import React, { useState } from 'react';
// OWN STUFF
import { ChainKey, Coin, CoinKey, ProgressStep } from '../types';
const { Step } = Steps;
const { Option } = Select;

const chainNames = {
  [ChainKey.ETH] : 'Ethereum Mainnet',
  [ChainKey.POL] : 'Polygon Mainnet',
  [ChainKey.BSC] : 'BSC Mainnet',
  [ChainKey.DAI] : 'xDai Mainnet',
  [ChainKey.OKT] : 'OKExChain Mainnet',
  [ChainKey.FTM] : 'FTM Mainnet'
}

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

const stepList: Array<ProgressStep> = [
  {
    title:"Deposit Tokens",
    description: "description"
  },
  {
    title:"Swapping Chains",
    description: "description"
  },
  {
    title:"Withdrawing tokens",
    description: "description"
  }
]

const Swap = () => {
  const [progress, setProgress] = useState<Array<ProgressStep>>(stepList)
  const [currentProgress, setCurrentProgress] = useState<number>(0)
  const [value, setValue] = useState<string | number>('99');


  function handleChange(value: string) {
    console.log(`selected ${value}`);
  }

  return (
    <Content className="site-layout">
    <div className="site-layout-background" style={{ paddingTop:32, minHeight: 'calc(100vh - 64px)' }}>

      <div style={{border:"2px solid #F0F0F0", borderRadius: 20, padding: 24, width:"50vw", margin: "32px auto"}}>
        <Row style={{marginBottom: 16}} justify={"center"}>
          <Row justify={"space-between"} style={{ padding : 24 }}>
              <Col >
                From:
                <Select style={{width: 150}} placeholder="select chain" onChange={handleChange} bordered={false}>
                  {Object.values(chainNames).map((name:string) => (<Option value={name}>{name}</Option>))}
                </Select>
              </Col>
              <Col>
                <InputNumber<string>
                  style={{ width: 200, borderBottom: "1px solid #ededed" }}
                  defaultValue="0"
                  min="0"
                  max="10"
                  step="0.001"
                  onChange={setValue}
                  bordered={false}
                  stringMode
                />

                <Select
                  placeholder="select coin"
                  onChange={handleChange}
                  optionLabelProp="label"
                  bordered={false}
                  style={{minWidth: 100}}
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
              </Col>
            </Row> 
        </Row>

        <Row style={{marginBottom: 16}} justify={"center"} >
          <SwapOutlined />
        </Row>

        <Row style={{marginBottom: 32}} justify={"space-around"}>
          <Row justify={"space-between"} style={{  borderRadius: 20, padding : 24 }}>
              <Col >
                To:
                <Select placeholder="select chain" onChange={handleChange} bordered={false}>
                  {Object.values(chainNames).map((name:string) => (<Option value={name}>{name}</Option>))}
                </Select>
              </Col>
              <Col>
                <InputNumber<string>
                  style={{ width: 200, borderBottom: "1px solid #ededed",  }}
                  defaultValue="0"
                  min="0"
                  max="10"
                  step="0.001"
                  onChange={setValue}
                  bordered={false}
                  stringMode
                />

                <Select
                  placeholder="select coin"
                  onChange={handleChange}
                  optionLabelProp="label"
                  bordered={false}
                  style={{minWidth: 100}}
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
              </Col>
            </Row>
        </Row>
        
        <Row justify={"center"} style={{marginBottom: 16}}>
          <Button type="primary" shape="round" icon={<SwapOutlined />} size={"large"}>Swap</Button>
        </Row>

      </div>

      

         




      <Row justify={"center"}>  
          <Steps direction="horizontal" progressDot current={currentProgress}>
            {
              progress.map(step => (<Step title={step.title} description={step.description} />))
            }
          </Steps>
      </Row>
    </div>  
    </Content>
  )
}

export default Swap
