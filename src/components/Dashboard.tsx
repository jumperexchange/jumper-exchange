import './Dashboard.css'

import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  DeleteOutlined,
  SyncOutlined,
  WalletOutlined,
} from '@ant-design/icons'
import {
  Avatar,
  Badge,
  Button,
  Col,
  Input,
  Modal,
  Row,
  Skeleton,
  Table,
  Tooltip,
  Typography,
} from 'antd'
import { Content } from 'antd/lib/layout/layout'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'

import { useMetatags } from '../hooks/useMetatags'
import { useWallet } from '../providers/WalletProvider'
import { getTokenBalancesForChainsFromDebank } from '../services/balances'
import { readWallets } from '../services/localStorage'
import { useStomt } from '../services/stomt'
import { isWalletDeactivated } from '../services/utils'
import {
  Amounts,
  ChainId,
  ChainKey,
  chainKeysToObject,
  Coin,
  CoinKey,
  ColomnType,
  DataType,
  defaultCoins,
  getChainById,
  SummaryAmounts,
  supportedChains,
  TokenAmount,
  Wallet,
  WalletSummary,
} from '../types'
import ConnectButton from './web3/ConnectButton'

const visibleChains: ChainId[] = [
  ChainId.ETH,
  ChainId.POL,
  ChainId.BSC,
  ChainId.DAI,
  ChainId.FTM,
  ChainId.OKT,
  ChainId.AVA,
  ChainId.ARB,
  ChainId.HEC,
  ChainId.MOR,
  ChainId.CEL,
  ChainId.OPT,
  ChainId.CRO,
  ChainId.BOB,
  ChainId.MOO,
  ChainId.MAM,
  ChainId.FUS,
  ChainId.ONE,
]

const emptySummaryAmounts: SummaryAmounts = {
  amount_usd: new BigNumber(0),
  percentage_of_portfolio: new BigNumber(0),
}

const emptyWallet = {
  address: '0x..',
  loading: true,
  portfolio: chainKeysToObject([]),
}

let coins = defaultCoins.filter((coin) => coin.key !== CoinKey.TEST)

// individual render functions
function renderAmounts(
  amounts: Amounts = { amount_coin: new BigNumber(-1), amount_usd: new BigNumber(-1) },
) {
  if (amounts.amount_coin.eq(-1)) {
    // loading
    return (
      <div className="amounts">
        <div className="amount_coin">
          <Skeleton.Button style={{ width: 70 }} active={true} size={'small'} shape={'round'} />
        </div>
        <div className="amount_usd">
          <Skeleton.Button
            style={{ width: 60, height: 18 }}
            active={true}
            size={'small'}
            shape={'round'}
          />
        </div>
      </div>
    )
  } else if (amounts.amount_coin.isZero()) {
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
      <div className={'amounts' + (amounts.amount_coin.isZero() ? ' amounts-empty' : '')}>
        <div className="amount_coin">{amounts.amount_coin.toFixed(4)}</div>
        <div className="amount_usd">{amounts.amount_usd.toFixed(2)} USD</div>
      </div>
    )
  }
}

function renderCoin(coin: Coin) {
  return (
    <div className="coin">
      <Tooltip title={coin.name + (coin.verified ? ' (verified)' : '')}>
        <Avatar src={coin.logoURI} alt={coin.name}>
          {coin.key}
        </Avatar>
        <Badge
          className="coin_verify"
          count={
            coin.verified ? (
              <CheckCircleTwoTone twoToneColor="#52c41a" />
            ) : (
              <CloseCircleTwoTone twoToneColor="#eb2f96" />
            )
          }></Badge>
      </Tooltip>
    </div>
  )
}

