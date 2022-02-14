import { LoadingOutlined } from '@ant-design/icons'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { Button } from 'antd'

import { isWalletDeactivated } from '../../services/utils'
import ConnectButton from './ConnectButton'
import DisconnectButton from './DisconnectButton'

type WalletButtonsPropType = {
  className?: string
}

function WalletButtons({ className }: WalletButtonsPropType) {
  const web3 = useWeb3React<Web3Provider>()

  if (!web3.active && isWalletDeactivated(web3.account)) {
    return (
      <Button className={className} disabled type="primary" icon={<LoadingOutlined />}></Button>
    )
  } else if (!web3.account) {
    return <ConnectButton className={className}></ConnectButton>
  } else {
    return <DisconnectButton className={className}></DisconnectButton>
  }
}

export default WalletButtons
