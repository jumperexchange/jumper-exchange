import { WalletOutlined } from '@ant-design/icons'
import { useWeb3React } from '@web3-react/core'
import { Button } from 'antd'

import {
  readDeactivatedWallets,
  readWallets,
  storeDeactivatedWallets,
  storeWallets,
} from '../../services/localStorage'
import { getInjectedConnector, injected } from './connectors'

const addToActiveWallets = (address: string | null | undefined) => {
  if (!address) return
  const lowerCaseAddress = address.toLowerCase()
  const activeWallets = readWallets()
  activeWallets.push(lowerCaseAddress)
  storeWallets(activeWallets)
}

const removeFromDeativatedWallets = (address: string | null | undefined) => {
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
}

function ConnectButton({ style }: ConnectButtonPropType) {
  const { activate } = useWeb3React()

  const handleConnect = async () => {
    const accountAddress = await injected.getAccount()
    removeFromDeativatedWallets(accountAddress)
    addToActiveWallets(accountAddress)
    activate(await getInjectedConnector())
  }

  return (
    <Button
      style={style}
      shape="round"
      type="primary"
      icon={<WalletOutlined />}
      onClick={async () => await handleConnect()}>
      Connect with MetaMask
    </Button>
  )
}

export default ConnectButton
