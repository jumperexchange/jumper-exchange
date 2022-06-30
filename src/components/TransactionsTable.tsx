import { DeleteOutlined } from '@ant-design/icons'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { Button, Popconfirm, Table } from 'antd'

import { formatTokenAmount } from '../services/utils'
import { getChainById, Route } from '../types'
import ConnectButton from './web3/ConnectButton'

interface ActiveTransactionsTableProps {
  routes: Array<Route>
  selectRoute: Function
  deleteRoute: Function
  historical?: boolean
}

function getStateText(route: Route) {
  if (route.steps.some((step) => step.execution?.status === 'FAILED')) {
    return 'Failed'
  } else if (route.steps.every((step) => step.execution?.status === 'DONE')) {
    return 'Done'
  } else if (
    route.steps.some((step) =>
      step.execution?.process.some((process) => process.status === 'CANCELLED'),
    )
  ) {
    return 'Cancelled'
  } else if (route.steps.some((step) => step.execution?.status === 'CHAIN_SWITCH_REQUIRED')) {
    return 'Chain Switch Required'
  } else if (
    route.steps.some((step) =>
      step.execution?.process.some((process) => process.status === 'ACTION_REQUIRED'),
    )
  ) {
    return 'Action Required'
  } else {
    return 'Pending'
  }
}

function TransactionsTable({
  routes,
  selectRoute,
  deleteRoute,
  historical,
}: ActiveTransactionsTableProps) {
  const web3 = useWeb3React<Web3Provider>()

  const renderActionButton = (route: Route) => {
    if (historical) {
      return (
        <Button
          className="route-delete-button"
          size="large"
          type="ghost"
          shape="round"
          onClick={() => deleteRoute(route)}>
          <DeleteOutlined />
        </Button>
      )
    }
    if (!web3.account) {
      return <ConnectButton></ConnectButton>
    }
    return (
      <span style={{ whiteSpace: 'nowrap' }}>
        <Button
          style={{ marginRight: 10, padding: '3px 16px 4px 16px' }}
          type="primary"
          size={'large'}
          shape="round"
          onClick={() => selectRoute(route)}>
          Resume Swap
        </Button>
        <Popconfirm
          title={<>Are you sure to delete this transfer?</>}
          onConfirm={() => deleteRoute(route)}
          okText="Yes"
          okType="danger"
          placement="left"
          cancelText="No">
          <Button
            style={{ padding: '3px 16px 4px 16px' }}
            className="route-delete-button"
            size="large"
            type="ghost"
            shape="round">
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      </span>
    )
  }

  const columns = [
    {
      title: 'Started',
      dataIndex: 'date',
      width: 150,
    },
    {
      title: 'From Chain',
      dataIndex: 'fromChain',
      width: 150,
    },
    {
      title: 'From Token',
      dataIndex: 'fromToken',
      width: 150,
    },
    {
      title: 'To Chain',
      dataIndex: 'toChain',
      width: 150,
    },
    {
      title: 'To Token',
      dataIndex: 'toToken',
      width: 150,
    },
    {
      title: 'Protocols',
      dataIndex: 'protocols',
      width: 150,
    },
    {
      title: 'State',
      dataIndex: 'state',
      width: 150,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: 100,
    },
  ]

  const data = routes.map((route, index) => {
    const firstStep = route.steps[0]
    const startedDate =
      firstStep.execution?.process?.[0]?.startedAt &&
      new Date(firstStep.execution.process[0].startedAt).toLocaleString()
    const lastStep = route.steps[route.steps.length - 1]
    let toChainId = lastStep.action.toChainId

    // take the real received value instead of the estimation if possible
    const toAmount = lastStep.execution?.toAmount ?? lastStep.estimate.toAmount
    // in case the destination swap fails the user receives the bridge token and the transaction is marked as successful.
    // we need to make sure to always show the token the user actually received
    const toToken = lastStep.execution?.toToken ?? lastStep.action.toToken

    return {
      key: index,
      date: startedDate,
      fromChain: getChainById(firstStep.action.fromChainId).name,
      toChain: getChainById(toChainId).name,
      fromToken: `${formatTokenAmount(firstStep.action.fromToken, firstStep.estimate.fromAmount)}`,
      toToken: `${formatTokenAmount(toToken, toAmount)}`,
      protocols: route.steps.map((step) => step.toolDetails.name).join(' > '),
      state: getStateText(route),
      action: renderActionButton(route),
    }
  })

  return (
    <Table
      bordered={false}
      columns={columns}
      dataSource={data}
      pagination={{
        hideOnSinglePage: true,
        size: 'small',
        position: ['bottomCenter'],
        defaultPageSize: 7,
      }}
      className="tx-table"
    />
  )
}

export default TransactionsTable
