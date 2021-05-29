import { useWeb3React } from '@web3-react/core';
import { Avatar, Badge, Button, Modal, Skeleton, Table, Tooltip } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import React, { useEffect, useState } from 'react';
import { Amounts, ChainKey, Coin, ColomnType, DataType, Summary, Wallet, WalletAmounts, WalletKey } from '../types';
import './Dashboard.css';
import  '../services/balanceService'
import { getBNBAcrossChains, getDaiAcrossChains, getEthAcrossChains, getPolygonAcrossChains } from '../services/balanceService';

const ChainDetails = {
  [ChainKey.ETH]: {
    name: 'Ethereum',
    gasName: 'ETH',
  },
  [ChainKey.BSC]: {
    name: 'Binance Smart Chain',
    gasName: 'BNB',
  },
  [ChainKey.POL]: {
    name: 'Polygon',
    gasName: 'MATIC',
  },
  [ChainKey.DAI]: {
    name: 'xDai',
    gasName: 'DAI',
  },
}

const coins : Array<Coin> = [
  {
    key: 'ETH',
    name: 'ETH',
    img_url: 'https://zapper.fi/images/networks/ethereum/0x0000000000000000000000000000000000000000.png',
  },
  {
    key: 'MATIC',
    name: 'MATIC',
    img_url: 'https://zapper.fi/images/networks/polygon/0x0000000000000000000000000000000000000000.png',
  },
  {
    key: 'BNB',
    name: 'BNB',
    img_url: 'https://zapper.fi/images/networks/binance-smart-chain/0x0000000000000000000000000000000000000000.png',
  },
  {
    key: 'DAI',
    name: 'DAI',
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
          {coinName}: <Skeleton.Button style={{ width: 70}} active={true} size={'small'} shape={'round'} />
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
    title: `"${wallet.name}" ${wallet.address.substr(0,4)}...${wallet.address.substr(-4,4)}`,
    children
  }
}

const buildDataRow = (coin: any, wallets: Array<Wallet>) : DataType => {
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
    [WalletKey.WALLET1]: emptyWalletAmounts,
    [WalletKey.WALLET2]: emptyWalletAmounts,
    [WalletKey.WALLET3]: emptyWalletAmounts,
    [WalletKey.WALLET4]: emptyWalletAmounts,
  }

  return row
}

