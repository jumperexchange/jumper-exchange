import { DisconnectOutlined } from '@ant-design/icons'
import { useWeb3React } from '@web3-react/core'
import { Button } from 'antd'

function DisconnectButton() {
  const { deactivate } = useWeb3React()

  return (
    <Button shape="round" danger icon={<DisconnectOutlined />} onClick={() => deactivate()}>
      Disconnect
    </Button>
  )
}

export default DisconnectButton
