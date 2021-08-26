import { HistoricalTransaction } from '@connext/nxtp-sdk';
import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { testToken } from '../../services/testToken';
import { getChainById } from '../../types/lists';

interface HistoricTransactionsTableNxtpProps {
  historicTransactions: Array<HistoricalTransaction>
}

const HistoricTransactionsTableNxtp = ({
  historicTransactions,
}: HistoricTransactionsTableNxtpProps) => {

  const historicTransactionsColumns: ColumnsType<HistoricalTransaction> = [
    {
      title: 'Date',
      dataIndex: '',
      render: (transaction: HistoricalTransaction) => {
        return new Date(transaction.preparedTimestamp * 1000).toLocaleString()
      },
      sorter: (a: HistoricalTransaction, b: HistoricalTransaction) => a.preparedTimestamp - b.preparedTimestamp,
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
            {transaction.status} {transaction.fulfilledTxHash && (<>(<a href={txLink} target="_blank" rel="nofollow noreferrer">Tx</a>)</>)}
          </>
        )
      }
    },
    {
      title: 'Sending Chain',
      dataIndex: '',
      render: (transaction: HistoricalTransaction) => {
        const chain = getChainById(transaction.crosschainTx.invariant.sendingChainId)
        return <>{chain.id} - {chain.name}</>
      },
      sorter: (a: HistoricalTransaction, b: HistoricalTransaction) => a.crosschainTx.invariant.sendingChainId - b.crosschainTx.invariant.sendingChainId,
    }, {
      title: 'fromAmount',
      dataIndex: '',
      align: 'right',
      render: (transaction: HistoricalTransaction) => {
        const chain = getChainById(transaction.crosschainTx.invariant.sendingChainId)
        const token = testToken[chain.key].find(token => token.id === transaction.crosschainTx.invariant.sendingAssetId.toLowerCase())
        const amount = (parseInt(transaction.crosschainTx.sending?.amount || '0') / (10 ** (token?.decimals || 18))).toFixed(4)
        const link = chain.metamask.blockExplorerUrls[0] + 'token/' + transaction.crosschainTx.invariant.sendingAssetId
        return <>{amount} <a href={link} target="_blank" rel="nofollow noreferrer">{token?.name}</a></>

      },
      sorter: (a: HistoricalTransaction, b: HistoricalTransaction) => parseInt(a.crosschainTx.sending?.amount || '0') - parseInt(b.crosschainTx.sending?.amount || '0')
    },
    {
      title: 'Receiving Chain',
      dataIndex: '',
      render: (transaction: HistoricalTransaction) => {
        const chain = getChainById(transaction.crosschainTx.invariant.receivingChainId)
        return <>{chain.id} - {chain.name}</>
      },
      sorter: (a: HistoricalTransaction, b: HistoricalTransaction) => a.crosschainTx.invariant.receivingChainId - b.crosschainTx.invariant.receivingChainId,
    },
    {
      title: 'toAmount',
      dataIndex: '',
      align: 'right',
      render: (transaction: HistoricalTransaction) => {
        const chain = getChainById(transaction.crosschainTx.invariant.receivingChainId)
        const token = testToken[chain.key].find(token => token.id === transaction.crosschainTx.invariant.receivingAssetId.toLowerCase())
        const amount = (parseInt(transaction.crosschainTx.receiving?.amount || '0') / (10 ** (token?.decimals || 18))).toFixed(4)

        const toChain = getChainById(transaction.crosschainTx.invariant.receivingChainId)
        const txLink = toChain.metamask.blockExplorerUrls[0] + 'tx/' + transaction.fulfilledTxHash

        const link = chain.metamask.blockExplorerUrls[0] + 'token/' + transaction.crosschainTx.invariant.receivingAssetId

        if (transaction.fulfilledTxHash) {
          return <><a href={txLink} target="_blank" rel="nofollow noreferrer">{amount}</a> <a href={link} target="_blank" rel="nofollow noreferrer">{token?.name}</a></>
        } else {
          return <>amount <a href={link} target="_blank" rel="nofollow noreferrer">{token?.name}</a></>
        }
      },
      sorter: (a: HistoricalTransaction, b: HistoricalTransaction) => parseInt(a.crosschainTx.receiving?.amount || '0') - parseInt(b.crosschainTx.receiving?.amount || '0')
    },
    {
      title: 'Fee',
      dataIndex: '',
      align: 'right',
      render: (transaction: HistoricalTransaction) => {
        if (transaction.crosschainTx.sending && transaction.crosschainTx.receiving) {
          const fromAmount = parseInt(transaction.crosschainTx.sending.amount || '0')
          const toAmount = parseInt(transaction.crosschainTx.receiving.amount || '0')
          const diff = fromAmount - toAmount
          const fee = diff / fromAmount
          return fee * 100 + '%'
        }
      },
      //sorter: (a: HistoricalTransaction, b: HistoricalTransaction) => parseInt(a.crosschainTx.receiving?.amount || '0') - parseInt(b.crosschainTx.receiving?.amount || '0')
    },
    // {
    //   title: 'Transaction Id',
    //   dataIndex: '',
    //   render: (transaction: HistoricalTransaction) => {
    //     return <div style={{ width: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{transaction.crosschainTx.invariant.transactionId}</div>
    //   }
    // },
  ]

  return (
    <Table
      columns={historicTransactionsColumns}
      dataSource={historicTransactions}
      style={{ whiteSpace: 'nowrap' }}
      rowKey={(row) => row.crosschainTx.invariant.transactionId}
      pagination={{ position: ['bottomCenter'] }}
      sortDirections={['ascend', 'descend', 'ascend']}
    ></Table>
  )
}

export default HistoricTransactionsTableNxtp;
