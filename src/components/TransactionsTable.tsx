import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { injected } from './web3/connectors';

import { Button, Table } from 'antd';
import { formatTokenAmount } from '../services/utils';
import { CrossAction, CrossEstimate, getChainById, SwapAction, SwapEstimate, TransferStep } from '../types';
import { DeleteOutlined, LoginOutlined } from '@ant-design/icons';

interface ActiveTrasactionsTableProps {
  routes: Array<TransferStep[]>,
  selectRoute: Function,
  deleteRoute: Function,
  historical?: boolean
}

function getStateText (route: TransferStep[]) {
  if (route.some(step => step.execution?.status === 'FAILED')) {
    return 'Failed'
  } else if ( route.some(step => step.execution?.status === 'ACTION_REQUIRED') ){
    return 'Action Required'
  } else if ( route.every(step => step.execution?.status === 'DONE') ) {
    return 'Done'
  } else {
    return "Pending"
  }
}


function TrasactionsTable ({routes, selectRoute, deleteRoute, historical}: ActiveTrasactionsTableProps) {
  const web3 = useWeb3React<Web3Provider>()
  const { activate } = useWeb3React()
  const login = () => activate(injected)

  const renderActionButton = (route:TransferStep[]) =>{
    if(historical){
      return <Button danger type='ghost' shape='round' onClick={() => deleteRoute(route)}><DeleteOutlined /></Button>
    }
    if (!web3.account) {
      return <Button type='ghost' shape='round' icon={<LoginOutlined />} onClick={() => login()}>Connect Wallet</Button>
    }
    return <>
        <Button style={{marginRight: 10}} type='ghost' shape='round' onClick={() => selectRoute(route)}>Resume Swap</Button>
        <Button danger type='ghost' shape='round' onClick={() => deleteRoute(route)}><DeleteOutlined /></Button>
      </>

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
  ];


  const data = routes.map((route, index) => {
    const startedDate = new Date(parseInt(route[0].id!)).toLocaleString()
    const firstStep = route[0]
    const lastStep = route[route.length-1]
    const firstAction = firstStep.action.type === 'swap'? firstStep.action as SwapAction : firstStep.action as CrossAction
    const firstEstimate = lastStep.action.type === 'swap'? lastStep.estimate as SwapEstimate : lastStep.estimate as CrossEstimate
    const lastAction = lastStep.action.type === 'swap'? lastStep.action as SwapAction : lastStep.action as CrossAction
    const lastEstimate = lastStep.action.type === 'swap'? lastStep.estimate as SwapEstimate : lastStep.estimate as CrossEstimate


    let toChainId
    if(firstStep.action.type === 'swap'){
      toChainId = firstAction.chainId
    } else{
      toChainId = (firstStep.action as CrossAction).toChainId
    }

    return {
      key: index,
      date: startedDate,
      fromChain: getChainById (firstAction.chainId).name,
      toChain: getChainById(toChainId).name,
      fromToken: `${formatTokenAmount(firstAction.token, firstEstimate.fromAmount)}`,
      toToken: `${formatTokenAmount(lastAction.toToken, lastEstimate.toAmount)}`,
      protocols: route.map(step => (step.action as CrossAction ).tool).join(' > '),
      state: getStateText(route),
      action: renderActionButton(route)
    }
  })


  return (
    <Table
    columns={columns}
    dataSource={data}
    pagination={{ hideOnSinglePage:true, size:"small",  position: ['bottomCenter'] }}
    className="tx-table"
    />
  )
}

export default TrasactionsTable
