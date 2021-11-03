import { LoginOutlined } from '@ant-design/icons'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { Button, Table } from 'antd'

import { formatTokenAmount } from '../services/utils'
import {
  CrossAction,
  CrossEstimate,
  getChainById,
  SwapAction,
  SwapEstimate,
  TransferStep,
} from '../types'
import { injected } from './web3/connectors'

interface ActiveTrasactionsTableProps {
  routes: Array<TransferStep[]>
  routeAction: Function
  historical?: boolean
}

function TrasactionsTable({ routes, routeAction, historical }: ActiveTrasactionsTableProps) {
  const web3 = useWeb3React<Web3Provider>()
  const { activate } = useWeb3React()
  const login = () => activate(injected)

  const renderActionButton = (route: TransferStep[]) => {
    if (historical) {
      return (
        <Button danger type="ghost" shape="round" onClick={() => routeAction(route)}>
          Delete
        </Button>
      )
    }
    if (!web3.account) {
      return (
        <Button type="ghost" shape="round" icon={<LoginOutlined />} onClick={() => login()}>
          Connect Wallet
        </Button>
      )
    }
    return (
      <Button type="ghost" shape="round" onClick={() => routeAction(route)}>
        Resume Swap
      </Button>
    )
  }

  const columns = [
    {
      title: 'Started',
      dataIndex: 'date',
    },
    {
      title: 'From Chain',
      dataIndex: 'fromChain',
    },
    {
      title: 'From Token',
      dataIndex: 'fromToken',
    },
    {
      title: 'To Chain',
      dataIndex: 'toChain',
    },
    {
      title: 'To Token',
      dataIndex: 'toToken',
    },
    {
      title: 'Protocols',
      dataIndex: 'protocols',
    },
    {
      title: 'State',
      dataIndex: 'state',
    },
    {
      title: 'Action',
      dataIndex: 'action',
    },
  ]

  const data = routes.map((route, index) => {
    const startedDate = new Date(parseInt(route[0].id!)).toLocaleString()
    const firstStep = route[0]
    const lastStep = route[route.length - 1]
    const firstAction =
      firstStep.action.type === 'swap'
        ? (firstStep.action as SwapAction)
        : (firstStep.action as CrossAction)
    const firstEstimate =
      lastStep.action.type === 'swap'
        ? (lastStep.estimate as SwapEstimate)
        : (lastStep.estimate as CrossEstimate)
    const lastAction =
      lastStep.action.type === 'swap'
        ? (lastStep.action as SwapAction)
        : (lastStep.action as CrossAction)
    const lastEstimate =
      lastStep.action.type === 'swap'
        ? (lastStep.estimate as SwapEstimate)
        : (lastStep.estimate as CrossEstimate)
    const state = route.some((step) => step.execution?.status === 'ACTION_REQUIRED')
      ? 'Action Required'
      : 'Pending'

    let toChainId
    if (firstStep.action.type === 'swap') {
      toChainId = firstAction.chainId
    } else {
      toChainId = (firstStep.action as CrossAction).toChainId
    }

    return {
      key: index,
      date: startedDate,
      fromChain: getChainById(firstAction.chainId).name,
      toChain: getChainById(toChainId).name,
      fromToken: `${formatTokenAmount(firstAction.token, firstEstimate.fromAmount)}`,
      toToken: `${formatTokenAmount(lastAction.toToken, lastEstimate.toAmount)}`,
      protocols: route.map((step) => (step.action as CrossAction).tool).join(' > '),
      state: state,
      action: renderActionButton(route),
    }
  })

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{ position: [] }}
      className="active-tx-table"
    />
  )
}

export default TrasactionsTable
