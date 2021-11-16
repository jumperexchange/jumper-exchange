import { DeleteOutlined, LoginOutlined } from '@ant-design/icons'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { Button, Popconfirm, Table } from 'antd'

import { formatTokenAmount } from '../services/utils'
import { getChainById, Route } from '../types'
import { injected } from './web3/connectors'

interface ActiveTrasactionsTableProps {
  routes: Array<Route>
  selectRoute: Function
  deleteRoute: Function
  historical?: boolean
}

function getStateText(route: Route) {
  if (route.steps.some((step) => step.execution?.status === 'FAILED')) {
    return 'Failed'
  } else if (route.steps.some((step) => step.execution?.status === 'ACTION_REQUIRED')) {
    return 'Action Required'
  } else if (route.steps.every((step) => step.execution?.status === 'DONE')) {
    return 'Done'
  } else {
    return 'Pending'
  }
}

function TrasactionsTable({
  routes,
  selectRoute,
  deleteRoute,
  historical,
}: ActiveTrasactionsTableProps) {
  const web3 = useWeb3React<Web3Provider>()
  const { activate } = useWeb3React()
  const login = () => activate(injected)

  const renderActionButton = (route: Route) => {
    if (historical) {
      return (
        <Button danger type="ghost" shape="round" onClick={() => deleteRoute(route)}>
          <DeleteOutlined />
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
      <span style={{ whiteSpace: 'nowrap' }}>
        <Button
          style={{ marginRight: 10 }}
          type="ghost"
          shape="round"
          onClick={() => selectRoute(route)}>
          Resume Swap
        </Button>
        <Popconfirm
          title={<>Are you sure to delete this transfer?</>}
          onConfirm={() => deleteRoute(route)}
          // onCancel={cancel}
          okText="Yes"
          okType="danger"
          cancelText="No">
          <Button danger type="ghost" shape="round" onClick={() => {}}>
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
    const firstStep = route.steps[0]
    const startedDate =
      firstStep.execution?.process[0].startedAt &&
      new Date(firstStep.execution?.process[0].startedAt).toLocaleString()
    const lastStep = route.steps[route.steps.length - 1]
    // const firstAction = firstStep.action
    // const firstEstimate = firstStep.estimate
    // const lastAction = lastStep.action
    // const lastEstimate = lastStep.estimate

    let toChainId = lastStep.action.toChainId

    return {
      key: index,
      date: startedDate,
      fromChain: getChainById(firstStep.action.fromChainId).name,
      toChain: getChainById(toChainId).name,
      fromToken: `${formatTokenAmount(firstStep.action.fromToken, firstStep.estimate.fromAmount)}`,
      toToken: `${formatTokenAmount(lastStep.action.toToken, lastStep.estimate.toAmount)}`,
      protocols: route.steps.map((step) => step.tool).join(' > '),
      state: getStateText(route),
      action: renderActionButton(route),
    }
  })

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{ hideOnSinglePage: true, size: 'small', position: ['bottomCenter'] }}
      className="tx-table"
    />
  )
}

export default TrasactionsTable
