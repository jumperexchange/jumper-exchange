import { WalletOutlined } from '@ant-design/icons'
import { useWeb3React } from '@web3-react/core'
import { Button } from 'antd'

import { injected } from './connectors'

function ConnectButton() {
  const { activate } = useWeb3React()

  return (
    <Button
      shape="round"
      type="primary"
      icon={<WalletOutlined />}
      size={'large'}
      onClick={() => activate(injected)}>
      Connect with MetaMask
    </Button>
  )
}

export default ConnectButton