const buildDataRows = (coins: Array<any>, wallets: Array<Wallet>) : Array<DataType> => {
  return coins.map(coin => buildDataRow(coin, wallets))
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
  width: baseWidth,
  dataIndex: 'portfolio',
  render: renderAmounts,
}
const addColumn : ColomnType = {
  title: 'Add Wallet',
  dataIndex: '',
  width: 100,
}
const walletColumn: ColomnType = {
  title: '"Your Wallet" 0x99...XXXX',
  children: [
    {
      title: 'Ethereum',
      children: [{
        title: 'ETH',
        dataIndex: ['empty'],
        width: baseWidth,
      }]
    },
    {
      title: 'Polygon',
      children: [{
        title: 'MATIC',
        dataIndex: ['empty'],
        width: baseWidth,
      }],
    },
    {
      title: 'Binance Smart Chain',
      children: [{
        title: 'BNB',
        dataIndex: ['empty'],
        width: baseWidth,
      }],
    },
    {
      title: 'xDai',
      children: [{
        title: 'DAI',
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
const emptySummary : Summary = {
  portfolio: {
    amount_usd: 0,
    percentage_of_portfolio: 100,
  },
  [WalletKey.WALLET1]: {
    [ChainKey.ETH]: Object.assign({}, emptySummaryAmounts),
    [ChainKey.BSC]: Object.assign({}, emptySummaryAmounts),
    [ChainKey.POL]: Object.assign({}, emptySummaryAmounts),
    [ChainKey.DAI]: Object.assign({}, emptySummaryAmounts),
  },
  [WalletKey.WALLET2]: {
    [ChainKey.ETH]: Object.assign({}, emptySummaryAmounts),
    [ChainKey.BSC]: Object.assign({}, emptySummaryAmounts),
    [ChainKey.POL]: Object.assign({}, emptySummaryAmounts),
    [ChainKey.DAI]: Object.assign({}, emptySummaryAmounts),
  },
  [WalletKey.WALLET3]: {
    [ChainKey.ETH]: Object.assign({}, emptySummaryAmounts),
    [ChainKey.BSC]: Object.assign({}, emptySummaryAmounts),
    [ChainKey.POL]: Object.assign({}, emptySummaryAmounts),
    [ChainKey.DAI]: Object.assign({}, emptySummaryAmounts),
  },
  [WalletKey.WALLET4]: {
    [ChainKey.ETH]: Object.assign({}, emptySummaryAmounts),
    [ChainKey.BSC]: Object.assign({}, emptySummaryAmounts),
    [ChainKey.POL]: Object.assign({}, emptySummaryAmounts),
    [ChainKey.DAI]: Object.assign({}, emptySummaryAmounts),
  },
}

function deepClone(obj : any) {
  return JSON.parse(JSON.stringify(obj))
}

function Dashboard() {
  const [data, setData] = useState<Array<DataType>>([]);
  const [columns, setColumns] = useState<Array<ColomnType>>(baseColumns)
  const [summary, setSummary] = useState<Summary>(deepClone(emptySummary))
  const [wallets, setWallets] = useState<Array<Wallet>>([])

  const web3 = useWeb3React()

  // Setup
  useEffect(() => {
    const wallet1 : Wallet = {
      key: WalletKey.WALLET1,
      name: 'Personal Wallet',
      address: '0x12312312312312312312312sdfsdf3',
      chains: [
        ChainKey.ETH,
        ChainKey.BSC,
        ChainKey.POL,
        ChainKey.DAI,
      ]
    }
    const wallets = [
      wallet1,
    ]
    const data = buildDataRows(coins, wallets)
    setWallets(wallets)
    setData(data)
  }, [])

  // keep columns in sync
  useEffect(() => {
    const columns = [
      coinColumn,
      portfolioColumn,
      ...wallets.map(wallet => buildWalletColumn(data, wallet)),
      addColumn,
    ]
    setColumns(columns)
  }, [wallets, data])

  // keep Summary in sync
  useEffect(() => {
    // sum for each chain in each wallet
    const newSummary = data.reduce((summary : Summary, coin) => {
      wallets.forEach((wallet: Wallet) => {
        wallet.chains.forEach((chainName: ChainKey) => {
          if (coin[wallet.key][chainName].amount_usd !== -1) {
            summary[wallet.key][chainName].amount_usd += coin[wallet.key][chainName].amount_usd;
          }
        })
      })

      return summary
    }, deepClone(emptySummary))

    // total sum
    // TODO

    // calculate percentages
    // TODO

    // set new Summary
    setSummary(newSummary)
  }, [data, wallets])

  // keep Portfolio in sync
  // TODO


  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    if (web3.account && !loading) {
      setLoading(true)
      const updateAmounts = (walletKey : WalletKey, coinKey: string, amounts : any) => {
        setData(data.map(coin => {
          if (coin.key === coinKey && coin[walletKey]) {
            coin[walletKey].eth.amount_coin = amounts.onEth;
            coin[walletKey].bsc.amount_coin = amounts.onBsc;
            coin[walletKey].pol.amount_coin = amounts.onPolygon;
            coin[walletKey].dai.amount_coin = amounts.onXdai;
          }
          return coin
        }))
      }

      getEthAcrossChains(web3.account)
        .then((amounts : any) => {
          updateAmounts(WalletKey.WALLET1, 'ETH', amounts)
        })
        getDaiAcrossChains(web3.account)
        .then((amounts : any) => {
          updateAmounts(WalletKey.WALLET1, 'DAI', amounts)
        })
        getPolygonAcrossChains(web3.account)
        .then((amounts : any) => {
          updateAmounts(WalletKey.WALLET1, 'MATIC', amounts)
        })
        getBNBAcrossChains(web3.account)
        .then((amounts : any) => {
          updateAmounts(WalletKey.WALLET1, 'BNB', amounts)
        })
    }
  }, [web3, data, loading])

  // ACCESS
  const addWallet = () => {
    const wallet2 : Wallet = {
      key: WalletKey.WALLET2,
      name: 'Second Wallet',
      address: '0x42322341423423423',
      chains: [
        ChainKey.ETH,
        ChainKey.BSC,
        ChainKey.POL,
        ChainKey.DAI,
      ]
    }
    setWallets(prevItems => [...prevItems, wallet2]);
  }

  const removeWallet = () => {
    setWallets(wallets.filter(wallet => wallet.key !== WalletKey.WALLET2))
  }

  const updateData = () => {
    setData(data.map(coin => {
      if (coin.key === 'ETH' && coin.wallet1) {
        coin.wallet1.eth.amount_coin = 1
        coin.wallet1.eth.amount_usd = 1
      }
      return coin
    }))
  }

  let summaryIndex = 0
  return (
    <Content className="site-layout">
    <Button onClick={addWallet}>Add Wallet</Button>
      <Button onClick={removeWallet}>remove Wallet</Button>
      <Button onClick={updateData}>set Data</Button>

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
                <Table.Summary.Cell index={summaryIndex++}></Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </div>
    </Content>
  );
}

export default Dashboard;
