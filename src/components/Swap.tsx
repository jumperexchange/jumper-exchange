import './Swap.css'

import { Token } from '@lifi/sdk'
import { switchChain } from '@lifi/wallet-management'
import { LiFiWidget, WidgetConfig } from '@lifi/widget'
import { useMemo, useState } from 'react'

import { useMetatags } from '../hooks/useMetatags'
import { useWallet } from '../providers/WalletProvider'
import { addChain, switchChainAndAddToken } from '../services/metamask'
import { useStomt } from '../services/stomt'
import { addToDeactivatedWallets, removeFromActiveWallets } from './web3/DisconnectButton'
import { WalletModal } from './web3/WalletModal'

export const Swap = () => {
  useMetatags({ title: 'LI.FI - Swap' })
  useStomt('swap')

  const { disconnect, account } = useWallet()

  const [showConnectModal, setShowConnectModal] = useState<{
    show: boolean
    promiseResolver?: Function
  }>({ show: false })

  const widgetConfig: WidgetConfig = useMemo(() => {
    return {
      walletManagement: {
        signer: account.signer,
        connect: async () => {
          let promiseResolver
          const loginAwaiter = new Promise<void>((resolve) => (promiseResolver = resolve))

          setShowConnectModal({ show: true, promiseResolver })

          await loginAwaiter
          return account.signer!
        },
        disconnect: async () => {
          removeFromActiveWallets(account.address)
          addToDeactivatedWallets(account.address)
          disconnect()
        },
        switchChain: async (reqChainId: number) => {
          await switchChain(reqChainId)
          return account.signer!
        },
        addToken: async (token: Token, chainId: number) => {
          await switchChainAndAddToken(chainId, token)
        },
        addChain: async (chainId: number) => {
          return addChain(chainId)
        },
      },
      containerStyle: {
        height: '100%',
        border: `1px solid ${
          window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'rgb(66, 66, 66)'
            : 'rgb(234, 234, 234)'
        }`,
        borderRadius: '16px',
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        minWidth: 360,
        // maxHeight: 736,
      },
      variant: 'expandable',
    }
  }, [account.address, account.signer, disconnect])

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
