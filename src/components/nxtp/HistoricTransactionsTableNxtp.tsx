import { HistoricalTransaction } from '@connext/nxtp-sdk'
import { Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import Link from 'antd/lib/typography/Link'
import BigNumber from 'bignumber.js'

import { getChainById, TokenWithAmounts } from '../../types'

interface HistoricTransactionsTableNxtpProps {
  historicTransactions: Array<HistoricalTransaction>
  tokens: { [ChainKey: string]: Array<TokenWithAmounts> }
}

const HistoricTransactionsTableNxtp = ({
  historicTransactions,
  tokens,
}: HistoricTransactionsTableNxtpProps) => {
  const historicTransactionsColumns: ColumnsType<HistoricalTransaction> = [
    {
      title: 'Date',
      dataIndex: '',
      render: (transaction: HistoricalTransaction) => {
        return new Date(transaction.preparedTimestamp * 1000).toLocaleString()
      },
      sorter: (a: HistoricalTransaction, b: HistoricalTransaction) =>
        a.preparedTimestamp - b.preparedTimestamp,
      defaultSortOrder: 'descend',
    },
    {
      title: 'Status',
      dataIndex: '',
      render: (transaction: HistoricalTransaction) => {
        const toChain = getChainById(transaction.crosschainTx.invariant.receivingChainId)
        const txLink = toChain.metamask.blockExplorerUrls[0] + 'tx/' + transaction.fulfilledTxHash
        return (
          <>
            {transaction.status}{' '}
            {transaction.fulfilledTxHash && (
              <>
                (
                <a href={txLink} target="_blank" rel="nofollow noreferrer">
                  Tx
                </a>
                )
              </>
            )}
          </>
        )
      },
    },
    {
      title: 'Sending Chain',
      dataIndex: '',
      render: (transaction: HistoricalTransaction) => {
        const chain = getChainById(transaction.crosschainTx.invariant.sendingChainId)
        return <>{chain.name}</>
      },
      sorter: (a: HistoricalTransaction, b: HistoricalTransaction) =>
        a.crosschainTx.invariant.sendingChainId - b.crosschainTx.invariant.sendingChainId,
    },
    {
      title: 'fromAmount',
      dataIndex: '',
      align: 'right',
      render: (transaction: HistoricalTransaction) => {
        const chain = getChainById(transaction.crosschainTx.invariant.sendingChainId)
        const token = tokens[chain.key].find(
          (token) => token.id === transaction.crosschainTx.invariant.sendingAssetId.toLowerCase(),
        )
        const amount = new BigNumber(transaction.crosschainTx.sending?.amount || '0').shiftedBy(
          -(token?.decimals || 18),
        )
        const link =
          chain.metamask.blockExplorerUrls[0] +
          'token/' +
          transaction.crosschainTx.invariant.sendingAssetId
        return (
          <>
            {amount.gte(0.0001) ? amount.toFixed(4, 1) : amount.toFixed()}{' '}
            <a href={link} target="_blank" rel="nofollow noreferrer">
              {token?.name}
            </a>
          </>
        )
      },
      sorter: (a: HistoricalTransaction, b: HistoricalTransaction) =>
        parseInt(a.crosschainTx.sending?.amount || '0') -
        parseInt(b.crosschainTx.sending?.amount || '0'),
    },
    {
      title: 'Receiving Chain',
      dataIndex: '',
      render: (transaction: HistoricalTransaction) => {
        const chain = getChainById(transaction.crosschainTx.invariant.receivingChainId)
        return <>{chain.name}</>
      },
      sorter: (a: HistoricalTransaction, b: HistoricalTransaction) =>
        a.crosschainTx.invariant.receivingChainId - b.crosschainTx.invariant.receivingChainId,
    },
    {
      title: 'toAmount',
      dataIndex: '',
      align: 'right',
      render: (transaction: HistoricalTransaction) => {
        const chain = getChainById(transaction.crosschainTx.invariant.receivingChainId)
        const token = tokens[chain.key].find(
          (token) => token.id === transaction.crosschainTx.invariant.receivingAssetId.toLowerCase(),
        )
        const amount = new BigNumber(transaction.crosschainTx.receiving?.amount || '0').shiftedBy(
          -(token?.decimals || 18),
        )

        const toChain = getChainById(transaction.crosschainTx.invariant.receivingChainId)
        const txLink = toChain.metamask.blockExplorerUrls[0] + 'tx/' + transaction.fulfilledTxHash

        const link =
          chain.metamask.blockExplorerUrls[0] +
          'token/' +
          transaction.crosschainTx.invariant.receivingAssetId

        if (amount.isZero()) {
          return <></>
        } else if (transaction.fulfilledTxHash) {
          return (
            <>
              <a href={txLink} target="_blank" rel="nofollow noreferrer">
                {amount.gte(0.0001) ? amount.toFixed(4, 1) : amount.toFixed()}
              </a>{' '}
              <a href={link} target="_blank" rel="nofollow noreferrer">
                {token?.name}
              </a>
            </>
          )
        } else {
          return (
            <>
              {amount.gte(0.0001) ? amount.toFixed(4, 1) : amount.toFixed()}{' '}
              <a href={link} target="_blank" rel="nofollow noreferrer">
                {token?.name}
              </a>
            </>
          )
        }
      },
      sorter: (a: HistoricalTransaction, b: HistoricalTransaction) =>
        parseInt(a.crosschainTx.receiving?.amount || '0') -
        parseInt(b.crosschainTx.receiving?.amount || '0'),
    },
    {
      title: 'Fee',
      dataIndex: '',
      align: 'right',
      render: (transaction: HistoricalTransaction) => {
        if (transaction.crosschainTx.sending && transaction.crosschainTx.receiving) {
          const fromChain = getChainById(transaction.crosschainTx.invariant.sendingChainId)
          const fromToken = tokens[fromChain.key].find(
            (token) => token.id === transaction.crosschainTx.invariant.sendingAssetId.toLowerCase(),
          )
          const fromAmount = new BigNumber(transaction.crosschainTx.sending.amount).shiftedBy(
            -(fromToken?.decimals || 18),
          )

          const toChain = getChainById(transaction.crosschainTx.invariant.receivingChainId)
          const toToken = tokens[toChain.key].find(
            (token) =>
              token.id === transaction.crosschainTx.invariant.receivingAssetId.toLowerCase(),
          )
          const toAmount = new BigNumber(transaction.crosschainTx.receiving.amount).shiftedBy(
            -(toToken?.decimals || 18),
          )

          const diff = fromAmount.minus(toAmount)
          const fee = diff.div(fromAmount)
          return fee.shiftedBy(2).toFixed(2) + '%'
        }
      },
      //sorter: (a: HistoricalTransaction, b: HistoricalTransaction) => parseInt(a.crosschainTx.receiving?.amount || '0') - parseInt(b.crosschainTx.receiving?.amount || '0')
    },
    {
      title: 'Transaction Id',
      dataIndex: '',
      render: (transaction: HistoricalTransaction) => {
        return (
          <Link
            href={'https://connextscan.io/tx/' + transaction.crosschainTx.invariant.transactionId}
            target="_blank"
            rel="nofollow noreferrer"
            style={{ width: 150 }}
            ellipsis={true}
            copyable>
            {transaction.crosschainTx.invariant.transactionId}
          </Link>
        )
      },
    },
  ]

  return (
    <Table
      columns={historicTransactionsColumns}
      dataSource={historicTransactions}
      style={{ whiteSpace: 'nowrap' }}
      rowKey={(row) => row.crosschainTx.invariant.transactionId}
      pagination={{ position: ['bottomCenter'] }}
      sortDirections={['ascend', 'descend', 'ascend']}></Table>
  )
}

export default HistoricTransactionsTableNxtp
