import { DeleteOutlined, LoadingOutlined, LoginOutlined } from '@ant-design/icons'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { Button, Popconfirm, Table } from 'antd'

import { formatTokenAmount, isWalletDeactivated } from '../services/utils'
import { findTool, getChainById, Route } from '../types'
import { getInjectedConnector } from './web3/connectors'

interface ActiveTrasactionsTableProps {
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
  } else if (route.steps.some((step) => step.execution?.status === 'CANCELLED')) {
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

function TrasactionsTable({
  routes,
  selectRoute,
  deleteRoute,
  historical,
}: ActiveTrasactionsTableProps) {
  const web3 = useWeb3React<Web3Provider>()
  const { active, activate } = useWeb3React()
  const login = async () => activate(await getInjectedConnector())

  const renderActionButton = (route: Route) => {
    if (historical) {
      return (
        <Button danger type="ghost" shape="round" onClick={() => deleteRoute(route)}>
          <DeleteOutlined />
        </Button>
      )
    }
    if (!web3.account) {
      if (!active && isWalletDeactivated(web3.account)) {
        return (
          <Button disabled={true} type="ghost" shape="round" icon={<LoadingOutlined />}>
            Connect Wallet
          </Button>
        )
      }

      return (
        <Button type="ghost" shape="round" icon={<LoginOutlined />} onClick={() => login()}>
          Connect Wallet
        </Button>
      )
    }
    return (
      <span style={{ whiteSpace: 'nowrap' }}>
        <Button
          style={{ marginRight: 10, padding: '3px 16px 4px 16px' }}
          type="primary"
          shape="round"
          onClick={() => selectRoute(route)}>
          Resume Swap
        </Button>
        <Popconfirm
          title={<>Are you sure to delete this transfer?</>}
          onConfirm={() => deleteRoute(route)}
          okText="Yes"
          okType="danger"
          cancelText="No">
          <Button style={{ padding: '3px 16px 4px 16px' }} danger type="ghost" shape="round">
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
      firstStep.execution?.process?.[0]?.startedAt &&
      new Date(firstStep.execution.process[0].startedAt).toLocaleString()
    const lastStep = route.steps[route.steps.length - 1]
    let toChainId = lastStep.action.toChainId

    return {
      key: index,
      date: startedDate,
      fromChain: getChainById(firstStep.action.fromChainId).name,
      toChain: getChainById(toChainId).name,
      fromToken: `${formatTokenAmount(firstStep.action.fromToken, firstStep.estimate.fromAmount)}`,
      toToken: `${formatTokenAmount(lastStep.action.toToken, lastStep.estimate.toAmount)}`,
      protocols: route.steps.map((step) => findTool(step.tool)?.name).join(' > '),
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
