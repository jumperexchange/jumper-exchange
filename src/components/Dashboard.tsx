import { useWeb3React } from '@web3-react/core';
import { Avatar, Badge, Button, Col, Input, Modal, Row, Skeleton, Table, Tooltip } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import React, { useEffect, useState } from 'react';
import { Amounts, ChainKey, Coin, ColomnType, DataType, Summary, Wallet, WalletAmounts, WalletKey } from '../types';
import './Dashboard.css';
import  '../services/balanceService'
import { getBNBAcrossChains, getDaiAcrossChains, getEthAcrossChains, getPolygonAcrossChains } from '../services/balanceService';
import { DeleteOutlined, SyncOutlined, WalletOutlined } from '@ant-design/icons';
import ConnectButton from './web3/ConnectButton';
import { ethers } from 'ethers';

const COINS = {
  ETH: 'ETH',
  MATIC: 'MATIC',
  BNB: 'BNB',
  DAI: 'DAI',
}
const ChainDetails = {
  [ChainKey.ETH]: {
    name: 'Ethereum',
    gasName: COINS.ETH,
  },
  [ChainKey.BSC]: {
    name: 'Binance Smart Chain',
    gasName: COINS.BNB,
  },
  [ChainKey.POL]: {
    name: 'Polygon',
    gasName: COINS.MATIC,
  },
  [ChainKey.DAI]: {
    name: 'xDai',
    gasName: COINS.DAI,
  },
}

const coins : Array<Coin> = [
  {
    key: COINS.ETH,
    name: COINS.ETH,
    img_url: 'https://zapper.fi/images/networks/ethereum/0x0000000000000000000000000000000000000000.png',
  },
  {
    key: COINS.MATIC,
    name: COINS.MATIC,
    img_url: 'https://zapper.fi/images/networks/polygon/0x0000000000000000000000000000000000000000.png',
  },
  {
    key: COINS.BNB,
    name: COINS.BNB,
    img_url: 'https://zapper.fi/images/networks/binance-smart-chain/0x0000000000000000000000000000000000000000.png',
  },
  {
    key: COINS.DAI,
    name: COINS.DAI,
    img_url: 'https://zapper.fi/images/networks/ethereum/0x6b175474e89094c44da98b954eedeac495271d0f.png',
  }
]

// modals
const showGasModal = (gas: ChainKey) => {
  switch (gas) {
    case ChainKey.ETH:
      Modal.info({
        title: 'Gas Info for ethereum chain',
        content: (
          <div>
            You need to buy ETH.
          </div>
        )
      })
      break;
    case ChainKey.POL:
      Modal.info({
        title: 'Gas Info for Polygon/Matic chain',
        content: (
          <div>
            You need to buy MATIC.
          </div>
        )
      })
      break;
    case ChainKey.BSC:
      Modal.info({
        title: 'Gas Info for Binance Smart Chain',
        content: (
          <div>
            You need to buy BNB.
          </div>
        )
      })
      break;
    case ChainKey.DAI:
      Modal.info({
        title: 'Gas Info for xDAI chain',
        content: (
          <div>
            You can get some free DAI using those faucets. It should be enough to exchange or move your funds.
            <ul>
              <li><a href="https://xdai-app.herokuapp.com/faucet" target="_blank" rel="nofollow noreferrer">https://xdai-app.herokuapp.com/faucet</a></li>
              <li><a href="https://blockscout.com/xdai/mainnet/faucet" target="_blank" rel="nofollow noreferrer">https://blockscout.com/xdai/mainnet/faucet</a></li>
            </ul>
          </div>
        )
      })
      break;
  }
}

