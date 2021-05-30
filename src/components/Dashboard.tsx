import { useWeb3React } from '@web3-react/core';
import { Avatar, Badge, Button, Modal, Skeleton, Table, Tooltip } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import React, { useEffect, useState } from 'react';
import { Amounts, ChainKey, Coin, ColomnType, DataType, Summary, Wallet, WalletAmounts, WalletKey, NetworkConfigs } from '../types';
import './Dashboard.css';
import  '../services/balanceService'
import { getBNBAcrossChains, getDaiAcrossChains, getEthAcrossChains, getPolygonAcrossChains } from '../services/balanceService';
import { WalletService } from '@unlock-protocol/unlock-js';
import { Paywall } from '@unlock-protocol/paywall';

(window as any).unlockProtocolConfig = {
  network: 4, // Network ID (1 is for mainnet, 4 for rinkeby... etc)
  locks: {
    '0x791E3D208ED611837bb84a632bC801DF2639eB0E': { // 0xabc is the address of a lock.
      name: 'One Year Premiun',
      network: 4 // you can customize the network for each lock
    }, 
  },
  icon: 'https://app.unlock-protocol.com/static/images/svg/default.svg', 
  callToAction: {
    default: 'This content is locked. Pay with cryptocurrency to access it!',
    expired: 'This is what is shown when the user had a key which is now expired',
    pending: 'This is the message shown when the user sent a transaction to purchase a key which has not be confirmed yet',
    confirmed: 'This is the message shown when the user has a confirmed key',
    noWallet: 'This is the message shown when the user does not have a crypto wallet which is required...',
  }
}


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
    [WalletKey.WALLET1]: deepClone(emptyWalletAmounts),
    [WalletKey.WALLET2]: deepClone(emptyWalletAmounts),
    [WalletKey.WALLET3]: deepClone(emptyWalletAmounts),
    [WalletKey.WALLET4]: deepClone(emptyWalletAmounts),
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
  width: baseWidth + 10,
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
  const LOCKED = 'locked'
  const UNLOCKED = 'unlocked'

  const [data, setData] = useState<Array<DataType>>([]);
  const [columns, setColumns] = useState<Array<ColomnType>>(baseColumns)
  const [summary, setSummary] = useState<Summary>(deepClone(emptySummary))
  const [wallets, setWallets] = useState<Array<Wallet>>([])
  const [paywall, setPaywall] = useState<any>()
  const [premiumUnlocked, setPremiumUnlocked] = useState(LOCKED)

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

    let unlockAppUrl
    const baseUrl = 'localhost' // Set at build time

    if (baseUrl.match('staging-paywall.unlock-protocol.com')) {
      unlockAppUrl = 'https://staging-app.unlock-protocol.com'
    } else if (baseUrl.match('paywall.unlock-protocol.com')) {
      unlockAppUrl = 'https://app.unlock-protocol.com'
    } else {
      unlockAppUrl = 'http://localhost:3000'
    }

    // Configure networks to use
    const networkConfigs: NetworkConfigs = {
      1: {
        readOnlyProvider:
          'https://eth-mainnet.alchemyapi.io/v2/b7Mxclz5hGyHqoeodGLQ17F5Qi97S7xJ',
        locksmithUri: 'https://locksmith.unlock-protocol.com',
        unlockAppUrl: unlockAppUrl,
      },
      4: {
        readOnlyProvider:
          'https://eth-rinkeby.alchemyapi.io/v2/n0NXRSZ9olpkJUPDLBC00Es75jaqysyT',
        locksmithUri: 'https://rinkeby.locksmith.unlock-protocol.com',
        unlockAppUrl: unlockAppUrl,
      },
      100: {
        readOnlyProvider: 'https://rpc.xdaichain.com/',
        locksmithUri: 'https://locksmith.unlock-protocol.com',
        unlockAppUrl: unlockAppUrl,
      },
      1337: {
        readOnlyProvider: 'http://127.0.0.1:8545',
        locksmithUri: 'http://127.0.0.1:8080',
        unlockAppUrl: unlockAppUrl,
      },
    }

    const paywall = new Paywall((window as any).unlockProtocolConfig, networkConfigs)

    /*const {
      getState,
      getUserAccountAddress,
      loadCheckoutModal,
      resetConfig,
    } = paywall
  
    setupUnlockProtocolVariable({
      loadCheckoutModal,
      resetConfig,
      getUserAccountAddress,
      getState,
    })*/

    setPaywall(paywall)

    window.addEventListener('unlockProtocol.authenticated', function(e : any) {
      // event.detail.addresss includes the address of the current user, when known
      console.log("authenticated event", e)
      setPremiumUnlocked(UNLOCKED)
    })

    window.addEventListener('unlockProtocol.transactionSent', function(e : any) {
      // event.detail.hash includes the hash of the transaction sent
      console.log("transaction sent event", e)
    })

    window.addEventListener('unlockProtocol.status', function(e : any) {
      const state = e.detail.state
      setPremiumUnlocked(state)

      console.log("status changed event", e)
      // the state is a string whose value can either be 'unlocked' or 'locked'...
      // If state is 'unlocked': implement code here which will be triggered when 
      // the current visitor has a valid lock key  
      // If state is 'locked': implement code here which will be
      // triggered when the current visitor does not have a valid lock key
    })

    setWallets(wallets)
    setData(data)
  }, [])

  const callCheckoutModal = () => {
    if (paywall) {
      console.log("Load checkout modal", paywall)
      paywall.loadCheckoutModal()
    }else{
      console.log("There's no unlockProtocol")
    }
  }

  const checkPremium = () => {
    if (premiumUnlocked == LOCKED) {
      callCheckoutModal()
      return false;  
    }
    return true;
  }

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

  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    if (web3.account && !loading) {
      setLoading(true)
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
            [WalletKey.WALLET1, WalletKey.WALLET2, WalletKey.WALLET3, WalletKey.WALLET4].forEach((walletKey : WalletKey) => {
              [ChainKey.ETH, ChainKey.BSC, ChainKey.POL, ChainKey.DAI].forEach((chainKey: ChainKey) => {
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

      getEthAcrossChains(web3.account)
        .then((amounts : any) => {
          updateAmounts(WalletKey.WALLET1, COINS.ETH, amounts)
        })
      getDaiAcrossChains(web3.account)
      .then((amounts : any) => {
        updateAmounts(WalletKey.WALLET1, COINS.DAI, amounts)
      })
      getPolygonAcrossChains(web3.account)
      .then((amounts : any) => {
        updateAmounts(WalletKey.WALLET1, COINS.MATIC, amounts)
      })
      getBNBAcrossChains(web3.account)
      .then((amounts : any) => {
        updateAmounts(WalletKey.WALLET1, COINS.BNB, amounts)
      })
    }
  }, [web3, data, loading])

  // ACCESS
  const addWallet = () => {
    if(checkPremium() === false){
      return;
    }
    /*
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
    setWallets(prevItems => [...prevItems, wallet2]);*/
  }

  const removeWallet = () => {
    setWallets(wallets.filter(wallet => wallet.key !== WalletKey.WALLET2))
  }

  const updateData = () => {
    setData(data.map(coin => {
      if (coin.key === COINS.ETH && coin.wallet1) {
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
      <Button onClick={() => setLoading(false)}>reload Amounts</Button>

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
