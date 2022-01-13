import { Badge, Tooltip } from 'antd'

import { getChainById, Process, Step } from '../types'
import { formatTokenAmountOnly } from './utils'

const DEFAULT_TRANSACTIONS_TO_LOG = 10

export function renderProcessMessage(process: Process) {
  if (process.txLink) {
    if (process.message === 'Sign Message to Claim Funds') {
      return <>{process.message.toString()}</>
    }
    if (process.confirmations) {
      return (
        <>
          {process.message}{' '}
          <a href={process.txLink} target="_blank" rel="nofollow noreferrer">
            Tx {renderConfirmations(process.confirmations, DEFAULT_TRANSACTIONS_TO_LOG)}
          </a>
        </>
      )
    }
    return (
      <>
        {process.message}{' '}
        <a href={process.txLink} target="_blank" rel="nofollow noreferrer">
          Tx
        </a>
      </>
    )
  }
  return <>{process.message.toString()}</>
}

export const renderProcessError = (step: Step, process: Process) => {
  const errorMessage = 'errorMessage' in process && (
    <>
      Error: {process.errorMessage.substring(0, 350)}
      {process.errorMessage.length > 350 ? '...' : ''}
    </>
  )

  const helpMessage = (
    <>
      Transaction was not sent, your funds are still in your wallet (
      {formatTokenAmountOnly(step.action.fromToken, step.action.fromAmount)}{' '}
      {step.action.fromToken.symbol} on {getChainById(step.action.fromChainId).name}), please retry.{' '}
      <br />
      If it still doesn't work, it is is save to delete this transfer and start a new one.
    </>
  )

  const transactionCheck = process.txLink && (
    <>
      You can check the failed transaction&nbsp;
      <a href={process.txLink} target="_blank" rel="nofollow noreferrer">
        here
      </a>
      .
    </>
  )

  return (
    <>
      {errorMessage ? <div style={{ marginBottom: '5px' }}>{errorMessage}</div> : ''}
      <div>{helpMessage}</div>
      {transactionCheck ? <div>{transactionCheck}</div> : ''}
    </>
  )
}

const renderConfirmations = (count: number, max: number) => {
  const text = count < max ? `${count}/${max}` : `${max}+`
  return (
    <Tooltip title={text + ' Confirmations'}>
      <Badge count={text} style={{ backgroundColor: '#52c41a', marginBottom: '2px' }} />
    </Tooltip>
  )
}
