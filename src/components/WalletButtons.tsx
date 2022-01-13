import { LoadingOutlined } from '@ant-design/icons'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { Button } from 'antd'

import ConnectButton from './web3/ConnectButton'
import DisconnectButton from './web3/DisconnectButton'

function WalletButtons() {
  const web3 = useWeb3React<Web3Provider>()

  if (!web3.active) {
    return <Button shape="round" type="primary" icon={<LoadingOutlined />} size={'large'}></Button>
  } else if (web3.account) {
    return <DisconnectButton></DisconnectButton>
  } else {
    return <ConnectButton></ConnectButton>
  }
}

export default WalletButtons
