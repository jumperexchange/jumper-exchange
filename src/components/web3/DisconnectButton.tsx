import { DisconnectOutlined } from '@ant-design/icons'
import { useWeb3React } from '@web3-react/core'
import { Button, Modal } from 'antd'

import {
  readDeactivatedWallets,
  readWallets,
  storeDeactivatedWallets,
  storeWallets,
} from '../../services/localStorage'
import { chainKeysToObject } from '../../types'

const removeFromActiveWallets = (address: string | null | undefined) => {
  if (!address) return
  const lowerCaseAddress = address.toLowerCase()
  const wallets = readWallets()
  const filteredWallets = wallets.filter((wallet) => wallet.address !== lowerCaseAddress)
  storeWallets(filteredWallets)
}

const addToDeactivatedWallets = (address: string | null | undefined) => {
  if (!address) return
  const lowerCaseAddress = address.toLowerCase()
  const deactivatedWallets = readDeactivatedWallets()
  deactivatedWallets.push({
    address: lowerCaseAddress,
    loading: false,
    portfolio: chainKeysToObject([]),
  })
  storeDeactivatedWallets(deactivatedWallets)
}

type DisconnectButtonPropType = {
  style?: React.CSSProperties
}

function DisconnectButton({ style }: DisconnectButtonPropType) {
  const { deactivate, account } = useWeb3React()

  const handleDisconnect = () => {
    removeFromActiveWallets(account)
    addToDeactivatedWallets(account)
    deactivate()
  }

  return (
    <>
      <Button
        style={style}
        shape="round"
        danger
        icon={<DisconnectOutlined />}
        onClick={() => handleDisconnect()}>
        Deactivate Wallet
      </Button>
      <Modal></Modal>
    </>
  )
}

export default DisconnectButton
