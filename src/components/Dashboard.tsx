//CSS
import "animate.css";
import './Dashboard.css';
//LIBS
import { Avatar, Button, Col, Input, Modal, Row, Skeleton, Table,  } from 'antd';
import { DeleteOutlined, SyncOutlined, WalletOutlined } from '@ant-design/icons';

import { Content } from 'antd/lib/layout/layout';
import React, { useEffect, useState } from 'react';
// OWN STUFF
import { getCoinsOnChain } from '../services/balanceService';
import { Amounts, ChainKey, CoinKey, ColomnType, DataType, Wallet, Coin, WalletSummary, SummaryAmounts } from '../types';
import { useWeb3React } from "@web3-react/core";
import ConnectButton from "./web3/ConnectButton";
import { ethers } from "ethers";
import { readWallets, storeWallets } from '../services/localStorage';


const coins : Array<Coin> = [
  {
    key: CoinKey.ETH,
    name: CoinKey.ETH,
    img_url: 'https://zapper.fi/images/networks/ethereum/0x0000000000000000000000000000000000000000.png',
  },
  {
    key: CoinKey.MATIC,
    name: CoinKey.MATIC,
    img_url: 'https://zapper.fi/images/networks/polygon/0x0000000000000000000000000000000000000000.png',
  },
  {
    key: CoinKey.BNB,
    name: CoinKey.BNB,
    img_url: 'https://zapper.fi/images/networks/binance-smart-chain/0x0000000000000000000000000000000000000000.png',
  },
  {
    key: CoinKey.DAI,
    name: CoinKey.DAI,
    img_url: 'https://zapper.fi/images/networks/ethereum/0x6b175474e89094c44da98b954eedeac495271d0f.png',
  },
  {
    key: CoinKey.USDT,
    name: CoinKey.USDT,
    img_url: 'https://zapper.fi/images/networks/ethereum/0xdac17f958d2ee523a2206206994597c13d831ec7.png',
  },
  {
    key: CoinKey.USDC,
    name: CoinKey.USDC,
    img_url: 'https://zapper.fi/images/networks/ethereum/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png',
  },
  {
    key: CoinKey.LINK,
    name: CoinKey.LINK,
    img_url: 'https://zapper.fi/images/networks/ethereum/0x514910771af9ca656af840dff83e8264ecf986ca.png',
  },
  {
    key: CoinKey.UNI,
    name: CoinKey.UNI,
    img_url: 'https://zapper.fi/images/networks/ethereum/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984.png',
  },
  {
    key: CoinKey.AAVE,
    name: CoinKey.AAVE,
    img_url: 'https://zapper.fi/images/networks/ethereum/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.png',
  },
  {
    key: CoinKey.FTM,
    name: CoinKey.FTM,
    img_url: 'https://zapper.fi/images/networks/ethereum/0x4e15361fd6b4bb609fa63c81a2be19d873717870.png',
  },
  {
    key: CoinKey.OKT,
    name: CoinKey.OKT,
    img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/8267.png',
  },

]

