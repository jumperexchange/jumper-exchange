import { Badge, Tooltip } from 'antd'

import { Process, Step } from '../types'

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
  const errorMessage = process.errorMessage && (
    <>
      Error: {process.errorMessage.substring(0, 350)}
      {process.errorMessage.length > 350 ? '...' : ''}
    </>
  )

  const htmlMessage = process.htmlErrorMessage && (
    <div dangerouslySetInnerHTML={{ __html: process.htmlErrorMessage }} />
  )

  return (
    <>
      {errorMessage ? <div style={{ marginBottom: '5px' }}>{errorMessage}</div> : ''}
      <div>{htmlMessage}</div>
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
