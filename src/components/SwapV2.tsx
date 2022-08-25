import './SwapV2.css'

import { Token } from '@lifi/sdk'
import { LiFiWidget, WidgetConfig } from '@lifi/widget'
import { useMemo, useState } from 'react'

import { useMetatags } from '../hooks/useMetatags'
import { useWallet } from '../providers/WalletProvider'
import { addChain, switchChain, switchChainAndAddToken } from '../services/metamask'
import { useStomt } from '../services/stomt'
import { WalletModal } from './web3/WalletModal'

export const SwapV2 = () => {
  useMetatags({ title: 'LI.FI - Swap' })
  useStomt('swap')

  const { disconnect, account } = useWallet()
  const signer = useMemo(() => account.signer, [account.signer])

  const [showConnectModal, setShowConnectModal] = useState<{
    show: boolean
    promiseResolver?: Function
  }>({ show: false })

  const widgetConfig: WidgetConfig = useMemo(() => {
    return {
      walletManagement: {
        signer: signer,
        connect: async () => {
          let promiseResolver
          const loginAwaiter = new Promise<void>((resolve) => (promiseResolver = resolve))

          setShowConnectModal({ show: true, promiseResolver })

          await loginAwaiter
          if (account.signer) {
            return account.signer!
          } else {
            throw Error('No signer object after login')
          }
        },
        disconnect: async () => {
          disconnect()
        },
        switchChain: async (reqChainId: number) => {
          await switchChain(reqChainId)
          if (account.signer) {
            return account.signer!
          } else {
            throw Error('No signer object after chain switch')
          }
        },
        addToken: async (token: Token, chainId: number) => {
          await switchChainAndAddToken(chainId, token)
        },
        addChain: async (chainId: number) => {
          return addChain(chainId)
        },
      },
      containerStyle: {
        height: 'calc(100% - 160px)',
        border: `1px solid ${
          window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'rgb(66, 66, 66)'
            : 'rgb(234, 234, 234)'
        }`,
        borderRadius: '16px',
        display: 'flex',
        minWidth: 360,
        maxHeight: 736,
      },
    }
  }, [account.signer])

  return (
    <>
      <LiFiWidget config={widgetConfig} />
      <WalletModal
        show={showConnectModal.show}
        onOk={() => {
          setShowConnectModal({ show: false })
          showConnectModal.promiseResolver?.()
        }}
        onCancel={() => {
          setShowConnectModal({ show: false, promiseResolver: undefined })
        }}
      />
    </>
  )
}
