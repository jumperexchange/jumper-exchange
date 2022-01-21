import { DisconnectOutlined } from '@ant-design/icons'
import { useWeb3React } from '@web3-react/core'
import { Button, Checkbox, Image, Popover, Typography } from 'antd'
import { useState } from 'react'

import metamaskGif from '../../assets/gifs/metamask_disconnect.gif'
import {
  readDeactivatedWallets,
  readHideDisconnectPopup,
  readWallets,
  storeDeactivatedWallets,
  storeHideDisconnectPopup,
  storeWallets,
} from '../../services/localStorage'

const { Text } = Typography

const removeFromActiveWallets = (address: string | null | undefined) => {
  if (!address) return
  const lowerCaseAddress = address.toLowerCase()
  const wallets = readWallets()
  const filteredWallets = wallets.filter((address) => address !== lowerCaseAddress)
  storeWallets(filteredWallets)
}

const addToDeactivatedWallets = (address: string | null | undefined) => {
  if (!address) return
  const lowerCaseAddress = address.toLowerCase()
  const deactivatedWallets = readDeactivatedWallets()
  deactivatedWallets.push(lowerCaseAddress)
  storeDeactivatedWallets(deactivatedWallets)
}

type DisconnectButtonPropType = {
  style?: React.CSSProperties
}

function DisconnectButton({ style }: DisconnectButtonPropType) {
  const { deactivate, account } = useWeb3React()

  const [hideDisconnectPopup] = useState<boolean>(readHideDisconnectPopup())

  const handleDisconnect = () => {
    removeFromActiveWallets(account)
    addToDeactivatedWallets(account)
    deactivate()
  }

  const handleHideDisconnectPopup = (event: any) => {
    storeHideDisconnectPopup(event.target.checked)
  }

  const infoContent = (
    <>
      <Text style={{ display: 'block', maxWidth: 300, margin: '16px 0 16px 0' }}>
        In order to fully disconnect your wallet and to withdraw all given permissions, please open
        your wallet.
      </Text>
      <Image width={300} src={metamaskGif} style={{ display: 'block' }} />
      <br />
      <Checkbox onChange={handleHideDisconnectPopup} style={{ margin: '16px 0 16px 0' }}>
        Understood, don't show again!
      </Checkbox>
      <Button
        type="link"
        onClick={() => handleDisconnect()}
        style={{ display: 'block', paddingLeft: 0 }}>
        <u>Deactivate Wallet </u>
      </Button>
    </>
  )

  if (hideDisconnectPopup) {
    return (
      <>
        <Button
          style={style}
          onClick={() => handleDisconnect()}
          shape="round"
          danger
          icon={<DisconnectOutlined />}>
          Deactivate Wallet
        </Button>
      </>
    )
  } else {
    return (
      <>
        <Popover placement="bottom" content={infoContent} trigger="click">
          <Button style={style} shape="round" danger icon={<DisconnectOutlined />}>
            Deactivate Wallet
          </Button>
        </Popover>
      </>
    )
  }
}

export default DisconnectButton
