import { ArrowRightOutlined, LoadingOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Avatar, Button, Divider, Row, Space, Spin, Timeline, Tooltip, Typography } from 'antd';
import { BigNumber } from 'bignumber.js';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import connextIcon from '../assets/icons/connext.png';
import oneinchIcon from '../assets/icons/oneinch.png';
import paraswapIcon from '../assets/icons/paraswap.png';
import harmonyIcon from '../assets/icons/harmony.png'
import hopIcon from '../assets/icons/hop.png';
import walletIcon from '../assets/wallet.png';
import { lifinance } from '../services/lifinance';
import { switchChain, switchChainAndAddToken } from '../services/metamask';
import { createAndPushProcess, initStatus, setStatusDone, setStatusFailed } from '../services/status';
import { formatTokenAmount } from '../services/utils';
import { Chain, ChainKey, ChainPortfolio, CrossAction, CrossEstimate, CrossStep, Execution, getChainById, getChainByKey, getIcon, SwapAction, SwapEstimate, SwapStep, Token, TransferStep } from '../types';
import Clock from './Clock';
import LoadingIndicator from './LoadingIndicator';
import { getBalancesForWallet } from '../services/balanceService';
import { useMediaQuery } from 'react-responsive';
import { storeActiveRoute } from '../services/localStorage'

import {UniswapExecutionManager} from '../services/uniswaps.execute';
import {ParaswapExecutionManager} from '../services/paraswap.execute';
import {NXTPExecutionManager} from '../services/nxtp.execute';
import {OneInchExecutionManager} from '../services/1inch.execute';
import {HopExecutionManager} from '../services/hop.execute';
import {HorizonExecutionManager} from '../services/horizon.execute';


interface SwappingProps {
  route: Array<TransferStep>,
  updateRoute: Function,
  onSwapDone: Function
}


