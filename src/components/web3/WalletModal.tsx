import { useWeb3React } from '@web3-react/core'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { Avatar, Modal, Popconfirm, Typography } from 'antd'
import { useEffect, useState } from 'react'

import blockWalletIcon from '../../assets/wallets/blockwallet.svg'
import imTokenIcon from '../../assets/wallets/imToken.svg'
import metamaskIcon from '../../assets/wallets/metamask.svg'
import walletConnectIcon from '../../assets/wallets/walletconnect.svg'
import { addToActiveWallets, removeFromDeactivatedWallets, Wallet } from './ConnectButton'
import { getInjectedConnector, getWalletConnectConnector } from './connectors'
import { addToDeactivatedWallets, removeFromActiveWallets } from './DisconnectButton'

const ENABLED_WALLETS = process.env.REACT_APP_SUPPORTED_WALLETS

interface WalletModalProps {
  show: boolean
  onOk: Function
  onCancel: Function
}

const supportedWallets: Wallet[] = [
  {
    key: 'metamask',
    name: 'MetaMask',
    icon: metamaskIcon,
    connector: async () => {
      return await getInjectedConnector()
    },
    // Removed for now to allow all kinds of injected wallets to connect using the metamask button
    // providerCheck: () => {
    //   return !!(window as any).ethereum && !!(window as any).ethereum['isMetaMask']
    // },
  },
  {
    key: 'walletconnect',
    name: 'WalletConnect',
    icon: walletConnectIcon,
    connector: async () => {
      return await getWalletConnectConnector()
    },
  },
  {
    key: 'blockwallet',
    name: 'BlockWallet',
    icon: blockWalletIcon,
    connector: async () => {
      return await getInjectedConnector()
    },
    providerCheck: () => {
      if ((window as any).ethereum && (window as any).ethereum.isBlockWallet) {
        return true
      } else {
        return false
      }
    },
  },
  {
    key: 'imtoken',
    name: 'imToken',
    icon: imTokenIcon,
    connector: async () => {
      return await getInjectedConnector()
    },
    providerCheck: () => {
      return !!(window as any).ethereum && !!(window as any).ethereum['isImToken']
    },
  },
]

const configuredWalletKeys = JSON.parse(process.env.REACT_APP_SUPPORTED_WALLETS || '[]') as string[]

const enabledWallets = supportedWallets.filter((wallet) =>
  configuredWalletKeys.includes(wallet.key),
)

export const WalletModal = ({ show, onOk, onCancel }: WalletModalProps) => {
  const [showWalletIdentityPopover, setShowWalletIdentityPopover] = useState<Wallet>()
  const { activate } = useWeb3React()

  const login = async (wallet: Wallet) => {
    if (wallet.providerCheck) {
      const checkResult = wallet.providerCheck?.()
      if (!checkResult) {
        setShowWalletIdentityPopover(wallet)
        return
      }
    }

    const connector = await wallet.connector()
    try {
      await activate(connector, undefined, true)
    } catch {
      if (connector instanceof WalletConnectConnector) {
        // resetting the walletConnectProvider is necessary in case of errors
        connector.walletConnectProvider = undefined
      }
      return
    }
    const accountAddress = await connector.getAccount()
    removeFromDeactivatedWallets(accountAddress)
    addToActiveWallets(accountAddress)

    connector.on('Web3ReactDeactivate', () => {
      removeFromActiveWallets(accountAddress)
      addToDeactivatedWallets(accountAddress)
    })
    onOk()
  }
  useEffect(() => {
    setShowWalletIdentityPopover(undefined)
  }, [show])

  return (
    <Modal
      zIndex={9000}
      destroyOnClose={true}
      className="wallet-selection-modal"
      visible={show}
      onOk={() => onOk()}
      onCancel={() => onCancel()}
      footer={null}>
      <Typography.Title level={4} style={{ marginBottom: 32 }}>
        Choose a wallet
      </Typography.Title>
      {enabledWallets.map((wallet) => {
        if (ENABLED_WALLETS?.includes(wallet.key)) {
          return (
            <Popconfirm
              zIndex={9001}
              key={wallet.name + '_identitiy_popover'}
              showCancel={false}
              onConfirm={() => {
                setShowWalletIdentityPopover(undefined)
              }}
              onCancel={() => {
                setShowWalletIdentityPopover(undefined)
              }}
              title={
                <Typography.Text>
                  {`Please make sure that only the ${wallet.name} browser extension is active before choosing this wallet.`}
                </Typography.Text>
              }
              visible={showWalletIdentityPopover?.key === wallet.key}>
              <div
                style={{
                  // width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
                key={wallet.name}
                onClick={async () => login(wallet)}
                className="wallet-provider-button">
                <div>{wallet.name}</div>
                <div>
                  <Avatar shape="square" size={'large'} src={wallet.icon}></Avatar>
                </div>
              </div>
            </Popconfirm>
          )
        }
      })}
    </Modal>
  )
}
