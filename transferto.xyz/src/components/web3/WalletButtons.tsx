import { LoadingOutlined } from '@ant-design/icons'
import { Button } from 'antd'

import { useWallet } from '../../providers/WalletProvider'
import { isWalletDeactivated } from '../../services/utils'
import ConnectButton from './ConnectButton'
import DisconnectButton from './DisconnectButton'

type WalletButtonsPropType = {
  className?: string
}

function WalletButtons({ className }: WalletButtonsPropType) {
  const { account } = useWallet()

  if (!account.isActive && isWalletDeactivated(account.address)) {
    return (
      <Button className={className} disabled type="primary" icon={<LoadingOutlined />}></Button>
    )
  } else if (!account.address) {
    return <ConnectButton className={className}></ConnectButton>
  } else {
    return <DisconnectButton className={className}></DisconnectButton>
  }
}

export default WalletButtons
