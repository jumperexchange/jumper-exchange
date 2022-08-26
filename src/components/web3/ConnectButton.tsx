import './web3.css'

import { WalletOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useState } from 'react'

import {
  readDeactivatedWallets,
  readWallets,
  storeDeactivatedWallets,
  storeWallets,
} from '../../services/localStorage'
import { WalletModal } from './WalletModal'

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
  const [showConnectModal, setShowConnectModal] = useState<boolean>(false)

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
      <WalletModal
        show={showConnectModal}
        onOk={() => {
          setShowConnectModal(false)
        }}
        onCancel={() => {
          setShowConnectModal(false)
        }}
      />
    </>
  )
}

export default ConnectButton