const Swapping = ({ route, updateRoute, onSwapDone }: SwappingProps) => {
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });

  const [swapStartedAt, setSwapStartedAt] = useState<number>()
  const [swapDoneAt, setSwapDoneAt] = useState<number>()
  const [isSwapping, setIsSwapping] = useState<boolean>(false)
  const [alerts] = useState<Array<JSX.Element>>([])
  const [finalBalance, setFinalBalance] = useState<{token: Token, portfolio: ChainPortfolio}>()

  const [uniswapExecutionManager] = useState<UniswapExecutionManager>(new UniswapExecutionManager())
  const [paraswapExecutionManager] = useState<ParaswapExecutionManager>(new ParaswapExecutionManager())
  const [oneInchExecutionManager] = useState<OneInchExecutionManager>(new OneInchExecutionManager())
  const [nxtpExecutionManager] = useState<NXTPExecutionManager>(new NXTPExecutionManager())
  const [hopExecutionManager] = useState<HopExecutionManager>(new HopExecutionManager())
  const [horizonExecutionManager] = useState<HorizonExecutionManager>(new HorizonExecutionManager())




  // Wallet
  const web3 = useWeb3React<Web3Provider>()
  useEffect(() => {
    return () =>{
      uniswapExecutionManager.setShouldContinue(false)
      paraswapExecutionManager.setShouldContinue(false)
      oneInchExecutionManager.setShouldContinue(false)
      nxtpExecutionManager.setShouldContinue(false)
      hopExecutionManager.setShouldContinue(false)
      horizonExecutionManager.setShouldContinue(false)
    }
  }, [ uniswapExecutionManager, paraswapExecutionManager, oneInchExecutionManager, nxtpExecutionManager, hopExecutionManager, horizonExecutionManager ])

  // Swap
  const updateStatus = (step: TransferStep, status: Execution) => {
    step.execution = status
    storeActiveRoute(route)
    updateRoute(route)
  }

  const checkChain = async (step: TransferStep) => {
    const { status, update } = initStatus((status: Execution) => updateStatus(step, status))
    const chain = getChainById(step.action.chainId)
    const switchProcess = createAndPushProcess("switchProcess", update, status, `Change Chain to ${chain.name}`)
    try {
      const switched = await switchChain(step.action.chainId)
      if (!switched) {
        throw new Error('Chain was not switched')
      }
    } catch (e: any) {
      if (e.message) switchProcess.errorMessage = e.message
      if (e.code) switchProcess.errorCode = e.code
      setStatusFailed(update, status, switchProcess)
      setIsSwapping(false)
      return false
    }
    setStatusDone(update, status, switchProcess)
    return true
  }

  const triggerSwap = async (step: TransferStep, previousStep?: TransferStep) => {
    if (!web3.account || !web3.library) return
    const swapAction = step.action as SwapAction
    const swapEstimate = step.estimate as SwapEstimate
    const swapExecution = step.execution as Execution
    const fromAddress = web3.account
    const toAddress = fromAddress


    // get right amount
    let fromAmount: BigNumber
    if (previousStep && previousStep.execution && previousStep.execution.toAmount) {
      fromAmount = new BigNumber(previousStep.execution.toAmount)
    } else {
      fromAmount = new BigNumber(swapAction.amount)
    }

    // ensure chain is set
    if (web3.chainId !== step.action.chainId) {
      if (!(await checkChain(step))) return
    }
    switch (swapAction.tool) {
      case 'uniswap':
      case 'pancakeswap':
      case 'honeyswap':
      case 'quickswap':
      case 'spookyswap':
      case 'viperswap':
      case 'sushiswap':
        return await uniswapExecutionManager.executeSwap(web3.library.getSigner(), swapAction, swapEstimate, fromAddress, toAddress, (status: Execution) => updateStatus(step, status), swapExecution)
      case 'paraswap':
        return await paraswapExecutionManager.executeSwap(web3.library.getSigner(), swapAction, swapEstimate, fromAmount, fromAddress, toAddress, (status: Execution) => updateStatus(step, status), swapExecution)
      case '1inch':
        return await oneInchExecutionManager.executeSwap(web3.library.getSigner(), swapAction, swapEstimate, fromAmount, fromAddress, toAddress, (status: Execution) => updateStatus(step, status), swapExecution)
      default:
        return await uniswapExecutionManager.executeSwap(web3.library.getSigner(), swapAction, swapEstimate, fromAddress, toAddress, (status: Execution) => updateStatus(step, status), swapExecution)
    }
  }

  const triggerCross = async (step: TransferStep, previousStep?: TransferStep) => {
    if (!web3.account || !web3.library) return
    const crossAction = step.action as CrossAction
    const crossExecution = step.execution as Execution

    // get right amount
    let fromAmount: BigNumber
    if (previousStep && previousStep.execution && previousStep.execution.toAmount) {
      fromAmount = new BigNumber(previousStep.execution.toAmount)
    } else {
      fromAmount = new BigNumber(crossAction.amount)
    }

    // ensure chain is set
    if (web3.chainId !== step.action.chainId) {
      if (!(await checkChain(step))) return
    }

    switch (crossAction.tool) {
      case 'nxtp':
        return await nxtpExecutionManager.executeCross(web3.library.getSigner(), step, fromAmount, web3.account, (status: Execution) => updateStatus(step, status), crossExecution);
      case 'hop':
        return await hopExecutionManager.executeCross(web3.library.getSigner(), crossAction.token.key, fromAmount.toFixed(0), crossAction.chainId, crossAction.toChainId,(status: Execution) => updateStatus(step, status), crossExecution)
      case 'horizon':
        return await horizonExecutionManager.executeCross(crossAction.token, fromAmount, crossAction.chainId, crossAction.toChainId, web3.account, (status: Execution) => updateStatus(step, status), crossExecution)
      default:
        throw new Error('Should never reach here, bridge not defined')
    }
  }

  const parseExecution = (execution?: Execution) => {
    if (!execution) {
      return []
    }
    return execution.process.map((process, index) => {
        const type = process.status === 'DONE' ? 'success' : (process.status === 'FAILED' ? 'danger' : undefined)
        const hasFailed = process.status === 'FAILED'
        return (
          <span key={index} style={{ display: 'flex'}}>
            <Typography.Text
              type={type}
              style={{ maxWidth: 250}}
              className={(isSwapping && process.status === 'PENDING') ? 'flashing' : undefined}
            >
              <p>{process.message}</p>
              {hasFailed &&
                <Typography.Text type="secondary" style={{ whiteSpace: "pre-wrap" }} >
                  {'errorCode' in process && `Error Code: ${process.errorCode} \n`}
                  {'errorMessage' in process && `${process.errorMessage.substring(0, 150)}${process.errorMessage.length >150?'...':''}`}
                </Typography.Text>

              }

            </Typography.Text>
            <Typography.Text style={{ marginLeft: 'auto', minWidth: 35 }}>
              <Clock startedAt={process.startedAt} successAt={process.doneAt} failedAt={process.failedAt} />
            </Typography.Text>
          </span>
        )
      })
  }

  const getChainAvatar = (chainKey: ChainKey) => {
    const chain = getChainByKey(chainKey)

    return (
      <Tooltip title={chain.name}>
        <Avatar size="small" src={getIcon(chain.key)} alt={chain.name}></Avatar>
      </Tooltip>
    )
  }

  const getExchangeAvatar = (chainId: number) => {
    const chain = getChainById(chainId)

    return (
      <Tooltip title={chain.exchange?.name}>
        <Avatar size="small" src={getIcon(chain.exchange?.name)} alt={chain.exchange?.name}></Avatar>
      </Tooltip>
    )
  }

  const connextAvatar = (
    <Tooltip title="Connext">
      <Avatar size="small" src={connextIcon} alt="Connext"></Avatar>
    </Tooltip>
  )

  const hopAvatar = (
    <Tooltip title="Hop">
      <Avatar size="small" src={hopIcon} alt="Hop"></Avatar>
    </Tooltip>
  )

  const paraswapAvatar = (
    <Tooltip title="Paraswap">
      <Avatar size="small" src={paraswapIcon} alt="Paraswap"></Avatar>
    </Tooltip>
  )

  const oneinchAvatar = (
    <Tooltip title="1inch">
      <Avatar size="small" src={oneinchIcon} alt="1inch"></Avatar>
    </Tooltip>
  )

  const horizonAvatar = (
    <Tooltip title="1inch">
      <Avatar size="small" src={harmonyIcon} alt="1inch"></Avatar>
    </Tooltip>
  )

  const parseStepToTimeline = (step: TransferStep, index: number, route: Array<TransferStep>) => {
    const executionSteps = parseExecution(step.execution)
    const isDone = step.execution && step.execution.status === 'DONE'
    const isLoading = isSwapping && step.execution && step.execution.status === 'PENDING'
    const isPaused = !isSwapping && step.execution && step.execution.status === 'PENDING'
    const color = isDone ? 'green' : (step.execution ? 'blue' : 'gray')
    switch (step.action.type) {

      case 'swap': {
        return [
          <Timeline.Item position={isMobile? 'right': 'right'} key={index + '_left'} color={color}>
            <h4>Swap on {step.action.tool === '1inch' ? oneinchAvatar : (step.action.tool === 'paraswap' ? paraswapAvatar : getExchangeAvatar(step.action.chainId))}</h4>
            <span>{formatTokenAmount(step.action.token, step.estimate?.fromAmount)} <ArrowRightOutlined /> {formatTokenAmount(step.action.toToken, step.estimate?.toAmount)}</span>
          </Timeline.Item>,
          <Timeline.Item position={isMobile? 'right': 'left'} key={index + '_right'} color={color} dot={isLoading? <LoadingOutlined /> : (isPaused? <PauseCircleOutlined /> :null)}>
            {executionSteps}
          </Timeline.Item>,
        ]
      }

      case 'cross': {
        const crossAction = step.action as CrossAction
        const crossEstimate = step.estimate as CrossEstimate
        let avatar;
        switch (crossAction.tool) {
          case 'nxtp':
            avatar = connextAvatar
            break;
          case 'hop':
            avatar = hopAvatar
            break;
          case 'horizon':
            avatar = horizonAvatar
            break;
          default:
            break;
        }
        return [
          <Timeline.Item position={isMobile? 'right': 'right'} key={index + '_left'} color={color}>
            <h4>Transfer from {getChainAvatar(getChainById(crossAction.chainId).key)} to {getChainAvatar(getChainById(crossAction.toChainId).key)} via {avatar}</h4>
            <span>{formatTokenAmount(crossAction.token, crossEstimate.fromAmount)} <ArrowRightOutlined /> {formatTokenAmount(crossAction.toToken, crossEstimate.toAmount)}</span>
          </Timeline.Item>,
          <Timeline.Item position={isMobile? 'right': 'left'} style={{paddingBottom: isMobile? 30: 0}} key={index + '_right'} color={color} dot={isLoading? <LoadingOutlined /> : null}>
            {executionSteps}
          </Timeline.Item>,
        ]
      }

      default:
        console.warn('should never reach here')
    }
  }

  const triggerStep = async (index: number, route: Array<TransferStep>) => {
    setIsSwapping(true)
    const step = route[index]
    const previousStep = index > 0 ? route[index - 1] : undefined
    try{
      switch (step.action.type) {
        case 'swap':
          return await triggerSwap(step as SwapStep, previousStep)
        case 'cross':
           await triggerCross(step, previousStep)
          break
        default:
          setIsSwapping(false)
          throw new Error('Invalid Step')
      }
    } catch{
      setIsSwapping(false)
    }

  }

  const triggerLifi = async () => {
    // ensure chain is set
    if (web3.chainId !== route[0].action.chainId) {
      if (!(await checkChain(route[0]))) return
    }

    await lifinance.executeLifi(web3.library!.getSigner(), route, (status: Execution) => updateStatus(route[0], status))
  }

  const isLifiSupported = (route: Array<TransferStep>) => {
    const crossStep = route.find(step => step.action.type === 'cross')
    if (!crossStep) return false // perform simple swaps directly

    const crossAction = crossStep.action as CrossAction

    return crossAction.tool === 'nxtp' && lifinance.supportedChains.includes(crossAction.chainId) && lifinance.supportedChains.includes(crossAction.toChainId)
  }

  const startCrossChainSwap = async () => {
    for (let i = 0; i < route.length; i++){
      route[i].id = new Date().getTime().toString()
    }
    storeActiveRoute(route)
    setIsSwapping(true)
    setSwapStartedAt(Date.now())
  }

  const resumeCrossChainSwap = async () => {
    // remove failed
    for (let index = 0; index < route.length; index++) {
      if (route[index].execution?.status === 'PENDING') {
        triggerStep(index, route) // triggerStep sets isSwapping = true
      }
    }

  }

  const restartCrossChainSwap = async () => {
    // remove failed
    for (let index = 0; index < route.length; index++) {
      if (route[index].execution?.status === 'FAILED') {
        route[index].execution = undefined
        updateRoute(route)
      }
    }
    // start again
    setIsSwapping(true)
  }

  const getRecevingInfo = (step: TransferStep) => {
    let toChain: Chain, toToken: Token;
    switch(step.action.type) {
      case 'cross':
        toChain =  getChainById((step as CrossStep).action.toChainId)
        toToken = (step as CrossStep).action.toToken
        break;
      case 'swap':
        toChain = getChainById((step as SwapStep).action.chainId)
        toToken = (step as SwapStep).action.toToken
        break;
      default:
        toChain = getChainById(step.action.chainId)
        toToken = step.action.token
    }
    return {toChain, toToken}
  }

  const getFinalBalace = async (route: TransferStep[]) => {
    const lastStep = route[route.length-1]
    const {toChain, toToken} = getRecevingInfo(lastStep)
    const portfolio = await getBalancesForWallet(web3.account!, [toChain.id])
    const chainPortfolio = portfolio[toChain.key].find(coin => coin.id === toToken.id)
    setFinalBalance({token: toToken, portfolio: chainPortfolio!})
  }

  // check where we are an trigger next
  const checkSwapping = async() => {
    if(!isSwapping){
      return
    }

    // lifi supported?
    if (isLifiSupported(route)) {
      if (!route[0].execution) {
        triggerLifi()
      } else if (route[0].execution.status === 'DONE') {
        await getFinalBalace(route)
        setIsSwapping(false)
        setSwapDoneAt(Date.now())
        onSwapDone()
      }
      return
    }

    for (let index = 0; index < route.length; index++) {
      if (!route[index].execution) {
        return triggerStep(index, route)
          .catch(() => {
            // stop if a step fails
            setIsSwapping(false)
          })
      } else if (route[index].execution?.status === 'DONE') {
        continue // step is already done, continue
      } else {
        return // step is already runing, wait
      }
    }
    await getFinalBalace(route)
    setIsSwapping(false)
    setSwapDoneAt(Date.now())
    onSwapDone()
  }
  checkSwapping()

  const getMainButton = () => {
    // PENDING
    if (isSwapping) {
      return <></>
    }
    const isCrossChainSwap = route.filter(step => step.action.type === 'cross').length > 0


    // DONE
    const isDone = route.filter(step => step.execution?.status !== 'DONE').length === 0
    if (isDone) {
      const lastStep = route[route.length-1]
      const {toChain} = getRecevingInfo(lastStep)
      return (<Space direction="vertical">
      <Typography.Text strong>Swap Successful!</Typography.Text>
      {finalBalance && finalBalance.portfolio &&
        <Tooltip title="Click to add this token to your wallet.">
          <span style={{cursor: 'copy'}} onClick={() => switchChainAndAddToken(toChain.id, finalBalance.token)}>
            <Typography.Text>
              {'You now have '}
              {finalBalance.portfolio.amount.toString().substring(0, 8)}
              {` ${finalBalance.portfolio.symbol}`}
              {` on ${toChain.name}`}
            </Typography.Text>
          </span>
        </Tooltip>
      }
      <Link to="/dashboard"><Button type="link">Dashboard</Button></Link>
      </Space>)
    }

    // FAILED
    const isFailed = route.some( step => step.execution?.status === 'FAILED' )
    if (isFailed) {
      return <Button type="primary" onClick={() => restartCrossChainSwap()} style={{marginTop: 10}}>
        Restart from Failed Step
      </Button>
    }

    // RESUME
    const pendingSteps = route.some( step => step.execution?.status === 'PENDING' )
    const failedSteps = route.some( step => step.execution?.status === 'FAILED' )
    if(pendingSteps && !failedSteps){
      return <Button type="primary" onClick={() => resumeCrossChainSwap()} style={{marginTop: 10}}>
        {isCrossChainSwap ? 'Resume Cross Chain Swap' : 'Resume Swap'}
      </Button>
    }

    // NOT_STARTED
    return (
      <Button type="primary" onClick={() => startCrossChainSwap()} style={{marginTop: 10}}>
        {isCrossChainSwap ? 'Start Cross Chain Swap' : 'Start Swap'}
      </Button>
    )
  }

  const getCurrentProcess = () => {
    for (const step of route) {
      if (step.execution?.process) {
        for (const process of step.execution?.process) {
          if (process.status === 'ACTION_REQUIRED' || process.status === 'PENDING') {
            return process
          }
        }
      }
    }
    return null
  }

  const currentProcess = getCurrentProcess()

  return (<>
    {alerts}
    <br />

    <Timeline mode={isMobile? 'left' : 'alternate'} className="swapping-modal-timeline" >

      {/* Steps */}
      {route.map(parseStepToTimeline)}
    </Timeline>

    <div style={{ display: 'flex', backgroundColor: "rgba(255,255,255, 0)" }}>
      <Typography.Text style={{ marginLeft: 'auto', marginRight: 5 }}>
        {swapStartedAt ? <span className="totalTime"><Clock startedAt={swapStartedAt} successAt={swapDoneAt} /></span> : <span>&nbsp;</span>}
      </Typography.Text>
    </div>

    <Divider />

    <div className="swapp-modal-footer">

      <div style={{ textAlign: 'center', transform: "scale(1.3)",}}>
        {getMainButton()}
      </div>

      {isSwapping && currentProcess && currentProcess.status === 'ACTION_REQUIRED' &&
        <>
          <Row justify="center" style={{marginBottom: 6}}>
            <Typography.Text >{currentProcess.message}</Typography.Text>
          </Row>
          <Row justify="center">
            <img src={walletIcon} alt="Please Check Your Wallet"  />
          </Row>
        </>
      }

      {isSwapping && currentProcess && currentProcess.status === 'PENDING' &&
        <>
          <Row justify="center">
            <Typography.Text className="flashing">{currentProcess.message}</Typography.Text>
          </Row>
          <Row style={{ marginTop: 20 }} justify="center">
            <Spin indicator={<LoadingIndicator />} />
          </Row>
        </>
      }

    </div>

  </>)
}

export default Swapping
