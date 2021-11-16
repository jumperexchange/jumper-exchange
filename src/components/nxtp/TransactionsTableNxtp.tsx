import { CheckOutlined, LoadingOutlined } from '@ant-design/icons'
import { NxtpSdkEvents } from '@connext/nxtp-sdk'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { Button, Spin, Table } from 'antd'
import Link from 'antd/lib/typography/Link'

import { ChainId, getChainById, Route, TokenWithAmounts } from '../../types'
import { ActiveTransaction, CrosschainTransaction } from './typesNxtp'

interface TransactionsTableNxtpProps {
  activeTransactions: ActiveTransaction[]
  executionRoutes: Route[]
  setModalRouteIndex: Function
  openSwapModalFinish: Function
  switchChain: Function
  cancelTransfer: Function
  tokens: { [ChainKey: string]: Array<TokenWithAmounts> }
}

const TransactionsTableNxtp = ({
  activeTransactions,
  executionRoutes,
  setModalRouteIndex,
  openSwapModalFinish,
  switchChain,
  cancelTransfer,
  tokens,
}: TransactionsTableNxtpProps) => {
  const web3 = useWeb3React<Web3Provider>()

  const activeTransactionsColumns = [
    {
      title: 'Action',
      dataIndex: '',
      render: (action: ActiveTransaction) => {
        if (action.txData.sending && Date.now() / 1000 > action.txData.sending.expiry) {
          // check chain
          if (web3.chainId !== action.txData.invariant.sendingChainId) {
            return (
              <Button
                type="link"
                onClick={() => switchChain(action.txData.invariant.sendingChainId)}>
                Change Chain
              </Button>
            )
          } else {
            return (
              <Button type="link" onClick={() => cancelTransfer(action.txData)}>
                Cancel
              </Button>
            )
          }
        } else if (action.status === NxtpSdkEvents.ReceiverTransactionPrepared && action.event) {
          return (
            <Button
              className="xpollinate-button"
              type="primary"
              shape="round"
              size="large"
              style={{ borderRadius: 6, width: '100%' }}
              onClick={() => openSwapModalFinish(action)}>
              Claim Funds
            </Button>
          )
        } else if (
          action.status === NxtpSdkEvents.ReceiverTransactionFulfilled ||
          action.status === NxtpSdkEvents.SenderTransactionFulfilled
        ) {
          return (
            <CheckOutlined
              style={{ margin: 'auto', display: 'block', color: 'green', fontSize: 24 }}
            />
          )
        } else {
          const index = executionRoutes.findIndex((route) => {
            return (
              route.steps[0].estimate.data.bid.transactionId ===
              action.txData.invariant.transactionId
            )
          })
          if (index !== -1 && executionRoutes[index].steps[0].execution?.status === 'FAILED') {
            return 'Failed'
          } else if (index !== -1) {
            return (
              <Spin
                style={{ margin: 'auto', display: 'block' }}
                indicator={<LoadingOutlined spin style={{ fontSize: 24 }} />}
              />
            )
          } else {
            return <></>
          }
        }
      },
    },
    {
      title: 'Status',
      dataIndex: '',
      render: (action: ActiveTransaction) => {
        const index = executionRoutes.findIndex((route) => {
          return (
            route.steps[0].estimate.data.bid.transactionId === action.txData.invariant.transactionId
          )
        })

        if (index !== -1) {
          return <Button onClick={() => setModalRouteIndex(index)}>{action.status}</Button>
        } else {
          return action.status
        }
      },
    },
    {
      title: 'Transaction Id',
      dataIndex: ['txData'],
      render: (txData: CrosschainTransaction) => {
        return (
          <Link
            href={'https://connextscan.io/tx/' + txData.invariant.transactionId}
            target="_blank"
            rel="nofollow noreferrer"
            style={{ width: 150 }}
            ellipsis={true}
            copyable>
            {txData.invariant.transactionId}
          </Link>
        )
      },
    },
    {
      title: 'Sending Chain',
      dataIndex: ['txData'],
      render: (txData: CrosschainTransaction) => {
        const chain = getChainById(txData.invariant.sendingChainId)
        return <>{chain.name}</>
      },
    },
    {
      title: 'Receiving Chain',
      dataIndex: ['txData'],
      render: (txData: CrosschainTransaction) => {
        const chain = getChainById(txData.invariant.receivingChainId)
        return <>{chain.name}</>
      },
    },
    {
      title: 'Asset',
      dataIndex: ['txData'],
      render: (txData: CrosschainTransaction) => {
        const chain = getChainById(txData.invariant.receivingChainId)
        const token = tokens[chain.key].find(
          (token) => token.id.toLowerCase() === txData.invariant.receivingAssetId.toLowerCase(),
        )
        const path = chain.id === ChainId.MOR ? 'tokens/' : 'token/'
        const link =
          chain.metamask.blockExplorerUrls[0] + path + txData.invariant.receivingAssetId
        return (
          <a href={link} target="_blank" rel="nofollow noreferrer">
            {token?.name}
          </a>
        )
      },
    },
    {
      title: 'Amount',
      dataIndex: ['txData'],
      render: (txData: CrosschainTransaction) => {
        const chain = getChainById(txData.invariant.sendingChainId)
        const token = tokens[chain.key].find(
          (token) => token.id.toLowerCase() === txData.invariant.sendingAssetId.toLowerCase(),
        )
        return (parseInt(txData.sending?.amount || '0') / 10 ** (token?.decimals || 18)).toFixed(4)
      },
    },

    {
      title: 'Expires',
      dataIndex: ['txData'],
      render: (txData: CrosschainTransaction) => {
        return (txData.sending?.expiry || 0) > Date.now() / 1000
          ? `${(((txData.sending?.expiry || 0) - Date.now() / 1000) / 3600).toFixed(2)} hours`
          : 'Expired'
      },
    },
  ]

  return (
    <Table
      columns={activeTransactionsColumns}
      dataSource={activeTransactions}
      style={{ whiteSpace: 'nowrap' }}
      pagination={false}
      rowKey={(row) => row.txData.invariant.transactionId}></Table>
  )
}

export default TransactionsTableNxtp
