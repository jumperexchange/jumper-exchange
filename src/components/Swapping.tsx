import { BrowserNode } from '@connext/vector-browser-node';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Button, Timeline, Typography } from 'antd';
import React, { useState } from 'react';
import * as connext from '../services/connext';
import { formatTokenAmount } from '../services/utils';
import { getChainById, getChainByKey } from '../types/lists';
import { CrossAction, DepositAction, Execution, SwapAction, SwapEstimate, TranferStep, WithdrawAction } from '../types/server';
import StateChannelBalances from './StateChannelBalances';
import ConnectButton from './web3/ConnectButton';

interface SwappingProps {
  route: Array<TranferStep>,
  updateRoute: Function,
}

const Swapping = ({ route, updateRoute }: SwappingProps) => {
  // Connext
  const [node, setNode] = useState<BrowserNode>(connext.getNode())
  const [loggingIn, setLoggingIn] = useState<boolean>(false)
  const initializeConnext = async () => {
    setLoggingIn(true)
    try {
      const _node = await connext.initNode()
      setNode(_node)
    } catch (e) {
      console.log('Initiation error', { e })
    } finally {
      setLoggingIn(false)
    }
  }

  // Wallet
  const web3 = useWeb3React<Web3Provider>()

  // Swap
  const updateStatus = (step: TranferStep, status : Execution) => {
    console.log('STATUS_CHANGE:', status)
    step.execution = status

    console.log('route', route)
    updateRoute(route)
  }

  const triggerDeposit = (step: TranferStep) => {
    if (!node || !web3.library) return
    const depositAction = step.action as DepositAction

    connext.triggerDeposit(node, web3.library.getSigner(), depositAction.chainId, depositAction.token.id, depositAction.amount, (status: Execution) => updateStatus(step, status))
  }

  const triggerSwap = (step: TranferStep) => {
    if (!node) return
    const swapAction = step.action as SwapAction
    const swapEstimate = step.estimate as SwapEstimate
    const chainId = getChainByKey(swapAction.chainKey).id // will be replaced by swapAction.chainId

    connext.triggerSwap(node, chainId, swapEstimate.path, swapAction.fromToken.id, swapAction.toToken.id, 1000000000000000 || swapAction.fromAmount, (status: Execution) => updateStatus(step, status))
  }

  const triggerTransfer = (step: TranferStep) => {
    if (!node) return
    const crossAction = step.action as CrossAction
    const fromChainId = getChainByKey(crossAction.chainKey).id // will be replaced by crossAction.chainId
    const toChainId = getChainByKey(crossAction.toChainKey).id // will be replaced by crossAction.toChainId

    connext.triggerTransfer(node, fromChainId, toChainId, crossAction.fromToken.id, crossAction.toToken.id, crossAction.amount, (status: Execution) => updateStatus(step, status))
  }

  const triggerWithdraw = (step: TranferStep) => {
    if (!node || !web3.account) return
    const withdrawAction = step.action as WithdrawAction
    const chainId = getChainByKey(withdrawAction.chainKey).id // will be replaced by withdrawAction.chainId
    const recipient = withdrawAction.recipient ?? web3.account

    const update = (status: Execution) => {
      console.log('update in ', step)
      updateStatus(step, status)
    }

    connext.triggerWithdraw(node, chainId, recipient, withdrawAction.token.id, withdrawAction.amount, update)
  }

  // TODO: move in own component
  const switchChain = async (chainId: number) => {
    if (web3.chainId === route[0].action.chainId) return // already on right chain

    const ethereum = (window as any).ethereum
    if (typeof ethereum === 'undefined') return

    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: getChainById(chainId).metamask?.chainId }],
      })
    } catch (error) {
      console.error(error)
      if (error.code === 4902) {
        addChain(chainId)
      }
    }
  }
  // TODO: move in own component
  const addChain = async (chainId: number) => {
    const ethereum = (window as any).ethereum
    if (typeof ethereum === 'undefined') return

    const params = getChainById(chainId).metamask
    try {
      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [params],
      })
    } catch (error) {
      console.error(`Error adding chain ${chainId}: ${error.message}`)
    }
  }

  const parseExecution = (execution?: Execution) => {
    if (!execution) {
      return []
    }

    return execution.process.map((process, index) => {
      return (
        <p>
          <Typography.Text
            key={index}
            type={process.status === 'DONE' ? 'success' : (process.status === 'FAILED' ? 'danger' : undefined) }
            className={process.status === 'PENDING' ? 'flashing' : undefined}
          >
            {process.message}
          </Typography.Text>
        </p>
      )
    })
  }

  const parseStepToTimeline = (step: TranferStep) => {
    const executionSteps = parseExecution(step.execution)
    const color = step.execution && step.execution.status === 'DONE' ? 'green' : (node ? 'blue' : 'gray')
    const hasFailed = step.execution && step.execution.status === 'FAILED'

    switch (step.action.type) {
      case 'deposit': {
        const triggerButton = <Button disabled={!node || !web3.library || web3.chainId !== route[0].action.chainId} onClick={() => triggerDeposit(step)}>trigger Deposit</Button>
        return [
          <Timeline.Item color={color}>
            <h4>Deposit</h4>
            <span>{formatTokenAmount(step.action.token, step.estimate?.fromAmount)} from {web3.account ? web3.account.substr(0, 4) : '0x'}...</span>
          </Timeline.Item>,
          <Timeline.Item color={color}>
            { !step.execution ? triggerButton : executionSteps }
            { hasFailed ? triggerButton : undefined }
          </Timeline.Item>,
        ]
      }

      case 'swap': {
        const triggerButton = <Button disabled={!node} onClick={() => triggerSwap(step)} >trigger Swap</Button>
        return [
          <Timeline.Item color={color}>
            <h4>Swap</h4>
            <span>{formatTokenAmount(step.action.fromToken, step.estimate?.fromAmount)} for {formatTokenAmount(step.action.toToken, step.estimate?.toAmount)} on {step.action.chainKey}</span>
          </Timeline.Item>,
          <Timeline.Item color={color}>
            { !step.execution ? triggerButton : executionSteps }
            { hasFailed ? triggerButton : undefined }
          </Timeline.Item>
        ]
      }

      case 'cross': {
        const triggerButton = <Button disabled={!node} onClick={() => triggerTransfer(step)} >trigger Transfer</Button>

        return [
          <Timeline.Item color={color}>
            <h4>Transfer</h4>
            <span>{formatTokenAmount(step.action.fromToken, step.estimate?.fromAmount)} on {step.action.chainKey} to {formatTokenAmount(step.action.toToken, step.estimate?.toAmount)} {step.action.toChainKey}</span>
          </Timeline.Item>,
          <Timeline.Item color={color}>
            { !step.execution ? triggerButton : executionSteps }
            { hasFailed ? triggerButton : undefined }
          </Timeline.Item>
        ]
      }

      case 'withdraw':
        const triggerButton = <Button disabled={!node || !web3.account} onClick={() => triggerWithdraw(step)}>trigger Withdraw</Button>
        return [
          <Timeline.Item color={color}>
            <h4>Withdraw</h4>
            <span>{formatTokenAmount(step.action.token, step.estimate?.toAmount)} to {web3.account ? web3.account.substr(0, 4) : '0x'}...</span>
          </Timeline.Item>,
          <Timeline.Item color={color}>
            { !step.execution ? triggerButton : executionSteps }
            { hasFailed ? triggerButton : undefined }
          </Timeline.Item>
        ]
    }
  }

  return (<>
    <Timeline mode="alternate">
      <Timeline.Item color="green"></Timeline.Item>
      <Timeline.Item color={web3.account ? 'green' : 'blue'}>
        Connect Wallet on {route[0].action.chainKey}
      </Timeline.Item>
      <Timeline.Item color={web3.account ? 'green' : 'blue'}>
        {!web3.account ? <ConnectButton /> : <>
          Connected with {web3.account.substr(0, 4)}...
          {web3.chainId !== route[0].action.chainId ? <Button onClick={() => switchChain(route[0].action.chainId)}>switch chain to {route[0].action.chainId}</Button> : `on chain ${web3.chainId}`}
        </>}
      </Timeline.Item>
      <Timeline.Item color={node ? 'green' : 'blue'}>
        Login to Connext
      </Timeline.Item>
      <Timeline.Item color={node ? 'green' : 'blue'}>
        {!node && !loggingIn && <Button onClick={() => initializeConnext()}>Login to Connext</Button>}
        {!node && loggingIn && 'loading...'}
        {node && 'connected'}
      </Timeline.Item>
      { route.map(parseStepToTimeline) }
    </Timeline>

    <StateChannelBalances node={node}></StateChannelBalances>
  </>)
}

export default Swapping

