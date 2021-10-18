import { Button, Table } from 'antd';
import { formatTokenAmount } from '../services/utils';
import { CrossAction, CrossEstimate, getChainById, SwapAction, SwapEstimate, TransferStep } from '../types';

interface ActiveTrasactionsTableProps {
  routes: Array<TransferStep[]>,
  selectRoute: Function
}



function ActiveTrasactionsTable ({routes, selectRoute}: ActiveTrasactionsTableProps) {

  const renderResumeButton = (route:TransferStep[]) =>{
    return <Button type='ghost' shape='round' onClick={() => selectRoute(route)}>Show Swap</Button>
  }
  const columns = [
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
      dataIndex: 'fromToken',
    },
    {
      title: 'Action',
      dataIndex: 'resume',
    },
  ];


  const data = routes.map((route, index) => {
    const firstStep = route[0]
    const lastStep = route[route.length-1]
    const firstAction = firstStep.action.type === 'swap'? firstStep.action as SwapAction : firstStep.action as CrossAction
    const firstEstimate = lastStep.action.type === 'swap'? lastStep.estimate as SwapEstimate : lastStep.estimate as CrossEstimate
    const lastAction = lastStep.action.type === 'swap'? lastStep.action as SwapAction : lastStep.action as CrossAction
    const lastEstimate = lastStep.action.type === 'swap'? lastStep.estimate as SwapEstimate : lastStep.estimate as CrossEstimate
    return {
      key: index,
      fromChain: getChainById (firstAction.chainId).name,
      toChain: getChainById (lastAction.chainId).name,
      fromToken: `${formatTokenAmount(firstStep.action.token, firstEstimate.fromAmount)}`,
      toToken: `${formatTokenAmount(lastAction.toToken, lastEstimate.toAmount)}`,
      resume: renderResumeButton(route)
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

export default ActiveTrasactionsTable
