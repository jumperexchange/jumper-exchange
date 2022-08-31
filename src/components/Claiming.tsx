import './Claiming.css'

import { Button } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import { useState } from 'react'

import DiscordIcon from '../../src/assets/icons/discordIcon'
import { SuccessIcon } from '../../src/assets/icons/sucessIcon'
import { useMetatags } from '../hooks/useMetatags'
import { useWallet } from '../providers/WalletProvider'
import { readWallets } from '../services/localStorage'
import { chainKeysToObject, Wallet } from '../types'

// actual component
const Claiming = () => {
  useMetatags({
    title: 'LI.FI - Claiming',
    description: 'Some Claiming Description',
    'og:title': 'LI.FI - Claim your LZRD',
    'og:image': 'path/to/image.jpg',
    'twitter:card': 'summary',
  })
  const [registeredWallets, setRegisteredWallets] = useState<Array<Wallet>>(() =>
    readWallets().map((address) => ({
      address: address,
      loading: false,
      portfolio: chainKeysToObject([]),
    })),
  )
  const { account } = useWallet()
  const [claimingState, setClaimingState] = useState('network')
  const [claimingAmount, setClaimingAmount] = useState(0.1)
  const handleClick = () => {
    if (claimingState === 'network') {
      setClaimingState('claim')
    }
    if (claimingState === 'claim') {
      if (claimingAmount > 0) {
        setClaimingState('success')
      } else {
        setClaimingState('notqualified')
      }
    }
  }

  // if (claimingState === 'claim') {
  //   button = (

  //   )
  // } else if (claimingState === 'network') {
  //   button = (
  //     <Button
  //       className="card__button card__button--network"
  //       onClick={handleClick}
  //       type="primary"
  //       size="large">
  //       Switch Network to Arbitrum
  //     </Button>
  //   )
  // }

  return (
    <div className="site-layout site-layout--claiming">
      <Content className="claiming">
        {claimingState !== 'success' && claimingState !== 'notqualified' && (
          <>
            <p className="claiming__label">Total Rewards</p>
            <h2 className="claiming__amount">{claimingAmount} LZRD</h2>
            <div className="card">
              <>
                <p className="card__title">Claim your rewards</p>
                <Button
                  onClick={handleClick}
                  className="card__button card__button--claim"
                  type={
                    claimingState === 'network'
                      ? 'default'
                      : claimingState === 'claim'
                      ? 'primary'
                      : 'ghost'
                  }
                  size="large">
                  {claimingState === 'network'
                    ? 'Switch Network to Arbitrum'
                    : claimingState === 'claim'
                    ? 'Claim'
                    : 'undefined'}
                </Button>
              </>
            </div>
          </>
        )}
        {claimingState === 'notqualified' && (
          <>
            <p className="claiming__label claiming__label--notqualified">
              You don´t have any rewards yet.
            </p>
            <h2 className="claiming__social">
              Join our Discord Community <DiscordIcon />
            </h2>
          </>
        )}
        {claimingState === 'success' && (
          <>
            <div className="card card--success">
              <>
                <SuccessIcon />
                <p className="card__title">Succesfully Claimed</p>
              </>
            </div>
            <p className="claiming__label claiming__label--success">
              Make some noise about your achievement!
            </p>
            <div>Tweet here</div>
            <a
              href="https://twitter.com/intent/tweet?text=I have just claimed my LZRD tokens! Check https://transferto.xyz/claiming to see if your eligible, too"
              target="_blank"
              rel="noreferrer">
              <img
                src="https://g.twimg.com/dev/documentation/image/Twitter_logo_blue_16.png"
                alt="Tweet this"
              />
            </a>
          </>
        )}
      </Content>
    </div>
  )
}

export default Claiming
