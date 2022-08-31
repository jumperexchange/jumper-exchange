import './Claiming.css'

import { Button } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import { useEffect, useMemo, useState } from 'react'

import DiscordIcon from '../../src/assets/icons/discordIcon'
import { SuccessIcon } from '../../src/assets/icons/sucessIcon'
import TwitterIcon from '../../src/assets/icons/twitterIcon'
import claims from '../constants/claims.json'
import { useMetatags } from '../hooks/useMetatags'
import { useWallet } from '../providers/WalletProvider'
import { formatTokenAmount } from '../services/utils'
import { ChainId, Token } from '../types'

type ClaimingState = 'network' | 'claim' | 'success' | 'notqualified'

const LZRD_TOKEN: Token = {
  address: '0x1a65532d7ffbbb8bab09f4eefd87d8518a630c95',
  symbol: 'LZRD',
  decimals: 18,
  chainId: 42161,
  name: 'Lizard Token',
  priceUSD: '0',
  logoURI: '',
}

// actual component
const Claiming = () => {
  useMetatags({
    title: 'LI.FI - Claiming',
    description: 'Some Claiming Description',
    'og:title': 'LI.FI - Claim your LZRD',
    'og:image': 'path/to/image.jpg',
    'twitter:card': 'summary',
  })

  // dummy data
  const [claimingAmount] = useState(0.1)

  //actual state
  const { account, switchChain } = useWallet()

  const userClaim = useMemo(
    () => claims.claims.find((claim) => claim.address === account.address),
    [account.address],
  )

  const qualifiedSubstate: 'claim' | 'notqualified' = useMemo(() => {
    if (!userClaim) return 'notqualified'
    return 'claim'
  }, [userClaim])

  const [claimingState, setClaimingState] = useState<ClaimingState>(
    account.chainId !== ChainId.ARB ? 'network' : qualifiedSubstate,
  )
  useEffect(() => {
    setClaimingState(account.chainId !== ChainId.ARB ? 'network' : qualifiedSubstate)
  }, [account.chainId])

  // logic
  const handleClick = async () => {
    if (claimingState === 'network') {
      await switchChain(ChainId.ARB)
    }
    if (claimingState === 'claim') {
      alert(
        `User ${account.address?.substring(0, 5)}... claimed ${formatTokenAmount(
          LZRD_TOKEN,
          userClaim?.amount,
        )}`,
      )
      if (claimingAmount > 0) {
        setClaimingState('success')
      } else {
        setClaimingState('notqualified')
      }
    }
  }

  return (
    <div className="site-layout site-layout--claiming">
      <Content className="claiming">
        {claimingState !== 'success' && claimingState !== 'notqualified' && (
          <>
            <p className="claiming__label">Total Rewards</p>
            <h2 className="claiming__amount">{formatTokenAmount(LZRD_TOKEN, userClaim?.amount)}</h2>
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
            {/* <h2 className="claiming__social">
              Join our Discord Community <DiscordIcon />
            </h2> */}
            <a
              className="claiming__share claiming__share--discord"
              href="https://discord.gg/lifi"
              target="_blank"
              rel="noreferrer">
              Join our Discord Community
              <DiscordIcon />
            </a>
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
            <a
              className="claiming__share"
              href="https://twitter.com/intent/tweet?text=I+have+just+claimed+my+LZRD+tokens!+Check+your+wallet+on+https://transferto.xyz/claiming+to+see+if+your+eligible,+too.%23lifiprotocol+%23transfertoxyz+%23multichainbridge"
              target="_blank"
              rel="noreferrer">
              Share this on Twitter
              <TwitterIcon />
            </a>
          </>
        )}
      </Content>
    </div>
  )
}

export default Claiming
