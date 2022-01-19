import { LoadingOutlined } from '@ant-design/icons'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { Button } from 'antd'

import { isWalletDeactivated } from '../../services/utils'
import ConnectButton from './ConnectButton'
import DisconnectButton from './DisconnectButton'

function WalletButtons() {
  const web3 = useWeb3React<Web3Provider>()

  if (!web3.active && isWalletDeactivated(web3.account)) {
    return (
      <Button
        disabled
        shape="round"
        type="primary"
        icon={<LoadingOutlined />}
        size={'large'}></Button>
    )
  } else if (!web3.account) {
    return <ConnectButton></ConnectButton>
  } else {
    return <DisconnectButton></DisconnectButton>
  }
}

export default WalletButtons