function renderSummary(summary: SummaryAmounts) {
  summary.amount_usd = new BigNumber(summary.amount_usd) // Ugly fix
  return (
    <div className="amounts">
      <div className="amount_coin">{summary.amount_usd.toFixed(2)} USD</div>
      <div className="amount_usd">
        {summary.percentage_of_portfolio.shiftedBy(2).toFixed(2)} % of portfolio
      </div>
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
        ),
      })
      break
    case ChainKey.POL:
      Modal.info({
        title: 'Gas Info for Polygon/Matic chain',
        content: (
          <div>
            <p>
              You can get some free MATIC using those faucets. It should be enough to exchange or
              move your funds.
            </p>
            <ul>
              <li>
                <a href="https://matic.supply/" target="_blank" rel="nofollow noreferrer">
                  https://matic.supply/
                </a>
              </li>
              <li>
                <a
                  href="https://macncheese.finance/matic-polygon-mainnet-faucet.php"
                  target="_blank"
                  rel="nofollow noreferrer">
                  https://macncheese.finance/
                </a>
              </li>
            </ul>
          </div>
        ),
      })
      break
    case ChainKey.BSC:
      Modal.info({
        title: 'Gas Info for Binance Smart Chain',
        content: (
          <div>
            <p>You need to buy BNB.</p>
            e.g. on{' '}
            <a href="https://www.binance.com/" target="_blank" rel="nofollow noreferrer">
              binance.com
            </a>
          </div>
        ),
      })
      break
    case ChainKey.DAI:
      Modal.info({
        title: 'Gas Info for Gnosis chain',
        content: (
          <div>
            <p>
              You can get some free DAI using those faucets. It should be enough to exchange or move
              your funds.
            </p>
            <ul>
              <li>
                <a href="https://xdai-faucet.top/" target="_blank" rel="nofollow noreferrer">
                  https://xdai-faucet.top/
                </a>
              </li>
              <li>
                <a
                  href="https://xdai-app.herokuapp.com/faucet"
                  target="_blank"
                  rel="nofollow noreferrer">
                  https://xdai-app.herokuapp.com/faucet
                </a>
              </li>
              <li>
                <a
                  href="https://blockscout.com/xdai/mainnet/faucet"
                  target="_blank"
                  rel="nofollow noreferrer">
                  https://blockscout.com/.../faucet
                </a>
              </li>
            </ul>
          </div>
        ),
      })
      break
    case ChainKey.FTM:
      Modal.info({
        title: 'Gas Info for FTM chain',
        content: (
          <div>
            <p>Find out how to get ETH:</p>
            <a
              href="https://fantom.foundation/where-to-buy-ftm/"
              target="_blank"
              rel="nofollow noreferrer">
              Where to buy ETH (by fantom.foundation)
            </a>
          </div>
        ),
      })
      break
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
        ),
      })
      break
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
        ),
      })
      break
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
        ),
      })
      break
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
        ),
      })
      break
  }
}

const tooltipsEmpty: { [ChainKey: string]: JSX.Element } = {}
const tooltips: { [ChainKey: string]: any } = {}
for (const chainId of visibleChains) {
  const chain = getChainById(chainId)
  tooltips[chain.key] = (
    <>
      The ${chain.name} chain requires ${chain.coin} to pay for gas.
    </>
  )
  tooltipsEmpty[chain.key] = (
    <>
      <span>
        The ${chain.name} requires ${chain.coin} to pay for gas. Without it you won't be able to do
        anything on this chain.
      </span>
      <Button type="default" block onClick={() => showGasModal(chain.key)}>
        Get ${chain.coin}
      </Button>
    </>
  )
}

// render formatters
function renderGas(wallet: Wallet, chainKey: ChainKey, coinName: CoinKey) {
  const coin = coins.find((coin) => coin.key === coinName)
  const isChainUsed = wallet.portfolio[chainKey]?.length > 0
  const inPortfolio = wallet.portfolio[chainKey]?.find(
    (tokenAmount) =>
      tokenAmount.address === '0x0000000000000000000000000000000000000000' ||
      tokenAmount.address === coin?.chains[chainKey]?.address,
  )
  const amounts: Amounts = inPortfolio
    ? parsePortfolioToAmount(inPortfolio)
    : { amount_coin: new BigNumber(0), amount_usd: new BigNumber(0) }

  const tooltipEmpty = tooltipsEmpty[chainKey]
  const tooltip = tooltips[chainKey]
  return (
    <div className="gas">
      <div className="amount_coin">
        {amounts.amount_coin.eq(-1) ? (
          <Tooltip title={tooltip}>
            {coinName}:{' '}
            <Skeleton.Button style={{ width: 60 }} active={true} size={'small'} shape={'round'} />
          </Tooltip>
        ) : amounts.amount_coin.isZero() ? (
          <Tooltip color={isChainUsed ? '#ff4d4f' : 'gray'} title={tooltipEmpty}>
            {coinName}: -
            <Badge
              size="small"
              count={'!'}
              offset={[5, -15]}
              style={{ backgroundColor: isChainUsed ? '#ff4d4f' : 'gray' }}
            />
          </Tooltip>
        ) : (
          <Tooltip title={tooltip}>
            {coinName}: {amounts.amount_coin.toFixed(4)}
          </Tooltip>
        )}
      </div>
    </div>
  )
}

