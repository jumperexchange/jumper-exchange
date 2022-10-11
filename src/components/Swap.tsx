import './Swap.css'

import { Token } from '@lifi/sdk'
import { switchChain } from '@lifi/wallet-management'
import { LiFiWidget, WidgetConfig } from '@lifi/widget'
import { useMemo, useState } from 'react'

import { useMetatags } from '../hooks/useMetatags'
import { useWallet } from '../providers/WalletProvider'
import { addChain, switchChainAndAddToken } from '../services/metamask'
import { useStomt } from '../services/stomt'
import { mapWalletReferrer } from '../services/utils'
import { addToDeactivatedWallets, removeFromActiveWallets } from './web3/DisconnectButton'
import { WalletModal } from './web3/WalletModal'

export const Swap = () => {
  useMetatags({ title: 'LI.FI - Swap' })
  useStomt('swap')

  const { disconnect, account, usedWallet } = useWallet()

  const [showConnectModal, setShowConnectModal] = useState<{
    show: boolean
    promiseResolver?: Function
  }>({ show: false })

  const widgetConfig: WidgetConfig = useMemo(() => {
    return {
      sdkConfig: {
        defaultRouteOptions: {
          referrer: mapWalletReferrer(usedWallet?.name),
        },
      },
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
        borderRadius: '16px',
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
      },
      variant: 'expandable',
    }
  }, [account.address, account.signer, disconnect, usedWallet?.name])

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
