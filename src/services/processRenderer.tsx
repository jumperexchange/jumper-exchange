import { Badge, Tooltip } from 'antd'

import { Process, StatusMessage, Substatus } from '../types'

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

export const renderSubstatusmessage = (status: StatusMessage, substatus?: Substatus) => {
  if (!substatus) return
  return substatusMessages[status][substatus]
}

const substatusMessages: Record<StatusMessage, Partial<Record<Substatus, string>>> = {
  PENDING: {
    BRIDGE_NOT_AVAILABLE:
      'We have temporarily lost connection with the Bridge or RPC. Please try to check your transaction status again in a few minutes.',
    CHAIN_NOT_AVAILABLE:
      'We have temporarily lost connection with the Bridge or RPC. Please try to check your transaction status again in a few minutes.',
    NOT_PROCESSABLE_REFUND_NEEDED:
      ' We will provide you with a refund. There is nothing you need to do other than to wait for your refund to be processed.',
    UNKNOWN_ERROR:
      'An unexpected error occurred. Please seek assistance in the LI.FI discord server.',
    WAIT_SOURCE_CONFIRMATIONS:
      'Your transaction is still being processed. Sit back and relax. There is nothing you need to do on your end. It is also not possible to speed up this part of the process. If it takes an unusually long time for this to process, please do not worry. Your funds are not missing.',
    WAIT_DESTINATION_TRANSACTION:
      'Your transaction is still being processed. Sit back and relax. There is nothing you need to do on your end. It is also not possible to speed up this part of the process. If it takes an unusually long time for this to process, please do not worry. Your funds are not missing.',
  },
  DONE: {
    PARTIAL: 'Some of the received tokens are not the requested destination tokens.',
    REFUNDED: 'Your tokens have been returned to your address on your sending chain.',
    COMPLETED: 'Congrats! Your assets have been transferred.',
  },
  FAILED: {},
  INVALID: {},
  NOT_FOUND: {},
}
