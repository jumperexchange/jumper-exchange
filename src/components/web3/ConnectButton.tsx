import './web3.css'

import { WalletOutlined } from '@ant-design/icons'
import { useWeb3React } from '@web3-react/core'
import { Button, Modal, Typography } from 'antd'
import { useState } from 'react'

import {
  readDeactivatedWallets,
  readWallets,
  storeDeactivatedWallets,
  storeWallets,
} from '../../services/localStorage'
import { getInjectedConnector, getWalletConnectConnector } from './connectors'

const supportedWallets = [
  {
    name: 'MetaMask',
    icon: '',
    connector: async () => {
      return await getInjectedConnector()
    },
  },
  {
    name: 'WalletConnect',
    icon: '',
    connector: async () => {
      return await getWalletConnectConnector()
    },
  },
]

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

  const login = async (connector: any) => {
    await activate(connector)
    const accountAddress = await connector.getAccount()
    removeFromDeactivatedWallets(accountAddress)
    addToActiveWallets(accountAddress)
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
        {supportedWallets.map((wallet) => {
          return (
            <div
              key={wallet.name}
              onClick={async () => login(await wallet.connector())}
              className="wallet-provider-button">
              {wallet.name}
            </div>
          )
        })}
      </Modal>
    </>
  )
}

export default ConnectButton
