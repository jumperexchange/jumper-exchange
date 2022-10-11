import { supportedWallets, Wallet } from '@lifi/wallet-management'
import { Avatar, Modal, Popconfirm, Typography } from 'antd'
import { useEffect, useState } from 'react'

import { useWallet } from '../../providers/WalletProvider'

interface WalletModalProps {
  show: boolean
  onOk: Function
  onCancel: Function
}

export const WalletModal = ({ show, onOk, onCancel }: WalletModalProps) => {
  const [showWalletIdentityPopover, setShowWalletIdentityPopover] = useState<Wallet>()
  // const { connect, signer } = useLiFiWalletManagement()
  const { ethereum } = window as any

  const { connect } = useWallet()

  const login = async (wallet: Wallet) => {
    if (wallet.checkProviderIdentity) {
      const checkResult = wallet.checkProviderIdentity(ethereum)
      if (!checkResult) {
        setShowWalletIdentityPopover(wallet)
        return
      }
    }
    await connect(wallet)
    try {
    } catch (e) {}

    onOk()
  }
  useEffect(() => {
    setShowWalletIdentityPopover(undefined)
  }, [show])

  return (
    <Modal
      zIndex={9000}
      destroyOnClose={true}
      className="wallet-selection-modal"
      open={show}
      onOk={() => onOk()}
      onCancel={() => onCancel()}
      footer={null}>
      <Typography.Title level={4} style={{ marginBottom: 32 }}>
        Choose a wallet
      </Typography.Title>
      {supportedWallets.map((wallet) => {
        // if (ENABLED_WALLETS?.includes(wallet.name)) {
        if (true) {
          return (
            <Popconfirm
              zIndex={9001}
              key={wallet.name + '_identitiy_popover'}
              showCancel={false}
              onConfirm={() => {
                setShowWalletIdentityPopover(undefined)
              }}
              onCancel={() => {
                setShowWalletIdentityPopover(undefined)
              }}
              title={
                <Typography.Text>
                  {`Please make sure that only the ${wallet.name} browser extension is active before choosing this wallet.`}
                </Typography.Text>
              }
              open={showWalletIdentityPopover?.name === wallet.name}>
              <div
                style={{
                  // width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
                key={wallet.name}
                onClick={async () => login(wallet)}
                className="wallet-provider-button">
                <div>{wallet.name}</div>
                <div>
                  <Avatar shape="square" size={'large'} src={wallet.icon}></Avatar>
                </div>
              </div>
            </Popconfirm>
          )
        }
      })}
    </Modal>
  )
}