// individual render functions
function renderAmounts(amounts: Amounts = {amount_coin: -1, amount_usd: -1}) {
  if (amounts.amount_coin === -1) {
    // loading
    return (
      <div className="amounts">
        <div className="amount_coin">
          <Skeleton.Button style={{ width: 70}} active={true} size={'small'} shape={'round'} />
        </div>
        <div className="amount_usd">
          <Skeleton.Button style={{ width: 60, height: 18}} active={true} size={'small'} shape={'round'} />
        </div>
      </div>
    )
  } else if (amounts.amount_coin === 0) {
    // empty
    return (
      <div className="amounts amounts-empty">
        <div className="amount_coin">00.0000</div>
        <div className="amount_usd">00.00</div>
      </div>
    )
  } else {
    // default
    return (
      <div className={'amounts' + (amounts.amount_coin === 0 ? ' amounts-empty' : '') }>
        <div className="amount_coin">{amounts.amount_coin.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</div>
        <div className="amount_usd">{amounts.amount_usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</div>
      </div>
    )
  }
}

function renderCoin(coin: Coin) {
  return (
    <div className="coin">
      <Avatar
        src={coin.img_url}
        alt={coin.name}
      />
    </div>
  )
}

function renderSummary(summary: SummaryAmounts) {
  return (
    <div className="amounts">
      <div className="amount_coin">{summary.amount_usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</div>
      <div className="amount_usd">{summary.percentage_of_portfolio.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} % of portfolio</div>
    </div>
  )
}

const renderWalletColumnTitle = (address: string, syncHandler: Function, deleteHandler: Function) => {
  return (<Row>
        <Col span={12} offset={6}>
          {`${address.substr(0,4)}...${address.substr(-4,4)}`}
        </Col>
        <Col span={1} offset={4}>
          <SyncOutlined onClick={() => syncHandler()} />
        </Col>
        <Col span={1} offset={0}>
          <DeleteOutlined onClick={() => deleteHandler()} />
        </Col>
      </Row>
      )
    
  
}
//Helpers
const getSubPortfolioOfWallet = (wallet: Wallet, chain: ChainKey, coin: string) => {
  var subAmounts: Amounts = {
    amount_coin: 0.0,
    amount_usd: 0.0
  }
  for(var i = 0; i < wallet.portfolio[chain].length; i++) {
    if (wallet.portfolio[chain][i].id.toUpperCase() === coin) {
        subAmounts.amount_coin = wallet.portfolio[chain][i].amount
        subAmounts.amount_usd = wallet.portfolio[chain][i].amount * wallet.portfolio[chain][i].pricePerCoin
        break;
    }
  }
  return subAmounts
}
const baseWidth = 150;
const buildColumnForWallet = (address: string, syncHandler: Function, deleteHandler: Function) => {
  const walletColumn: ColomnType = {
    title: renderWalletColumnTitle(address, syncHandler, deleteHandler),
    dataIndex: address,
    children: [ // each chain
      {
        title: 'Ethereum',
        children: [{
          title: CoinKey.ETH,
          dataIndex: `${address}_${ChainKey.ETH}`,
          width: baseWidth,
          render: renderAmounts
        }]
      },
      {
        title: 'Polygon',
        children: [{
          title: CoinKey.MATIC,
          dataIndex: `${address}_${ChainKey.POL}`,
          width: baseWidth,
          render: renderAmounts
        }],
      },
      {
        title: 'Binance Smart Chain',
        children: [{
          title: CoinKey.BNB,
          dataIndex: `${address}_${ChainKey.BSC}`,
          width: baseWidth,
          render: renderAmounts
        }],
      },
      {
        title: 'xDai',
        children: [{
          title: CoinKey.DAI,
          dataIndex: `${address}_${ChainKey.DAI}`,
          width: baseWidth,
          render: renderAmounts
        }],
      },
      {
        title: 'Fantom',
        children: [{
          title: CoinKey.FTM,
          dataIndex: `${address}_${ChainKey.FTM}`,
          width: baseWidth,
          render: renderAmounts
        }],
      },
      {
        title: 'OKExCHain',
        children: [{
          title: CoinKey.OKT,
          dataIndex: `${address}_${ChainKey.OKT}`,
          width: baseWidth,
          render: renderAmounts
        }],
      },
    ],
  }
  return walletColumn
}

const coinColumn : ColomnType = {
  title: 'Coins',
  fixed: 'left',
  dataIndex: 'coin',
  render: renderCoin,
  width: 60,
}
const portfolioColumn : ColomnType = {
  title: 'Portfolio',
  width: baseWidth + 10,
  dataIndex: 'portfolio',
  render: renderAmounts
}

const addNewWalletColumn : ColomnType = {
  title: (
    <Button>
      Add Wallet
    </Button>
  ),
  dataIndex: '',
  width: 100,
}

const initialColumns = [
    coinColumn,
    portfolioColumn,
    buildColumnForWallet("0x", () => {}, () => {}),
    addNewWalletColumn
]
  
const initialRows: Array<DataType> = coins.map(coin => {
  return {
    key: coin.key,
    coin: coin as Coin,
    portfolio: {amount_coin:-1, amount_usd: -1},
    [`0x_${ChainKey.ETH}`]: {amount_coin:-1, amount_usd: -1},
    [`0x_${ChainKey.BSC}`]: {amount_coin:-1, amount_usd: -1},
    [`0x_${ChainKey.POL}`]: {amount_coin:-1, amount_usd: -1},
    [`0x_${ChainKey.DAI}`]: {amount_coin:-1, amount_usd: -1},
    [`0x_${ChainKey.FTM}`]: {amount_coin:-1, amount_usd: -1},
    [`0x_${ChainKey.OKT}`]: {amount_coin:-1, amount_usd: -1},
  }
})

const calculateWalletSummary = (wallet: Wallet) => {
  var summary:WalletSummary = {
    wallet: wallet.address,
    [ChainKey.ETH]: {amount_usd:0.0, percentage_of_portfolio: 0.0},
    [ChainKey.POL]: {amount_usd:0.0, percentage_of_portfolio: 0.0},
    [ChainKey.BSC]: {amount_usd:0.0, percentage_of_portfolio: 0.0},
    [ChainKey.DAI]: {amount_usd:0.0, percentage_of_portfolio: 0.0},
    [ChainKey.OKT]: {amount_usd:0.0, percentage_of_portfolio: 0.0},
    [ChainKey.FTM]: {amount_usd:0.0, percentage_of_portfolio: 0.0},
  };
  
  Object.values(ChainKey).forEach(chain => {
      wallet.portfolio[chain].map(portfolio => {
        summary[chain].amount_usd += portfolio.amount * portfolio.pricePerCoin;
        summary[chain].percentage_of_portfolio = 0.0
      })
    
  })
  return summary
}

// actual component
const NewDashboard = () => {

  const [registeredWallets, setRegisteredWallets] = useState<Array<Wallet>>(()=>{return readWallets()})
  const web3 = useWeb3React()
  const [columns, setColumns] = useState<Array<ColomnType>>(initialColumns)
  const [walletModalVisible, setWalletModalVisible] = useState(false);
  const [walletModalAddress, setWalletModalAddress] = useState('');
  const [walletModalLoading, setWalletModalLoading] = useState<boolean>(false)
  const [data, setData] = useState<Array<DataType>>(initialRows);
 
  const deleteWallet = (wallet: Wallet) => {
    const newWallets = registeredWallets.filter(item => item.address !== wallet.address)
    storeWallets(newWallets)
    setRegisteredWallets(newWallets)
  }
  
  const buildWalletColumns = () => {
    var walletColumns: Array<ColomnType> = []
    registeredWallets.forEach(wallet => {
      const col = buildColumnForWallet(wallet.address, () => updateWalletPortfolio(wallet), () => deleteWallet(wallet))
      walletColumns.push(col)
    })
    return walletColumns;
  }

  const buildColumns = (initialBuild: boolean = false) =>{
    const columns = [
      coinColumn,
      portfolioColumn,
    ]
    if(initialBuild){
      buildColumnForWallet("0x", () => {}, () => {})
    }else{
      buildWalletColumns().map(column => columns.push(column))
    }
    columns.push(addNewWalletColumn)
    return columns;
  }

    //builders
  const buildRows = () => {
    var generatedRows: Array<DataType> = []
    coins.forEach(coin => {
      // row object
      var coinRow : DataType = {
        key: coin.key,
        coin: coin as Coin,
        portfolio: {amount_coin:0.0, amount_usd: 0.0},
      }
      registeredWallets.forEach( wallet => {
        Object.values(ChainKey).forEach(chain => {
          const emptyAmounts: Amounts = {
            amount_coin: 0.0,
            amount_usd: 0.0
          }
          var cellContent: Amounts = wallet.portfolio[chain].some(e => e.id.toUpperCase() === coin.key) ? getSubPortfolioOfWallet(wallet, chain, coin.key) as Amounts: emptyAmounts
          coinRow[`${wallet.address}_${chain}`] = cellContent
          coinRow.portfolio.amount_coin += cellContent.amount_coin
          coinRow.portfolio.amount_usd += cellContent.amount_usd
        }); // for each chain
      }); // for each wallet
      generatedRows.push(coinRow)
    }) // for each coin
    return generatedRows
  }
  
  const updateWalletPortfolio = async (wallet: Wallet) => {
    wallet.loading = true
    for (const chain of Object.values(ChainKey)){
      const chainPortfolio = await getCoinsOnChain(wallet.address, chain)
      wallet.portfolio[chain] = [...chainPortfolio]
    }
    wallet.loading = false
    setRegisteredWallets(
      registeredWallets.map(old => 
        old.address === wallet.address 
          ? wallet 
          : old 
    ))  
    setColumns(buildColumns(false))
    setData(buildRows)
  }

  const  updateEntirePortfolio = () => {
    registeredWallets.forEach(async wallet => {
      await updateWalletPortfolio(wallet);
    })  
  }

  // on mount
  useEffect(() => {
    if(!registeredWallets.length){      
      setWalletModalVisible(true)
    } else {
      updateEntirePortfolio();
      setColumns(buildColumns(false));
      setData(buildRows)
    }
  }, [])

  useEffect( () => {
    if(!registeredWallets.length){
      setWalletModalVisible(true)
      setColumns(initialColumns);
      setData(initialRows)
    } else {
      updateEntirePortfolio()
      setColumns(buildColumns());
      setData(buildRows)
    }
  }, [registeredWallets.length])
  

  const addWallet = (address: string) => {
    const newWallet = {
      address: address,
      loading: true,
      portfolio:{
        [ChainKey.ETH]:[],
        [ChainKey.BSC]:[],
        [ChainKey.POL]:[],
        [ChainKey.DAI]:[],
        [ChainKey.FTM]:[],
        [ChainKey.OKT]:[]
      }
    }
    setRegisteredWallets([...registeredWallets, newWallet])
    storeWallets(registeredWallets)
  }


  // Add Wallet Modal Handlers
  const resolveEnsName = async (name : string) => {
    const ethereum = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL_MAINNET)
    return ethereum.resolveName(name)
  }

  const handleWalletModalAdd = async () => {
    setWalletModalLoading(true);
    let address = getModalAddressSuggestion();

    if (address.endsWith('.eth')) {
      address = await resolveEnsName(address) || ''
    }

    if (ethers.utils.isAddress(address)) {
      addWallet(address)
      setWalletModalVisible(false)
      setWalletModalAddress(' ')
    }
    setWalletModalLoading(false);
  };

  const handleWalletModalClose = () => {
    if (!registeredWallets.length) {
      setWalletModalVisible(true)
    }
  }

  const getModalAddressSuggestion = () => {
    const addedWallets = registeredWallets.map(wallet => wallet.address)
    const web3Account = (web3.account && addedWallets.indexOf(web3.account) === -1) ? web3.account : ''
    return walletModalAddress || web3Account;
  }


  const emptySummaryAmounts = {
    amount_usd: 0,
    percentage_of_portfolio: 0,
  }
  

  let summaryIndex = 0
  return (
    <Content className="site-layout">
      <div className="site-layout-background" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <Table
          columns={columns}
          dataSource={data}
          bordered
          size="middle"
          scroll={{ x: '1000px', y: 'calc(100vh - 277px)' }}
          pagination={false}

          summary = {() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
              <Table.Summary.Cell index={summaryIndex}>SUM</Table.Summary.Cell>
              <Table.Summary.Cell index={summaryIndex++}>{renderSummary(emptySummaryAmounts)}</Table.Summary.Cell>
              {
                registeredWallets.map((wallet:Wallet) => {
                  const summary = calculateWalletSummary(wallet);
                  return[
                    <Table.Summary.Cell index={summaryIndex++} key={`${wallet.address}_${ChainKey.ETH}`}>{renderSummary(summary[ChainKey.ETH])}</Table.Summary.Cell>,
                    <Table.Summary.Cell index={summaryIndex++} key={`${wallet.address}_${ChainKey.POL}`}>{renderSummary(summary[ChainKey.POL])}</Table.Summary.Cell>,
                    <Table.Summary.Cell index={summaryIndex++} key={`${wallet.address}_${ChainKey.BSC}`}>{renderSummary(summary[ChainKey.BSC])}</Table.Summary.Cell>,
                    <Table.Summary.Cell index={summaryIndex++} key={`${wallet.address}_${ChainKey.DAI}`}>{renderSummary(summary[ChainKey.DAI])}</Table.Summary.Cell>,
                    <Table.Summary.Cell index={summaryIndex++} key={`${wallet.address}_${ChainKey.FTM}`}>{renderSummary(summary[ChainKey.FTM])}</Table.Summary.Cell>,
                    <Table.Summary.Cell index={summaryIndex++} key={`${wallet.address}_${ChainKey.OKT}`}>{renderSummary(summary[ChainKey.OKT])}</Table.Summary.Cell>,
                  ]
                   
                  
                  
                })
              }
              </Table.Summary.Row>
            </Table.Summary>
          )}

        //   summary={() => (
        //     <Table.Summary fixed>
        //       <Table.Summary.Row>
        //         <Table.Summary.Cell index={summaryIndex}>SUM</Table.Summary.Cell>
        //         <Table.Summary.Cell index={summaryIndex++}>{renderSummary(summary.portfolio)}</Table.Summary.Cell>
        //         { wallets.map((wallet: Wallet) => wallet.chains.map((chainName: ChainKey) => (
        //           <Table.Summary.Cell index={summaryIndex++} key={wallet.key + chainName}>{renderSummary(summary[wallet.key][chainName])}</Table.Summary.Cell>
        //         )))}
        //         { wallets.length === 0 && Object.values(ChainKey).map(() => (
        //           <Table.Summary.Cell index={summaryIndex++} key={summaryIndex}></Table.Summary.Cell>
        //         ))}
        //         <Table.Summary.Cell index={summaryIndex++}></Table.Summary.Cell>
        //       </Table.Summary.Row>
        //     </Table.Summary>
        //   )
        // }
        />
      </div>


      <Modal 
        title = "Add Wallet"
        visible = {walletModalVisible}
        onOk={handleWalletModalAdd}
        onCancel={handleWalletModalClose}
        footer={[
          // only show close if other wallets have been added already
          registeredWallets.length === 0 ? (
            <Button key="back" onClick={handleWalletModalClose}>
              Close
            </Button>
          ) : '',
          <Button key="submit" type="primary" onClick={handleWalletModalAdd} disabled={walletModalLoading}>
            { walletModalLoading ? 'Loading' : 'Add' }
          </Button>,
      ]} 
      > 
       { !web3.account ? (<ConnectButton />) : (<Button style={{ display: 'block' }}>Connected with {web3.account.substr(0, 4)}...</Button>)}
        
        Enter a wallet address / ens domain:
        <Input 
          size="large" 
          placeholder="0x..." 
          prefix={<WalletOutlined />}
          value={getModalAddressSuggestion()}
          onChange={(event) => setWalletModalAddress(event.target.value)}
          disabled={walletModalLoading}
        />
      </Modal>
      </ Content>
  )
}



export default NewDashboard
