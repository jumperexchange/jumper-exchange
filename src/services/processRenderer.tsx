import { Badge, Tooltip } from 'antd'

import { Process } from '../types'

const DEFAULT_TRANSACTIONS_TO_LOG = 10

export function renderProcessMessage(process: Process) {
  const processMessage =
    process.status === 'FAILED' ? ' Step Failed' : process.message?.toString() || ''

  if (process.txLink) {
    if (processMessage === 'Sign Message to Claim Funds') {
      return <>{processMessage}</>
    }

    if (process.confirmations) {
      return (
        <>
          {processMessage}{' '}
          <a href={process.txLink} target="_blank" rel="nofollow noreferrer">
            Tx {renderConfirmations(process.confirmations, DEFAULT_TRANSACTIONS_TO_LOG)}
          </a>
        </>
      )
    }
    return (
      <>
        {processMessage}{' '}
        <a href={process.txLink} target="_blank" rel="nofollow noreferrer">
          Tx
        </a>
      </>
    )
  }
  return <>{processMessage}</>
}

export const renderProcessError = (process: Process) => {
  const errorMessage = process.error?.message && (
    <>
      Error: {process.error?.message.substring(0, 350)}
      {process.error?.message.length > 350 ? '...' : ''}
    </>
  )

  const htmlMessage = process.error?.htmlMessage && (
    <div dangerouslySetInnerHTML={{ __html: process.error?.htmlMessage }} />
  )

  return (
    <>
      {errorMessage ? <div style={{ marginBottom: '5px' }}>{errorMessage}</div> : ''}
      {htmlMessage}
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
