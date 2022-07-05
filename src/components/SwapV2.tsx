import './SwapV2.css'

import { LiFiWidget, WidgetConfig } from '@lifi/widget'
import { Token } from '@lifinance/sdk'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { useMemo, useState } from 'react'

import { useMetatags } from '../hooks/useMetatags'
import { addChain, switchChain, switchChainAndAddToken } from '../services/metamask'
import { useStomt } from '../services/stomt'
import { isWalletActivated } from '../services/utils'
import { addToDeactivatedWallets, removeFromActiveWallets } from './web3/DisconnectButton'
import { WalletModal } from './web3/WalletModal'

export const SwapV2 = () => {
  useMetatags({ title: 'LI.FI - Swap' })
  useStomt('swap')

  const { library, deactivate, account } = useWeb3React()
  const signer = useMemo(() => {
    try {
      return library.getSigner()
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(e)
    }
  }, [library])

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
          return library.getSigner()
        },
        disconnect: async () => {
          removeFromActiveWallets(account)
          addToDeactivatedWallets(account)
          deactivate()
        },
        getSigner: async () => {
          const selectedAddress = (window as any).ethereum?.selectedAddress

          if (selectedAddress && isWalletActivated(selectedAddress)) {
            const provider = new ethers.providers.Web3Provider((window as any).ethereum, 'any')
            return provider.getSigner()
          }
          return undefined
        },
        switchChain: async (reqChainId: number) => {
          await switchChain(reqChainId)
          return library.getSigner()
        },
        addToken: async (token: Token, chainId: number) => {
          await switchChainAndAddToken(chainId, token)
        },
        addChain: async (chainId: number) => {
          return addChain(chainId)
        },
      },
      containerStyle: {
        width: 392,
        height: 'calc(100% - 256px)',
        border: `1px solid ${
          window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'rgb(66, 66, 66)'
            : 'rgb(234, 234, 234)'
        }`,
        borderRadius: '16px',
        display: 'flex',
        maxWidth: 392,
      },
    }
  }, [library, account, signer])

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
