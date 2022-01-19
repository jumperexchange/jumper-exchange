import { LoadingOutlined } from '@ant-design/icons'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { Button } from 'antd'
import { useEffect } from 'react'

import { readWallets, storeWallets } from '../../services/localStorage'
import { walletIsDeactivated } from '../../services/utils'
import { chainKeysToObject } from '../../types'
import ConnectButton from './ConnectButton'
import DisconnectButton from './DisconnectButton'

function WalletButtons() {
  const web3 = useWeb3React<Web3Provider>()

  // TODO: move this to Web3ConnectionManager
  useEffect(() => {
    if (walletIsDeactivated(web3.account as string)) {
      return web3.deactivate()
    }
    const wallets = readWallets()
    const walletAddresses = wallets.map((wallet) => wallet.address)
    if (web3.account && !walletAddresses.includes(web3.account)) {
      wallets.push({
        address: web3.account,
        loading: false,
        portfolio: chainKeysToObject([]),
      })
      storeWallets(wallets)
    }
  }, [web3.active, web3.account])

  if (!web3.active) {
    return (
      <Button
        disabled
        shape="round"
        type="primary"
        icon={<LoadingOutlined />}
        size={'large'}></Button>
    )
  } else if (!web3.account || walletIsDeactivated(web3.account as string)) {
    return <ConnectButton></ConnectButton>
  } else {
    return <DisconnectButton></DisconnectButton>
  }
}

export default WalletButtons
