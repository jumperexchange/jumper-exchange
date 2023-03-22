import { useMemo } from 'react'

import { timeStampExceedsIntervalMinutes } from '../services/utils'
import { Process } from '../types'

interface SwappingModalInfoMessagesProps {
  process: Process | null
  tool: any
}
export const SwappingModalInfoMessages = ({ process, tool }: SwappingModalInfoMessagesProps) => {
  const showMessage = useMemo(
    () =>
      process?.type === 'RECEIVING_CHAIN' &&
      timeStampExceedsIntervalMinutes(20, process?.startedAt),
    [process],
  )
  const defaultMessage = useMemo(
    () => (
      <div style={{ padding: 16, background: '#FFF1AD' }}>
        Cross-chain swaps can take longer due of low liquidity, network or bridge congestion. Please
        check your wallet on the destination chain, your assets may have arrived. If not, ask for
        help in the discord support channel.
      </div>
    ),
    [],
  )

  const hopMessage = useMemo(
    () => (
      <div style={{ padding: 16, background: '#FFF1AD' }}>
        Cross-chain swaps can take longer due of low liquidity, network or bridge congestion. If the
        transaction remains stuck on pending:
        <ul>
          <li>
            Go <a href="https://app.hop.exchange/#/withdraw">here</a> and enter the transaction hash
            from your source chain.
          </li>
          <li>Click withdraw and retrieve your assets</li>
        </ul>
        If you received hAssets, convert it back to regular assets using the convert feature using{' '}
        <a href="https://app.hop.exchange/#/convert">this tool</a>.
      </div>
    ),
    [],
  )

  if (showMessage) {
    switch (tool) {
      case 'hop':
        return hopMessage
      default:
        return defaultMessage
    }
  } else {
    return null
  }
}