// render formatters
function renderGas(data: Array<DataType>, walletKey: WalletKey, chain: ChainKey, coinName: string) {
  const coin = data.find(coin => coin.coin.name === coinName)
  const wallet = coin && coin[walletKey]
  const amounts = wallet ? wallet[chain] : { amount_coin: 0 }

  const tooltipsEmpty = {
    [ChainKey.ETH]: (<>The Ethereum chain requires ETH to pay for gas. Without it you won't be able to do anything on this chain. <Button type="link" block onClick={() => showGasModal(ChainKey.ETH)}>Get ETH</Button></>),
    [ChainKey.POL]: (<>The Polygon/Matic chain requires MATIC to pay for gas. Without it you won't be able to do anything on this chain. <Button type="link" block onClick={() => showGasModal(ChainKey.POL)}>Get MATIC</Button></>),
    [ChainKey.BSC]: (<>The Binance Smart Chain requires BNB to pay for gas. Without it you won't be able to do anything on this chain. <Button type="link" block onClick={() => showGasModal(ChainKey.BSC)}>Get BNB</Button></>),
    [ChainKey.DAI]: (<>The xDAI chain requires DAI to pay for gas. Without it you won't be able to do anything on this chain. <Button type="link" block onClick={() => showGasModal(ChainKey.DAI)}>Get DAI</Button></>),
  }
  const tooltipEmpty = tooltipsEmpty[chain];
  const tooltips = {
    [ChainKey.ETH]: (<>The Ethereum chain requires ETH to pay for gas.</>),
    [ChainKey.POL]: (<>The Polygon/Matic chain requires MATIC to pay for gas.</>),
    [ChainKey.BSC]: (<>The Binance Smart Chain requires BNB to pay for gas.</>),
    [ChainKey.DAI]: (<>The xDAI chain requires DAI to pay for gas.</>),
  }
  const tooltip = tooltips[chain];
  return (
    <div className="gas">
      <div className="amount_coin">
        { amounts.amount_coin === -1 ? (
          <Tooltip title={tooltip}>
          {coinName}: <Skeleton.Button style={{ width: 60}} active={true} size={'small'} shape={'round'} />
        </Tooltip>
        ) : amounts.amount_coin === 0 ? (
          <Tooltip color="red" title={tooltipEmpty}>
            {coinName}: -
            <Badge size="small" count={'!'} offset={[5, -15]}/>
          </Tooltip>
        ) : (
          <Tooltip title={tooltip}>
            {coinName}: {amounts.amount_coin.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
          </Tooltip>
        )}
      </div>
    </div>
  )
}

function renderAmounts(amounts: Amounts) {
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

function renderSummary(summary: any) {
  return (
    <div className="amounts">
      <div className="amount_coin">{summary.amount_usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</div>
      <div className="amount_usd">{summary.percentage_of_portfolio.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} % of portfolio</div>
    </div>
  )
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

// builders


const buildDataRow = (coin: any) : DataType => {
  const emptyWalletAmounts : WalletAmounts = {
    [ChainKey.ETH]: {
      amount_coin: -1,
      amount_usd: -1,
    },
    [ChainKey.BSC]: {
      amount_coin: -1,
      amount_usd: -1,
    },
    [ChainKey.POL]: {
      amount_coin: -1,
      amount_usd: -1,
    },
    [ChainKey.DAI]: {
      amount_coin: -1,
      amount_usd: -1,
    },
  }

  const row = {
    key: coin.key,
    coin: coin,
    portfolio: {
      amount_coin: -1,
      amount_usd: -1,
    },
    [WalletKey.WALLET1]: deepClone(emptyWalletAmounts),
    [WalletKey.WALLET2]: deepClone(emptyWalletAmounts),
    [WalletKey.WALLET3]: deepClone(emptyWalletAmounts),
    [WalletKey.WALLET4]: deepClone(emptyWalletAmounts),
  }

  return row
}

const buildDataRows = (coins: Array<any>) : Array<DataType> => {
  return coins.map(coin => buildDataRow(coin))
}

// columns
const baseWidth = 150;
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
  render: renderAmounts,
}
const addColumn : ColomnType = {
  title: (
    <Button>
      Add Wallet
    </Button>
  ),
  dataIndex: '',
  width: 100,
}
const walletColumn: ColomnType = {
  title: 'No Wallet Connected',
  children: [
    {
      title: 'Ethereum',
      children: [{
        title: COINS.ETH,
        dataIndex: ['empty'],
        width: baseWidth,
      }]
    },
    {
      title: 'Polygon',
      children: [{
        title: COINS.MATIC,
        dataIndex: ['empty'],
        width: baseWidth,
      }],
    },
    {
      title: 'Binance Smart Chain',
      children: [{
        title: COINS.BNB,
        dataIndex: ['empty'],
        width: baseWidth,
      }],
    },
    {
      title: 'xDai',
      children: [{
        title: COINS.DAI,
        dataIndex: ['empty'],
        width: baseWidth,
      }],
    },
  ],
}
const baseColumns = [
  coinColumn,
  portfolioColumn,
  walletColumn,
  addColumn,
]

const emptySummaryAmounts = {
  amount_usd: 0,
  percentage_of_portfolio: 0,
}
const emptySummaryWallet = {
  [ChainKey.ETH]: emptySummaryAmounts,
  [ChainKey.BSC]: emptySummaryAmounts,
  [ChainKey.POL]: emptySummaryAmounts,
  [ChainKey.DAI]: emptySummaryAmounts,
}
const emptySummary : Summary = {
  portfolio: {
    amount_usd: 0,
    percentage_of_portfolio: 100,
  },
  [WalletKey.WALLET1]: emptySummaryWallet,
  [WalletKey.WALLET2]: emptySummaryWallet,
  [WalletKey.WALLET3]: emptySummaryWallet,
  [WalletKey.WALLET4]: emptySummaryWallet,
}

function deepClone(obj : any) {
  return JSON.parse(JSON.stringify(obj))
}

function Dashboard() {
  const [data, setData] = useState<Array<DataType>>(buildDataRows(coins));
  const [columns, setColumns] = useState<Array<ColomnType>>(baseColumns)
  const [summary, setSummary] = useState<Summary>(deepClone(emptySummary))
  const [wallets, setWallets] = useState<Array<Wallet>>([])
  const [walletModalVisible, setWalletModalVisible] = useState(false);
  const [walletModalAddress, setWalletModalAddress] = useState('');

  const web3 = useWeb3React()

  const updateAmounts = (walletKey : WalletKey, coinKey: string, amounts : any) => {
    setData(data.map(coin => {
      if (coin.key === coinKey && coin[walletKey]) {
        coin[walletKey].eth.amount_coin = amounts.onEth;
        coin[walletKey].eth.amount_usd = amounts.onEth; // debug
        coin[walletKey].bsc.amount_coin = amounts.onBsc;
        coin[walletKey].bsc.amount_usd = amounts.onBsc; // debug
        coin[walletKey].pol.amount_coin = amounts.onPolygon;
        coin[walletKey].pol.amount_usd = amounts.onPolygon; // debug
        coin[walletKey].dai.amount_coin = amounts.onXdai;
        coin[walletKey].dai.amount_usd = amounts.onXdai; // debug

        // sum portfolio
        coin.portfolio.amount_coin = 0;
        coin.portfolio.amount_usd = 0;
        Object.values(WalletKey).forEach((walletKey : WalletKey) => {
          Object.values(ChainKey).forEach((chainKey: ChainKey) => {
            if (coin[walletKey][chainKey].amount_coin > 0) {
              coin.portfolio.amount_coin += coin[walletKey][chainKey].amount_coin;
              coin.portfolio.amount_usd += coin[walletKey][chainKey].amount_usd;
            }
          })
        })
      }
      return coin
    }))
  }

  const updateWalletAmounts = (wallet: Wallet) => {
    getEthAcrossChains(wallet.address)
      .then((amounts : any) => {
        updateAmounts(wallet.key, COINS.ETH, amounts)
      })
    getDaiAcrossChains(wallet.address)
    .then((amounts : any) => {
      updateAmounts(wallet.key, COINS.DAI, amounts)
    })
    getPolygonAcrossChains(wallet.address)
    .then((amounts : any) => {
      updateAmounts(wallet.key, COINS.MATIC, amounts)
    })
    getBNBAcrossChains(wallet.address)
    .then((amounts : any) => {
      updateAmounts(wallet.key, COINS.BNB, amounts)
    })
  }

  // Automatically trigger update
  useEffect(() => {
    let changed = false
    const newWallets = wallets.map((wallet) => {
      if (!wallet.loading) {
        // trigger update if wallet is not already loading/loaded
        wallet.loading = true
        changed = true
        updateWalletAmounts(wallet)
      }
      return wallet
    })

    // only update wallets if at least one update was triggered
    if (changed) {
      setWallets(newWallets)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallets, data])

  const buildWalletColumn = (data: Array<DataType>, wallet : Wallet) => {
    const children : Array<ColomnType> = wallet.chains.map(chainKey => {
      return {
        title: ChainDetails[chainKey].name,
        children: [{
          title: renderGas(data, wallet.key, chainKey, ChainDetails[chainKey].gasName),
          dataIndex: [wallet.key, chainKey],
          width: baseWidth,
          render: renderAmounts,
        }]
      }
    })
  
    return {
      title: (
        <Row>
          <Col span={12} offset={6}>
            {`"${wallet.name}" ${wallet.address.substr(0,4)}...${wallet.address.substr(-4,4)}`}
          </Col>
          <Col span={1} offset={4}>
            <SyncOutlined onClick={() => triggerWalletUpdate(wallet)} />
          </Col>
          <Col span={1} offset={0}>
            <DeleteOutlined onClick={() => removeWallet(wallet)} />
          </Col>
  
          
        </Row>
      ),
      children
    }
  }

  // keep columns in sync
  useEffect(() => {
    const addColumn = {
      title: (
        <Button onClick={showWalletModal}>
          Add Wallet
        </Button>
      ),
      dataIndex: '',
      width: 100,
    }
    const walletColumns = wallets.length ? wallets.map(wallet => buildWalletColumn(data, wallet)) : [walletColumn]
    const columns = [
      coinColumn,
      portfolioColumn,
      ...walletColumns,
      addColumn,
    ]
    setColumns(columns)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallets, data])

  // keep Summary in sync
  useEffect(() => {
    // sum for each chain in each wallet
    const newSummary = data.reduce((summary : Summary, coin) => {
      wallets.forEach((wallet: Wallet) => {
        wallet.chains.forEach((chainName: ChainKey) => {
          if (coin[wallet.key][chainName].amount_usd !== -1) {
            summary[wallet.key][chainName].amount_usd += coin[wallet.key][chainName].amount_usd
          }
        })
      })

      return summary
    }, deepClone(emptySummary))

    // total sum
    newSummary.portfolio.amount_usd = 0;
    wallets.forEach((wallet: Wallet) => {
      wallet.chains.forEach((chainKey: ChainKey) => {
        newSummary.portfolio.amount_usd += newSummary[wallet.key][chainKey].amount_usd
      })
    })

    // calculate percentages
    wallets.forEach((wallet: Wallet) => {
      wallet.chains.forEach((chainKey: ChainKey) => {
        newSummary[wallet.key][chainKey].percentage_of_portfolio = newSummary[wallet.key][chainKey].amount_usd === 0
          ? 0
          : newSummary[wallet.key][chainKey].amount_usd / newSummary.portfolio.amount_usd * 100
      })
    })

    // set new Summary
    setSummary(newSummary)
  }, [data, wallets])

  // Setup first wallet
  // useEffect(() => {
  //   if (web3.account && !wallets.length) {
  //     const wallet : Wallet = {
  //       key: WalletKey.WALLET1,
  //       name: 'My Wallet',
  //       address: web3.account,
  //       chains: Object.values(ChainKey),
  //       loading: false,
  //     }
  //     setWallets(prevItems => [...prevItems, wallet]);
  //   }
  // }, [web3, wallets])

  



  const removeWallet = (wallet : Wallet) => {
    setWallets(wallets.filter(item => item.key !== wallet.key))
    // TODO: clear data of wallet + portfolio recalculation
  }

  const triggerWalletUpdate = (wallet : Wallet) => {
    // TODO: clear data of wallet

    setWallets(wallets.map((item : Wallet) => {
      if (item.key === wallet.key) {
        item.loading = false
      }
      return item
    }))
  }

  const findUnusedWalletKey = () : WalletKey => {
    for (const key of Object.values(WalletKey)) {
      if (!wallets.find((item : Wallet) => item.key === key)) {
        return key
      }
    }
    throw new Error('No more keys available')
  }

  const addWallet = (address : string) => {
    const wallet : Wallet = {
      key: findUnusedWalletKey(),
      name: 'My Wallet',
      address: address,
      chains: Object.values(ChainKey),
      loading: false,
    }
    setWallets(prevItems => [...prevItems, wallet]);
  }

  const showWalletModal = () => {
    setWalletModalVisible(true);
  };

  const getModalAddressSuggestion = () => {
    const addedWallets = wallets.map(wallet => wallet.address)
    const web3Account = (web3.account && addedWallets.indexOf(web3.account) === -1) ? web3.account : ''
    return walletModalAddress || web3Account;
  }

  const handleWalletModalAdd = () => {
    const address = getModalAddressSuggestion();
    if (ethers.utils.isAddress(address)) {
      addWallet(address)
      setWalletModalVisible(false)
      setWalletModalAddress('')
    }
  };

  const handleWalletModalClose = () => {
    if (wallets.length) {
      setWalletModalVisible(false)
    }
  }

  useEffect(() => {
    if (!wallets.length && !walletModalVisible) {
      setWalletModalVisible(true);
    }
  }, [wallets, walletModalVisible])


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
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={summaryIndex}>SUM</Table.Summary.Cell>
                <Table.Summary.Cell index={summaryIndex++}>{renderSummary(summary.portfolio)}</Table.Summary.Cell>
                { wallets.map((wallet: Wallet) => wallet.chains.map((chainName: ChainKey) => (
                  <Table.Summary.Cell index={summaryIndex++} key={wallet.key + chainName}>{renderSummary(summary[wallet.key][chainName])}</Table.Summary.Cell>
                )))}
                { wallets.length === 0 && Object.values(ChainKey).map(() => (
                  <Table.Summary.Cell index={summaryIndex++} key={summaryIndex}></Table.Summary.Cell>
                ))}
                <Table.Summary.Cell index={summaryIndex++}></Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </div>

      <Modal
        title="Add Wallet"
        visible={walletModalVisible}
        onOk={handleWalletModalAdd}
        onCancel={handleWalletModalClose}
        footer={[
            // only show close if other wallets have been added already
            wallets.length ? (
              <Button key="back" onClick={handleWalletModalClose}>
                Close
              </Button>
            ) : '',
            <Button key="submit" type="primary" onClick={handleWalletModalAdd}>
              Add
            </Button>,
        ]}
      >
        
        { !web3.account ? (<ConnectButton />) : (<Button style={{ display: 'block' }}>Connected with {web3.account.substr(0, 4)}...</Button>)}
        
        Enter a wallet address:
        <Input 
          size="large" 
          placeholder="0x..." 
          prefix={<WalletOutlined />}
          value={getModalAddressSuggestion()}
          onChange={(event) => setWalletModalAddress(event.target.value)}
        />

      </Modal>
    </Content>
  );
}

export default Dashboard;
