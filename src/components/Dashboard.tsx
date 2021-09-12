import { CheckCircleTwoTone, CloseCircleTwoTone, DeleteOutlined, SyncOutlined, WalletOutlined } from '@ant-design/icons';
import { useWeb3React } from "@web3-react/core";
import "animate.css";
import { Avatar, Badge, Button, Col, Input, Modal, Row, Skeleton, Table, Tooltip } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { ethers } from "ethers";
import React, { useEffect, useState } from 'react';
import { getBalancesForWallet } from '../services/balanceService';
import { readWallets, storeWallets } from '../services/localStorage';
import { Amounts, ChainKey, chainKeysToObject, ChainPortfolio, Coin, CoinKey, ColomnType, DataType, SummaryAmounts, Token, Wallet, WalletSummary } from '../types';
import { defaultCoins, supportedChains } from '../types/lists';
import './Dashboard.css';
import ConnectButton from "./web3/ConnectButton";

const emptySummaryAmounts = {
  amount_usd: 0,
  percentage_of_portfolio: 0,
}

const emptyWallet = {
  address: "0x..",
  loading: true,
  portfolio: chainKeysToObject([]),
}

let coins = defaultCoins

// individual render functions
function renderAmounts(amounts: Amounts = { amount_coin: -1, amount_usd: -1 }) {
  if (amounts.amount_coin === -1) {
    // loading
    return (
      <div className="amounts">
        <div className="amount_coin">
          <Skeleton.Button style={{ width: 70 }} active={true} size={'small'} shape={'round'} />
        </div>
        <div className="amount_usd">
          <Skeleton.Button style={{ width: 60, height: 18 }} active={true} size={'small'} shape={'round'} />
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
      <div className={'amounts' + (amounts.amount_coin === 0 ? ' amounts-empty' : '')}>
        <div className="amount_coin">{amounts.amount_coin.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</div>
        <div className="amount_usd">{amounts.amount_usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</div>
      </div>
    )
  }
}

function renderCoin(coin: Coin) {
  return (
    <div className="coin">
      <Tooltip title={coin.name + (coin.verified ? ' (verified)' : '')}>
        <Avatar
          src={coin.logoURI}
          alt={coin.name}
        >
          {coin.key}
        </Avatar>
        <Badge className="coin_verify" count={coin.verified ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <CloseCircleTwoTone twoToneColor="#eb2f96" />}></Badge>
      </Tooltip>
    </div>
  )
}

function renderSummary(summary: SummaryAmounts) {
  return (
    <div className="amounts">
      <div className="amount_coin">{summary.amount_usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</div>
      <div className="amount_usd">{(summary.percentage_of_portfolio * 100.0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} % of portfolio</div>
    </div>
  )
}

const showGasModal = (gas: ChainKey) => {
  switch (gas) {
    case ChainKey.ETH:
      Modal.info({
        title: 'Gas Info for ethereum chain',
        content: (
          <div>
            <p>Find out how to get ETH:</p>
            <a href="https://ethereum.org/en/get-eth/" target="_blank" rel="nofollow noreferrer">
              Where to buy ETH (by ethereum.org)
            </a>
          </div>
        )
      })
      break;
    case ChainKey.POL:
      Modal.info({
        title: 'Gas Info for Polygon/Matic chain',
        content: (
          <div>
            <p>You can get some free MATIC using those faucets. It should be enough to exchange or move your funds.</p>
            <ul>
              <li><a href="https://matic.supply/" target="_blank" rel="nofollow noreferrer">https://matic.supply/</a></li>
              <li><a href="https://macncheese.finance/matic-polygon-mainnet-faucet.php" target="_blank" rel="nofollow noreferrer">https://macncheese.finance/</a></li>
            </ul>
          </div>
        )
      })
      break;
    case ChainKey.BSC:
      Modal.info({
        title: 'Gas Info for Binance Smart Chain',
        content: (
          <div>
            <p>You need to buy BNB.</p>
            e.g. on <a href="https://www.binance.com/" target="_blank" rel="nofollow noreferrer">binance.com</a>
          </div>
        )
      })
      break;
    case ChainKey.DAI:
      Modal.info({
        title: 'Gas Info for xDAI chain',
        content: (
          <div>
            <p>You can get some free DAI using those faucets. It should be enough to exchange or move your funds.</p>
            <ul>
              <li><a href="https://xdai-faucet.top/" target="_blank" rel="nofollow noreferrer">https://xdai-faucet.top/</a></li>
              <li><a href="https://xdai-app.herokuapp.com/faucet" target="_blank" rel="nofollow noreferrer">https://xdai-app.herokuapp.com/faucet</a></li>
              <li><a href="https://blockscout.com/xdai/mainnet/faucet" target="_blank" rel="nofollow noreferrer">https://blockscout.com/.../faucet</a></li>
            </ul>
          </div>
        )
      })
      break;
    case ChainKey.FTM:
      Modal.info({
        title: 'Gas Info for FTM chain',
        content: (
          <div>
            <p>Find out how to get ETH:</p>
            <a href="https://fantom.foundation/where-to-buy-ftm/" target="_blank" rel="nofollow noreferrer">
              Where to buy ETH (by fantom.foundation)
            </a>
          </div>
        )
      })
      break;
    case ChainKey.OKT:
      Modal.info({
        title: 'Gas Info for OKExChain chain',
        content: (
          <div>
            <p>Find out how to get OKT:</p>
            <a href="https://www.okex.com/okexchain" target="_blank" rel="nofollow noreferrer">
              Where to buy OKT (by okex.com)
            </a>
          </div>
        )
      })
      break;
    case ChainKey.AVA:
      Modal.info({
        title: 'Gas Info for Avalanche chain',
        content: (
          <div>
            <p>Find out how to get AVAX:</p>
            <a href="https://www.avax.network/" target="_blank" rel="nofollow noreferrer">
              Where to buy AVAX (by avax.network)
            </a>
          </div>
        )
      })
      break;
    case ChainKey.RIN:
      Modal.info({
        title: 'Gas Info for Rinkeby Testnet',
        content: (
          <div>
            <p>Find out how to get ETH:</p>
            <a href="https://faucet.rinkeby.io/" target="_blank" rel="nofollow noreferrer">
              Official Faucet
            </a>
          </div>
        )
      })
      break;
    case ChainKey.GOR:
      Modal.info({
        title: 'Gas Info for Goerli Testnet',
        content: (
          <div>
            <p>Find out how to get ETH:</p>
            <a href="https://goerli-faucet.slock.it/" target="_blank" rel="nofollow noreferrer">
              Faucet
            </a>
          </div>
        )
      })
      break;
  }
}

// render formatters
function renderGas(wallet: Wallet, chain: ChainKey, coinName: CoinKey) {
  const coin = coins.find(coin => coin.key === coinName)
  const isChainUsed = wallet.portfolio[chain]?.length > 0
  const inPortfolio = wallet.portfolio[chain]?.find(e => e.id === coin?.chains[chain].id)
  const amounts: Amounts = inPortfolio ? parsePortfolioToAmount(inPortfolio) : { amount_coin: 0, amount_usd: 0 }

  const tooltipsEmpty = {
    [ChainKey.ETH]:
      (<>
        <span>The Ethereum chain requires ETH to pay for gas. Without it you won't be able to do anything on this chain.</span>
        <Button type="default" block onClick={() => showGasModal(ChainKey.ETH)}>Get ETH</Button>
      </>),
    [ChainKey.POL]:
      (<>
        <span>The Polygon/Matic chain requires MATIC to pay for gas. Without it you won't be able to do anything on this chain.</span>
        <Button type="default" block onClick={() => showGasModal(ChainKey.POL)}>Get MATIC</Button>
      </>),
    [ChainKey.BSC]:
      (<>
        <span>The Binance Smart Chain requires BNB to pay for gas. Without it you won't be able to do anything on this chain.</span>
        <Button type="default" block onClick={() => showGasModal(ChainKey.BSC)}>Get BNB</Button>
      </>),
    [ChainKey.DAI]:
      (<>
        <span>The xDAI chain requires DAI to pay for gas. Without it you won't be able to do anything on this chain.</span>
        <Button type="default" block onClick={() => showGasModal(ChainKey.DAI)}>Get DAI</Button>
      </>),
    [ChainKey.FTM]:
      (<>
        <span>The Fantom chain requires FTM to pay for gas. Without it you won't be able to do anything on this chain.</span>
        <Button type="default" block onClick={() => showGasModal(ChainKey.FTM)}>Get FTM</Button>
      </>),
    [ChainKey.OKT]:
      (<>
        <span>The OKExCahin chain requires OKT to pay for gas. Without it you won't be able to do anything on this chain.</span>
        <Button type="default" block onClick={() => showGasModal(ChainKey.OKT)}>Get OKT</Button>
      </>),
    [ChainKey.AVA]:
      (<>
        <span>The Avalanche chain requires AVAX to pay for gas. Without it you won't be able to do anything on this chain.</span>
        <Button type="default" block onClick={() => showGasModal(ChainKey.AVA)}>Get AVAX</Button>
      </>),
    [ChainKey.ROP]:
      (<>
        <span>The Ropsten Testnet requires ETH to pay for gas. Without it you won't be able to do anything on this chain.</span>
        <Button type="default" block onClick={() => showGasModal(ChainKey.ROP)}>Get ETH</Button>
      </>),
    [ChainKey.RIN]:
      (<>
        <span>The Rinkeby Testnet requires ETH to pay for gas. Without it you won't be able to do anything on this chain.</span>
        <Button type="default" block onClick={() => showGasModal(ChainKey.RIN)}>Get ETH</Button>
      </>),
    [ChainKey.GOR]:
      (<>
        <span>The Goerli Testnet requires ETH to pay for gas. Without it you won't be able to do anything on this chain.</span>
        <Button type="default" block onClick={() => showGasModal(ChainKey.GOR)}>Get ETH</Button>
      </>),
    [ChainKey.MUM]:
      (<>
        <Button type="default" block onClick={() => showGasModal(ChainKey.MUM)}>Get MATIC</Button>
      </>),
    [ChainKey.ARBT]:
      (<>
        <Button type="default" block onClick={() => showGasModal(ChainKey.ARBT)}>Get ETH</Button>
      </>),
    [ChainKey.OPTT]:
      (<>
        <Button type="default" block onClick={() => showGasModal(ChainKey.OPTT)}>Get ETH</Button>
      </>),
    [ChainKey.BSCT]:
      (<>
        <Button type="default" block onClick={() => showGasModal(ChainKey.BSCT)}>Get BNB</Button>
      </>),
  }
  const tooltipEmpty = tooltipsEmpty[chain];
  const tooltips = {
    [ChainKey.ETH]: (<>The Ethereum chain requires ETH to pay for gas.</>),
    [ChainKey.POL]: (<>The Polygon/Matic chain requires MATIC to pay for gas.</>),
    [ChainKey.BSC]: (<>The Binance Smart Chain requires BNB to pay for gas.</>),
    [ChainKey.DAI]: (<>The xDAI chain requires DAI to pay for gas.</>),
    [ChainKey.FTM]: (<>The Fantom chain requires FTM to pay for gas.</>),
    [ChainKey.OKT]: (<>The OKExCahin chain requires OKT to pay for gas.</>),
    [ChainKey.AVA]: (<>The Avalanche chain requires AVAX to pay for gas.</>),
    [ChainKey.ROP]: (<>The Ropsten Testnet requires ETH to pay for gas.</>),
    [ChainKey.RIN]: (<>The Rinkeby Testnet requires ETH to pay for gas.</>),
    [ChainKey.GOR]: (<>The Goerli Testnet requires ETH to pay for gas.</>),
    [ChainKey.MUM]: (<>The Mumbai Testnet requires MATIC to pay for gas.</>),
    [ChainKey.ARBT]: (<>The Arbitrum Testnet requires ETH to pay for gas.</>),
    [ChainKey.OPTT]: (<>The Optimism Testnet requires ETH to pay for gas.</>),
    [ChainKey.BSCT]: (<>The Optimism Testnet requires BNB to pay for gas.</>),
  }
  const tooltip = tooltips[chain];
  return (
    <div className="gas">
      <div className="amount_coin">
        {amounts.amount_coin === -1 ? (
          <Tooltip title={tooltip}>
            {coinName}: <Skeleton.Button style={{ width: 60 }} active={true} size={'small'} shape={'round'} />
          </Tooltip>
        ) : amounts.amount_coin === 0 ? (
          <Tooltip color={isChainUsed ? 'red' : 'gray'} title={tooltipEmpty}>
            {coinName}: -
            <Badge
              size="small"
              count={'!'}
              offset={[5, -15]}
              style={{ backgroundColor: (isChainUsed ? 'red' : 'gray') }}
            />
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

const renderWalletColumnTitle = (address: string, syncHandler: Function, deleteHandler: Function) => {
  return (<Row>
    <Col span={12} offset={6}>
      {`${address.substr(0, 4)}...${address.substr(-4, 4)}`}
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
const parsePortfolioToAmount = (inPortfolio: any) => {
  const subAmounts: Amounts = {
    amount_coin: inPortfolio.amount,
    amount_usd: inPortfolio.amount * inPortfolio.pricePerCoin,
  }

  return subAmounts
}
const baseWidth = 150;
const buildColumnForWallet = (wallet: Wallet, syncHandler: Function, deleteHandler: Function) => {
  const walletColumn: ColomnType = {
    title: renderWalletColumnTitle(wallet.address, syncHandler, deleteHandler),
    dataIndex: wallet.address,
    children: supportedChains.filter(chain => chain.visible).map((chain) => {
      return {
        title: chain.name,
        children: [{
          title: renderGas(wallet, chain.key, chain.coin),
          dataIndex: `${wallet.address}_${chain.key}`,
          width: baseWidth,
          render: renderAmounts
        }]
      }
    }),
  }
  return walletColumn
}

const coinColumn: ColomnType = {
  title: 'Coins',
  fixed: 'left',
  dataIndex: 'coin',
  render: renderCoin,
  width: 60,
}
const portfolioColumn: ColomnType = {
  title: 'Portfolio',
  width: baseWidth + 10,
  dataIndex: 'portfolio',
  render: renderAmounts
}

const initialColumns = [
  coinColumn,
  portfolioColumn,
  buildColumnForWallet(emptyWallet, () => { }, () => { }),
  {
    title: (
      <Button>
        Add Wallet
      </Button>
    ),
    dataIndex: '',
    width: 100,
  }
]

const initialRows: Array<DataType> = coins.map(coin => {
  return {
    key: coin.key,
    coin: coin as Coin,
    portfolio: { amount_coin: -1, amount_usd: -1 },
    ...chainKeysToObject({ amount_coin: -1, amount_usd: -1 }),
  }
})

const calculateWalletSummary = (wallet: Wallet, totalSumUsd: number) => {
  var summary: WalletSummary = Object.assign(
    {
      wallet: wallet.address,
    },
    chainKeysToObject({ amount_usd: 0.0, percentage_of_portfolio: 0.0 }),
  ) as WalletSummary

  Object.values(ChainKey).forEach(chain => {
    wallet.portfolio[chain]?.forEach(portfolio => {
      summary[chain].amount_usd += portfolio.amount * portfolio.pricePerCoin;
    })
    summary[chain].percentage_of_portfolio = wallet.portfolio[chain]?.reduce((sum, current) => sum + current.amount * current.pricePerCoin, 0) / totalSumUsd
  })
  return summary
}

// actual component
const Dashboard = () => {

  const [registeredWallets, setRegisteredWallets] = useState<Array<Wallet>>(() => { return readWallets() })
  const web3 = useWeb3React()
  const [columns, setColumns] = useState<Array<ColomnType>>(initialColumns)
  const [walletModalVisible, setWalletModalVisible] = useState(false);
  const [walletModalAddress, setWalletModalAddress] = useState('');
  const [walletModalLoading, setWalletModalLoading] = useState<boolean>(false)
  const [data, setData] = useState<Array<DataType>>(initialRows);
  // fixes react warning
  // https://stackoverflow.com/a/63144665
  const [isSubscribed, setIsSubscribed] = useState<boolean>(true);


  const deleteWallet = (wallet: Wallet) => {
    setRegisteredWallets(registeredWallets => registeredWallets.filter(item => item.address !== wallet.address))
  }

  const buildWalletColumns = () => {
    var walletColumns: Array<ColomnType> = []
    registeredWallets.forEach(wallet => {
      const col = buildColumnForWallet(wallet, () => updateWalletPortfolio(wallet), () => deleteWallet(wallet))
      walletColumns.push(col)
    })
    return walletColumns;
  }

  const buildColumns = (initialBuild: boolean = false) => {
    const columns = [
      coinColumn,
      portfolioColumn,
    ]
    if (initialBuild) {
      buildColumnForWallet(emptyWallet, () => { }, () => { })
    } else {
      buildWalletColumns().map(column => columns.push(column))
    }
    columns.push({
      title: (
        <Button onClick={() => setWalletModalVisible(true)} style={{ height: 80 }}>
          Add<br />Wallet
        </Button>
      ),
      dataIndex: '',
      width: 100,
    })
    return columns;
  }

  //builders
  const buildRows = () => {
    const generatedRows: Array<DataType> = []
    coins.forEach(coin => {
      // row object
      const coinRow: DataType = {
        key: coin.key,
        coin: coin as Coin,
        portfolio: {
          amount_coin: 0.0,
          amount_usd: 0.0,
        },
      }
      registeredWallets.forEach(wallet => {
        Object.values(ChainKey).forEach(chain => {
          const emptyAmounts: Amounts = {
            amount_coin: wallet.loading ? -1 : 0.0,
            amount_usd: wallet.loading ? -1 : 0.0,
          }
          const inPortfolio = wallet.portfolio[chain].find(e => e.id === coin.chains[chain]?.id)
          const cellContent: Amounts = inPortfolio ? parsePortfolioToAmount(inPortfolio) : emptyAmounts
          coinRow[`${wallet.address}_${chain}`] = cellContent

          if (cellContent.amount_coin > 0) {
            coinRow.portfolio.amount_coin += cellContent.amount_coin
            coinRow.portfolio.amount_usd += cellContent.amount_usd
          }
        }); // for each chain
      }); // for each wallet
      generatedRows.push(coinRow)
    }) // for each coin

    // sort
    generatedRows.sort((a, b) => b.portfolio.amount_coin - a.portfolio.amount_coin) // DESC token
    generatedRows.sort((a, b) => b.portfolio.amount_usd - a.portfolio.amount_usd) // DESC usd

    return generatedRows
  }

  const updateWalletPortfolio = async (wallet: Wallet) => {
    wallet.loading = true
    setData(buildRows) // set loading state

    const portfolio: { [ChainKey: string]: Array<ChainPortfolio> } = await getBalancesForWallet(wallet.address)
    for (const chain of Object.values(ChainKey)) {
      const chainPortfolio = portfolio[chain]
      wallet.portfolio[chain] = chainPortfolio

      // add new coins
      chainPortfolio.forEach(coin => {
        const exists = coins.find(existingCoin => existingCoin.chains[chain]?.id === coin.id)
        if (!exists) {
          let symbolExists = coins.find(existingCoin => existingCoin.key === coin.symbol)
          let symbol = coin.symbol
          if (symbolExists) {
            let symbol_id = 0
            while (symbolExists) {
              symbol_id += 1
              // eslint-disable-next-line no-loop-func
              symbolExists = coins.find(existingCoin => existingCoin.key === (coin.symbol + '_' + symbol_id))
            }
            symbol += '_' + symbol_id
          }

          const newToken: Token = {
            id: coin.id,
            symbol: coin.symbol,
            decimals: 18,
            chainId: 0,
            name: coin.name,
            logoURI: coin.img_url,

            chainKey: ChainKey.ETH,
            key: coin.symbol as CoinKey,
          }
          let newCoin: Coin = {
            key: symbol as CoinKey,
            name: coin.name,
            logoURI: coin.img_url,
            chains: chainKeysToObject(newToken),
            verified: coin.verified,
          }
          coins.push(newCoin)
        }
      })
    }

    wallet.loading = false
    if (isSubscribed) {
      setRegisteredWallets(
        registeredWallets.map(old =>
          old.address === wallet.address
            ? wallet
            : old
        ))
      setColumns(buildColumns(false))
      setData(buildRows)
    }
  }

  const updateEntirePortfolio = () => {
    registeredWallets.forEach(async wallet => {
      await updateWalletPortfolio(wallet);
    })
  }

  useEffect(() => {
    setIsSubscribed(true)

    return () => {
      setIsSubscribed(false)
    }
  }, [])
  useEffect(() => {
    if (!registeredWallets.length) {
      setWalletModalVisible(true)
      setColumns(initialColumns);
      setData(initialRows)
    } else {
      updateEntirePortfolio()
      setColumns(buildColumns());
      setData(buildRows)
    }
    // eslint-disable-next-line
  }, [registeredWallets.length])

  const addWallet = (address: string) => {
    const newWallet = {
      address: address,
      loading: true,
      portfolio: chainKeysToObject([]),
    }
    setRegisteredWallets(registeredWallets => [...registeredWallets, newWallet])
  }

  useEffect(() => {
    storeWallets(registeredWallets)
  }, [registeredWallets])


  // Add Wallet Modal Handlers
  const resolveEnsName = async (name: string) => {
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
      setWalletModalVisible(false)
      setWalletModalAddress(' ')
      addWallet(address)
    }
    setWalletModalLoading(false);
  };

  const handleWalletModalClose = () => {
    if (!registeredWallets.length) {
      setWalletModalVisible(true)
    } else {
      setWalletModalVisible(false)
    }
  }

  const getModalAddressSuggestion = () => {
    const addedWallets = registeredWallets.map(wallet => wallet.address)
    const web3Account = (web3.account && addedWallets.indexOf(web3.account) === -1) ? web3.account : ''
    return walletModalAddress || web3Account;
  }

  let summaryIndex = 0
  return (
    <Content className="site-layout dashboard">
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
                <Table.Summary.Cell index={summaryIndex} className="sum">SUM</Table.Summary.Cell>
                <Table.Summary.Cell index={summaryIndex++}>{renderSummary(!registeredWallets.length ? emptySummaryAmounts : { amount_usd: data.reduce((sum, curr) => sum + curr.portfolio.amount_usd, 0), percentage_of_portfolio: 1 } as SummaryAmounts)}</Table.Summary.Cell>
                {
                  registeredWallets.map((wallet: Wallet) => {
                    const total = data.reduce((sum, curr) => sum + curr.portfolio.amount_usd, 0)
                    const summary = calculateWalletSummary(wallet, total)

                    return supportedChains
                      .filter(chain => chain.visible)
                      .map(chain => {
                        return (
                          <Table.Summary.Cell index={summaryIndex++} key={`${wallet.address}_${chain.key}`}>{wallet.loading ? renderSummary({ amount_usd: 0, percentage_of_portfolio: 0 }) : renderSummary(summary[chain.key])}</Table.Summary.Cell>
                        )
                      })
                  })
                }
                <Table.Summary.Cell index={summaryIndex++} key={'add'}></Table.Summary.Cell>
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
        zIndex={800}
        footer={[
          // only show close if other wallets have been added already
          registeredWallets.length === 0 ? (
            <Button key="back" onClick={handleWalletModalClose}>
              Close
            </Button>
          ) : '',
          <Button key="submit" type="primary" onClick={handleWalletModalAdd} disabled={walletModalLoading}>
            {walletModalLoading ? 'Loading' : 'Add'}
          </Button>,
        ]}
      >
        {!web3.account ? (<ConnectButton />) : (<Button style={{ display: 'block' }}>Connected with {web3.account.substr(0, 4)}...</Button>)}

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



export default Dashboard
