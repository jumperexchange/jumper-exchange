import { DisconnectOutlined } from '@ant-design/icons'
import { Button, Checkbox, Image, Popover, Typography } from 'antd'
import { useEffect, useState } from 'react'

import metamaskGif from '../../assets/gifs/metamask_disconnect.gif'
import { useWallet } from '../../providers/WalletProvider'
import {
  isWalletConnectWallet,
  readDeactivatedWallets,
  readHideDisconnectPopup,
  readWallets,
  storeDeactivatedWallets,
  storeHideDisconnectPopup,
  storeWallets,
} from '../../services/localStorage'

const { Text } = Typography

export const removeFromActiveWallets = (address: string | null | undefined) => {
  if (!address) return
  const lowerCaseAddress = address.toLowerCase()
  const wallets = readWallets()
  const filteredWallets = wallets.filter((address) => address !== lowerCaseAddress)
  storeWallets(filteredWallets)
}

export const addToDeactivatedWallets = (address: string | null | undefined) => {
  if (!address) return
  const lowerCaseAddress = address.toLowerCase()
  const deactivatedWallets = readDeactivatedWallets()
  deactivatedWallets.push(lowerCaseAddress)
  storeDeactivatedWallets(deactivatedWallets)
}

type DisconnectButtonPropType = {
  style?: React.CSSProperties
  className?: string
  size?: 'large' | 'middle' | 'small'
}

function DisconnectButton({ style, className, size = 'middle' }: DisconnectButtonPropType) {
  const { account, disconnect } = useWallet()

  const [hideDisconnectPopup] = useState<boolean>(readHideDisconnectPopup())
  const [walletIdentifier, setWalletIdentifier] = useState<string>('Wallet')
  const [isWalletConnectAccount, setIsWalletConnectAccount] = useState<boolean>(
    isWalletConnectWallet(account.address!),
  )

  const handleDisconnect = () => {
    // removeFromActiveWallets(account)
    // addToDeactivatedWallets(account)
    disconnect()
  }

  const handleHideDisconnectPopup = (event: any) => {
    storeHideDisconnectPopup(event.target.checked)
  }
  useEffect(() => {
    setIsWalletConnectAccount(isWalletConnectWallet(account.address!))
  }, [account])

  useEffect(() => {
    if (!account.address) return
    // library
    //   .lookupAddress(account)
    //   .then((name: string) => {
    //     if (!name) return setWalletIdentifier(`${account.substr(0, 4)}...`)
    //     setWalletIdentifier(name)
    //   })
    //   .catch((e: unknown) => setWalletIdentifier(`${account.substr(0, 4)}...`))
    setWalletIdentifier(`${account.address?.substr(0, 4)}...`)
  }, [account.address])

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
        onClick={handleDisconnect}
        style={{ display: 'block', paddingLeft: 0 }}
        size={size}>
        <u>Deactivate {walletIdentifier} </u>
      </Button>
    </>
  )

  if (hideDisconnectPopup || isWalletConnectAccount) {
    return (
      <>
        <Button
          className={className}
          style={{ ...{ borderRadius: 6 }, ...style }}
          size={size}
          onClick={handleDisconnect}
          danger
          icon={<DisconnectOutlined />}>
          Deactivate {walletIdentifier}
        </Button>
      </>
    )
  } else {
    return (
      <>
        <Popover content={infoContent} trigger="click">
          <Button
            size={size}
            className={className}
            style={{ borderRadius: 6 }}
            danger
            icon={<DisconnectOutlined />}>
            Deactivate {walletIdentifier}
          </Button>
        </Popover>
      </>
    )
  }
}

export default DisconnectButton
