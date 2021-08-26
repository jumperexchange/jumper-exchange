import { CheckOutlined, LoadingOutlined } from '@ant-design/icons';
import { NxtpSdkEvents } from '@connext/nxtp-sdk';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Button, Spin, Table } from 'antd';
import React from 'react';
import { TokenWithAmounts } from '../../types';
import { getChainById } from '../../types/lists';
import { CrossEstimate, TranferStep } from '../../types/server';
import { ActiveTransaction, CrosschainTransaction } from './typesNxtp';

interface TransactionsTableNxtpProps {
  activeTransactions: Array<ActiveTransaction>
  executionRoutes: Array<Array<TranferStep>>
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
                onClick={() => switchChain(action.txData.invariant.sendingChainId)}
              >
                Change Chain
              </Button>
            )
          } else {
            return (
              <Button
                type="link"
                onClick={() => cancelTransfer(action.txData)}
              >
                Cancel
              </Button>
            )
          }
        } else if (action.status === NxtpSdkEvents.ReceiverTransactionPrepared && action.event) {
          return (
            <Button
              onClick={() => openSwapModalFinish(action)}
            >
              Finish
            </Button>
          )
        } else if (
          action.status === NxtpSdkEvents.ReceiverTransactionFulfilled
          || action.status === NxtpSdkEvents.SenderTransactionFulfilled
        ) {
          return <CheckOutlined style={{ margin: 'auto', display: 'block', color: 'green', fontSize: 24 }} />
        } else {
          const index = executionRoutes.findIndex(item => {
            return (item[0].estimate as CrossEstimate).quote.bid.transactionId === action.txData.invariant.transactionId
          })
          if (index !== -1 && executionRoutes[index][0].execution?.status === 'FAILED') {
            return 'Failed'
          } else {
            return <Spin style={{ margin: 'auto', display: 'block' }} indicator={<LoadingOutlined spin style={{ fontSize: 24 }} />} />
          }
        }
      },
    },
    {
      title: 'Status',
      dataIndex: '',
      render: (action: ActiveTransaction) => {
        const index = executionRoutes.findIndex(item => {
          return (item[0].estimate as CrossEstimate).quote.bid.transactionId === action.txData.invariant.transactionId
        })

        if (index !== -1) {
          return <Button onClick={() => setModalRouteIndex(index)}>{action.status}</Button>
        } else {
          return action.status
        }
      }
    },
    {
      title: 'Sending Chain',
      dataIndex: ['txData'],
      render: (txData: CrosschainTransaction) => {
        const chain = getChainById(txData.invariant.sendingChainId)
        return <>{chain.id} - {chain.name}</>
      }
    },
    {
      title: 'Receiving Chain',
      dataIndex: ['txData'],
      render: (txData: CrosschainTransaction) => {
        const chain = getChainById(txData.invariant.receivingChainId)
        return <>{chain.id} - {chain.name}</>
      }
    },
    {
      title: 'Asset',
      dataIndex: ['txData'],
      render: (txData: CrosschainTransaction) => {
        const chain = getChainById(txData.invariant.receivingChainId)
        const token = tokens[chain.key].find(token => token.id === txData.invariant.receivingAssetId.toLowerCase())
        const link = chain.metamask.blockExplorerUrls[0] + 'token/' + txData.invariant.receivingAssetId
        return <a href={link} target="_blank" rel="nofollow noreferrer">{token?.name}</a>
      }
    },
    {
      title: 'Amount',
      dataIndex: ['txData'],
      render: (txData: CrosschainTransaction) => {
        const chain = getChainById(txData.invariant.sendingChainId)
        const token = tokens[chain.key].find(token => token.id === txData.invariant.sendingAssetId.toLowerCase())
        return (parseInt(txData.sending?.amount || '0') / (10 ** (token?.decimals || 18))).toFixed(4)
      }
    },

    {
      title: 'Expires',
      dataIndex: ['txData'],
      render: (txData: CrosschainTransaction) => {
        return (txData.sending?.expiry || 0) > Date.now() / 1000
          ? `${(((txData.sending?.expiry || 0) - Date.now() / 1000) / 3600).toFixed(2)} hours`
          : 'Expired'
      }
    },
    {
      title: 'Transaction Id',
      dataIndex: ['txData'],
      render: (txData: CrosschainTransaction) => {
        return <div style={{ width: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{txData.invariant.transactionId}</div>
      }
    },
  ]

  return (
    <Table
      columns={activeTransactionsColumns}
      dataSource={activeTransactions}
      style={{ whiteSpace: 'nowrap' }}
      pagination={false}
      rowKey={(row) => row.txData.invariant.transactionId}
    ></Table>
  )
}

export default TransactionsTableNxtp;
