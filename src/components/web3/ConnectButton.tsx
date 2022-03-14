import './web3.css'

import { WalletOutlined } from '@ant-design/icons'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { useWeb3React } from '@web3-react/core'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { Avatar, Button, Modal, Typography } from 'antd'
import { useState } from 'react'

import metamaskIcon from '../../assets/wallets/metamask.svg'
import walletConnectIcon from '../../assets/wallets/walletconnect.svg'
import {
  readDeactivatedWallets,
  readWallets,
  storeDeactivatedWallets,
  storeWallets,
} from '../../services/localStorage'
import { getInjectedConnector, getWalletConnectConnector } from './connectors'
import { addToDeactivatedWallets, removeFromActiveWallets } from './DisconnectButton'

const supportedWallets = [
  {
    key: 'metamask',
    name: 'MetaMask',
    icon: metamaskIcon,
    connector: async () => {
      return await getInjectedConnector()
    },
  },
  {
    key: 'walletconnect',
    name: 'WalletConnect',
    icon: walletConnectIcon,
    connector: async () => {
      return await getWalletConnectConnector()
    },
  },
]

const configuredWalletKeys = JSON.parse(process.env.REACT_APP_SUPPORTED_WALLETS || '[]') as string[]
const enabledWallets = supportedWallets.filter((wallet) =>
  configuredWalletKeys.includes(wallet.key),
)

export const addToActiveWallets = (address: string | null | undefined) => {
  if (!address) return
  const lowerCaseAddress = address.toLowerCase()
  const activeWallets = readWallets()
  activeWallets.push(lowerCaseAddress)
  storeWallets(activeWallets)
}

export const removeFromDeactivatedWallets = (address: string | null | undefined) => {
  if (!address) return
  const lowerCaseAddress = address.toLowerCase()
  const deactivatedWallets = readDeactivatedWallets()
  const deactivatedWalletsWithoutAccount = deactivatedWallets.filter(
    (wallet) => wallet !== lowerCaseAddress,
  )
  storeDeactivatedWallets(deactivatedWalletsWithoutAccount)
}

type ConnectButtonPropType = {
  style?: React.CSSProperties
  className?: string
  size?: 'large' | 'middle' | 'small'
}

function ConnectButton({ style, className, size = 'middle' }: ConnectButtonPropType) {
  const { activate } = useWeb3React()
  const [showConnectModal, setShowConnectModal] = useState<boolean>(false)

  const login = async (connector: AbstractConnector) => {
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
  }

  return (
    <>
      <Button
        className={className}
        style={{ ...{ borderRadius: '6px' }, ...style }}
        size={size}
        type="primary"
        icon={<WalletOutlined />}
        onClick={() => setShowConnectModal(true)}>
        Connect Your Wallet
      </Button>
      <Modal
        className="wallet-selection-modal"
        visible={showConnectModal}
        onOk={() => setShowConnectModal(false)}
        onCancel={() => setShowConnectModal(false)}
        footer={null}>
        <Typography.Title level={4} style={{ marginBottom: 32 }}>
          Choose a wallet
        </Typography.Title>
        {enabledWallets.map((wallet) => {
          return (
            <div
              style={{
                // width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
              key={wallet.name}
              onClick={async () => login(await wallet.connector())}
              className="wallet-provider-button">
              <div>{wallet.name}</div>
              <div>
                <Avatar shape="square" size={'large'} src={wallet.icon}></Avatar>
              </div>
            </div>
          )
        })}
      </Modal>
    </>
  )
}

export default ConnectButton