const renderWalletColumnTitle = (
  address: string,
  syncHandler: Function,
  deleteHandler: Function,
) => {
  return (
    <Row>
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
const parsePortfolioToAmount = (inPortfolio: TokenAmount) => {
  const amount = new BigNumber(inPortfolio.amount)
  const subAmounts: Amounts = {
    amount_coin: amount,
    amount_usd: amount.times(inPortfolio.priceUSD || '0'),
  }
  return subAmounts
}
const baseWidth = 150
const buildColumnForWallet = (wallet: Wallet, syncHandler: Function, deleteHandler: Function) => {
  const walletColumn: ColomnType = {
    title: renderWalletColumnTitle(wallet.address, syncHandler, deleteHandler),
    dataIndex: wallet.address,
    children: supportedChains
      .filter((chain) => visibleChains.includes(chain.id))
      .map((chain) => {
        return {
          title: chain.name,
          children: [
            {
              title: renderGas(wallet, chain.key, chain.coin),
              dataIndex: `${wallet.address}_${chain.key}`,
              width: baseWidth,
              render: renderAmounts,
            },
          ],
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
  render: renderAmounts,
}

const initialColumns = [
  coinColumn,
  portfolioColumn,
  buildColumnForWallet(
    emptyWallet,
    () => {},
    () => {},
  ),
  {
    title: <Button>Add Wallet</Button>,
    dataIndex: '',
    width: 100,
  },
]

const initialRows: Array<DataType> = coins.map((coin) => {
  return {
    key: coin.key,
    coin: coin as Coin,
    portfolio: { amount_coin: new BigNumber(-1), amount_usd: new BigNumber(-1) },
    ...chainKeysToObject({ amount_coin: new BigNumber(-1), amount_usd: new BigNumber(-1) }),
  }
})

const calculateWalletSummary = (wallet: Wallet, totalSumUsd: BigNumber) => {
  var summary: WalletSummary = {
    wallet: wallet.address,
    chains: chainKeysToObject({
      amount_usd: new BigNumber(0),
      percentage_of_portfolio: new BigNumber(0),
    }),
  }

  visibleChains.forEach((chainId) => {
    const chain = getChainById(chainId)
    wallet.portfolio[chain.key]?.forEach((tokenAmount) => {
      summary.chains[chain.key].amount_usd = new BigNumber(summary.chains[chain.key].amount_usd) // chainKeysToObject retruns string

      summary.chains[chain.key].amount_usd = tokenAmount.priceUSD
        ? summary.chains[chain.key].amount_usd.plus(
            new BigNumber(tokenAmount.amount).times(new BigNumber(tokenAmount.priceUSD)),
          )
        : summary.chains[chain.key].amount_usd
    })
    summary.chains[chain.key].percentage_of_portfolio = wallet.portfolio[chain.key]
      ?.reduce(
        (sum, current) =>
          current.priceUSD
            ? sum.plus(new BigNumber(current.amount).times(new BigNumber(current.priceUSD)))
            : sum,
        new BigNumber(0),
      )
      .div(totalSumUsd)
  })
  return summary
}

// actual component
const Dashboard = () => {
  useMetatags({
    title: 'LI.FI - Dashboard',
  })
  useStomt('dashboard')
  const [registeredWallets, setRegisteredWallets] = useState<Array<Wallet>>(() =>
    readWallets().map((address) => ({
      address: address,
      loading: false,
      portfolio: chainKeysToObject([]),
    })),
  )
  const { account } = useWallet()
  const [columns, setColumns] = useState<Array<ColomnType>>(initialColumns)
  const [walletModalVisible, setWalletModalVisible] = useState(false)
  const [walletModalAddress, setWalletModalAddress] = useState('')
  const [walletModalLoading, setWalletModalLoading] = useState<boolean>(false)
  const [data, setData] = useState<Array<DataType>>(initialRows)
  // fixes react warning
  // https://stackoverflow.com/a/63144665
  const [isSubscribed, setIsSubscribed] = useState<boolean>(true)

  const deleteWallet = (wallet: Wallet) => {
    setRegisteredWallets((registeredWallets) =>
      registeredWallets.filter((item) => item.address !== wallet.address),
    )
  }

  // update registeredWallets on activate or deactivate
  useEffect(() => {
    if (isWalletDeactivated(account.address)) return
    setRegisteredWallets(
      readWallets().map((address) => ({
        address: address,
        loading: false,
        portfolio: chainKeysToObject([]),
      })),
    )
  }, [account.address])

  const buildWalletColumns = () => {
    var walletColumns: Array<ColomnType> = []
    registeredWallets.forEach((wallet) => {
      const col = buildColumnForWallet(
        wallet,
        () => updateWalletPortfolio(wallet),
        () => deleteWallet(wallet),
      )
      walletColumns.push(col)
    })
    return walletColumns
  }

  const buildColumns = (initialBuild: boolean = false) => {
    const columns = [coinColumn, portfolioColumn]
    if (initialBuild) {
      buildColumnForWallet(
        emptyWallet,
        () => {},
        () => {},
      )
    } else {
      buildWalletColumns().map((column) => columns.push(column))
    }
    columns.push({
      title: (
        <Button onClick={() => setWalletModalVisible(true)} style={{ height: 80 }}>
          Add
          <br />
          Wallet
        </Button>
      ),
      dataIndex: '',
      width: 100,
    })
    return columns
  }

  //builders
  const buildRows = () => {
    const generatedRows: Array<DataType> = []
    coins.forEach((coin) => {
      // row object
      const coinRow: DataType = {
        key: coin.key,
        coin: coin as Coin,
        portfolio: {
          amount_coin: new BigNumber(0),
          amount_usd: new BigNumber(0),
        },
      }
      registeredWallets.forEach((wallet) => {
        for (const chainId of visibleChains) {
          const chain = getChainById(chainId)

          const emptyAmounts: Amounts = {
            amount_coin: wallet.loading ? new BigNumber(-1) : new BigNumber(0),
            amount_usd: wallet.loading ? new BigNumber(-1) : new BigNumber(0),
          }
          const inPortfolio = wallet.portfolio[chain.key].find(
            (e) => e.address === coin.chains[chain.id]?.address,
          )
          const cellContent: Amounts = inPortfolio
            ? parsePortfolioToAmount(inPortfolio)
            : emptyAmounts
          coinRow[`${wallet.address}_${chain.key}`] = cellContent

          if (cellContent.amount_coin.gt(0)) {
            coinRow.portfolio.amount_coin = coinRow.portfolio.amount_coin.plus(
              cellContent.amount_coin,
            )
            coinRow.portfolio.amount_usd = coinRow.portfolio.amount_usd.plus(cellContent.amount_usd)
          }
        } // for each chain
      }) // for each wallet
      generatedRows.push(coinRow)
    }) // for each coin

    // sort
    generatedRows.sort((a, b) => b.portfolio.amount_coin.minus(a.portfolio.amount_coin).toNumber()) // DESC token
    generatedRows.sort((a, b) => b.portfolio.amount_usd.minus(a.portfolio.amount_usd).toNumber()) // DESC usd

    return generatedRows
  }

  const updateWalletPortfolio = async (wallet: Wallet) => {
    wallet.loading = true
    setData(buildRows) // set loading state

    const portfolio: { [ChainKey: string]: TokenAmount[] } =
      await getTokenBalancesForChainsFromDebank(wallet.address)

    for (const chainId of visibleChains) {
      const chain = getChainById(chainId)
      const chainPortfolio = portfolio[chain.id]
      wallet.portfolio[chain.key] = chainPortfolio

      // add new coins
      chainPortfolio.forEach((token) => {
        const exists = coins.find(
          (existingCoin) => existingCoin.chains[chain.id]?.address === token.address,
        )
        if (!exists) {
          let symbolExists = coins.find((existingCoin) => existingCoin.key === token.symbol)
          let symbol = token.symbol
          if (symbolExists) {
            let symbol_id = 0
            while (symbolExists) {
              symbol_id += 1
              // eslint-disable-next-line no-loop-func
              symbolExists = coins.find(
                // eslint-disable-next-line no-loop-func
                (existingCoin) => existingCoin.key === token.symbol + '_' + symbol_id,
              )
            }
            symbol += '_' + symbol_id
          }

          let newCoin: Coin = {
            key: symbol as CoinKey,
            name: token.name,
            logoURI: token.logoURI || '',
            chains: chainKeysToObject(token),
            verified: false,
          }
          coins.push(newCoin)
        }
      })
    }

    wallet.loading = false
    if (isSubscribed) {
      setRegisteredWallets(
        registeredWallets.map((old) => (old.address === wallet.address ? wallet : old)),
      )
      setColumns(buildColumns(false))
      setData(buildRows)
    }
  }

  const updateEntirePortfolio = () => {
    registeredWallets.forEach(async (wallet) => {
      await updateWalletPortfolio(wallet)
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
      setColumns(initialColumns)
      setData(initialRows)
    } else {
      updateEntirePortfolio()
      setColumns(buildColumns())
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
    setRegisteredWallets((registeredWallets) => [...registeredWallets, newWallet])
  }

  // Add Wallet Modal Handlers
  const resolveEnsName = async (name: string) => {
    const ethereum = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL_MAINNET)
    return ethereum.resolveName(name)
  }

  const handleWalletModalAdd = async () => {
    setWalletModalLoading(true)
    let address = getModalAddressSuggestion()

    if (address.endsWith('.eth')) {
      address = (await resolveEnsName(address)) || ''
    }

    if (ethers.utils.isAddress(address)) {
      setWalletModalVisible(false)
      setWalletModalAddress(' ')
      addWallet(address)
    }
    setWalletModalLoading(false)
  }

  const handleWalletModalClose = () => {
    if (!registeredWallets.length) {
      setWalletModalVisible(true)
    } else {
      setWalletModalVisible(false)
    }
  }

  const getModalAddressSuggestion = () => {
    const addedWallets = registeredWallets.map((wallet) => wallet.address)
    const web3Account =
      account.address && addedWallets.indexOf(account.address) === -1 ? account.address : ''
    return walletModalAddress || web3Account
  }

  let summaryIndex = 0

  return (
    <Content className="site-layout dashboard">
      <div
        className="site-layout-background"
        style={{
          minHeight: 'calc(100vh - 104px)',
          marginTop: 112,
        }}>
        <Table
          columns={columns}
          dataSource={data}
          bordered
          size="middle"
          scroll={{ x: '1000px', y: 'calc(100vh - 317px)' }}
          pagination={false}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={summaryIndex} className="sum">
                  SUM
                </Table.Summary.Cell>
                <Table.Summary.Cell index={summaryIndex++}>
                  {renderSummary(
                    !registeredWallets.length
                      ? emptySummaryAmounts
                      : ({
                          amount_usd: data.reduce(
                            (sum, curr) => sum.plus(curr.portfolio.amount_usd),
                            new BigNumber(0),
                          ),
                          percentage_of_portfolio: new BigNumber(1),
                        } as SummaryAmounts),
                  )}
                </Table.Summary.Cell>
                {registeredWallets.map((wallet: Wallet) => {
                  const total = data.reduce(
                    (sum, curr) => sum.plus(curr.portfolio.amount_usd),
                    new BigNumber(0),
                  )
                  const summary = calculateWalletSummary(wallet, total)

                  return supportedChains
                    .filter((chain) => visibleChains.includes(chain.id))
                    .map((chain) => {
                      return (
                        <Table.Summary.Cell
                          index={summaryIndex++}
                          key={`${wallet.address}_${chain.key}`}>
                          {wallet.loading
                            ? renderSummary({
                                amount_usd: new BigNumber(0),
                                percentage_of_portfolio: new BigNumber(0),
                              })
                            : renderSummary(summary.chains[chain.key])}
                        </Table.Summary.Cell>
                      )
                    })
                })}
                <Table.Summary.Cell index={summaryIndex++} key={'add'}></Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </div>

      <Modal
        title="Add Wallet"
        open={walletModalVisible}
        onOk={handleWalletModalAdd}
        onCancel={handleWalletModalClose}
        zIndex={800}
        closable={!!registeredWallets.length}
        footer={[
          // only show close if other wallets have been added already
          registeredWallets.length ? (
            <Button key="back" onClick={handleWalletModalClose}>
              Close
            </Button>
          ) : (
            ''
          ),
          <Button
            key="submit"
            type="primary"
            onClick={handleWalletModalAdd}
            disabled={walletModalLoading}>
            {walletModalLoading ? 'Loading' : 'Add'}
          </Button>,
        ]}>
        <div className="connected-wallets-section" style={{ marginBottom: '32px' }}>
          {!account.address ? (
            <ConnectButton style={{ display: 'block', margin: ' auto' }} />
          ) : (
            <Button shape="round" style={{ display: 'block', margin: ' auto' }}>
              Connected with {account.address.substr(0, 4)}...
            </Button>
          )}
        </div>
        <Typography.Text style={{ display: 'block', margin: '0 auto', textAlign: 'center' }}>
          Temporarily inspect a wallet address / ens domain:
        </Typography.Text>
        <Input
          size="large"
          placeholder="0x..."
          prefix={<WalletOutlined />}
          onChange={(event) => setWalletModalAddress(event.target.value)}
          disabled={walletModalLoading}
          style={{
            borderRadius: 6,
          }}
        />
      </Modal>
    </Content>
  )
}

export default Dashboard
