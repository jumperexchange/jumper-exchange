import './Claiming.css'

import { Button } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import { useState } from 'react'

import { useMetatags } from '../hooks/useMetatags'
import { useWallet } from '../providers/WalletProvider'
import { readWallets } from '../services/localStorage'
import { chainKeysToObject, Wallet } from '../types'

// actual component
const Claiming = () => {
  useMetatags({
    title: 'LI.FI - Claiming',
  })
  const [registeredWallets, setRegisteredWallets] = useState<Array<Wallet>>(() =>
    readWallets().map((address) => ({
      address: address,
      loading: false,
      portfolio: chainKeysToObject([]),
    })),
  )
  const { account } = useWallet()
  const [claimingState, setClainingState] = useState('claim')
  const [claimingAmount, setClainingAmount] = useState(0.11)

  return (
    <div className="site-layout site-layout--claiming">
      <Content className="claiming">
        <p className="claiming__label">Total Rewards</p>
        <h2 className="claiming__amount">{claimingAmount} LZRD</h2>
        <div className="card">
          <p className="card__title">Claim your rewards</p>
          <Button className="card__button" type="primary" size="large">
            Claim
          </Button>
        </div>
      </Content>
    </div>
  )
}

export default Claiming
