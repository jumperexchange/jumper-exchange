import './Claiming.css'

import { LoadingOutlined, WarningOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import { ethers } from 'ethers'
import { useCallback, useEffect, useMemo, useState } from 'react'

import DiscordIcon from '../../src/assets/icons/discordIcon'
import { SuccessIcon } from '../../src/assets/icons/sucessIcon'
import TwitterIcon from '../../src/assets/icons/twitterIcon'
import claimingContract from '../constants/abis/claimContract.json'
import claims from '../constants/claims.json'
import { useMetatags } from '../hooks/useMetatags'
import { useWallet } from '../providers/WalletProvider'
import { formatTokenAmount } from '../services/utils'
import { ChainId, Token } from '../types'
import ConnectButton from './web3/ConnectButton'

type ClaimingState =
  | 'claimQualified'
  | 'network'
  | 'success'
  | 'notQualified'
  | 'error'
  | 'claimPending'
  | 'notConnected'

const LZRD_TOKEN: Token = {
  address: '0x1a65532d7ffbbb8bab09f4eefd87d8518a630c95',
  symbol: 'LZRD',
  decimals: 18,
  chainId: 42161,
  name: 'Lizard Token',
  priceUSD: '0',
  logoURI: '',
}

const CLAIMING_CONTRACT_ADDRESS = '0x093653bc6d47eae0743200f8c7156ef8d554f23b'

// actual component
const Claiming = () => {
  useMetatags({
    title: 'LI.FI - Claiming',
    description: 'Some Claiming Description',
    'og:title': 'LI.FI - Claim your LZRD',
    'og:image': 'path/to/image.jpg',
    'twitter:card': 'summary',
  })
  //actual state
  const { account, switchChain } = useWallet()
  const claimContract = useMemo(
    () => new ethers.Contract(CLAIMING_CONTRACT_ADDRESS, claimingContract, account.signer),
    [account.signer, account.chainId],
  )

  const [claimingState, setClaimingState] = useState<ClaimingState>('notQualified')

  const userClaimData = useMemo(
    () => claims.claims.find((claim) => claim.address === account.address),
    [account.address],
  )

  const checkEligibility = useCallback(async (): Promise<boolean> => {
    if (userClaimData) {
      const canClaim = await claimContract.functions.canClaim(
        account.address,
        userClaimData.amount,
        userClaimData.series,
        userClaimData.proof,
      )
      return canClaim[0]
    }
    return false
  }, [userClaimData])

  const checkAlreadyClaimed = useCallback(async (): Promise<boolean> => {
    if (userClaimData) {
      const hash = ethers.utils.solidityKeccak256(
        ['address', 'uint256', 'string'],
        [account.address, userClaimData.amount, userClaimData.series],
      )
      const _alreadyClaimed = await claimContract.functions.claims(hash)
      return _alreadyClaimed[0]
    }
    return false
  }, [userClaimData])

  const setup = async () => {
    if (!account.address && !account.chainId && !account.signer) {
      return setClaimingState(() => 'notConnected')
    }

    if (account.chainId !== ChainId.ARB) {
      return setClaimingState(() => 'network')
    }

    if (userClaimData) {
      if (!(await checkEligibility())) return setClaimingState('notQualified')
      if (await checkAlreadyClaimed()) return setClaimingState('success')

      return setClaimingState(() => 'claimQualified')
    } else {
      return setClaimingState(() => 'notQualified')
    }
  }

  useEffect(() => {
    setup()
  }, [userClaimData, account.chainId, account.signer])

  //logic

  const handleClaimTX = useCallback(async () => {
    try {
      setClaimingState('claimPending')
      const claimTX = await claimContract.claim(
        userClaimData!.amount, // TODO: check
        userClaimData!.series,
        userClaimData!.proof,
      )
      await claimTX.wait()

      setClaimingState('success')
    } catch (e) {
      setClaimingState('error')
    }
  }, [userClaimData])

  const cardTitles = useMemo(() => {
    const cardTitles: { [key in ClaimingState]: string } = {
      error: 'An error during the transaction occured',
      claimQualified: 'Totals Rewards',
      network: 'Please switch to Arbitrum to check your claim',
      success: 'Succesfully Claimed',
      notQualified: '',
      claimPending: 'Transaction Pending',
      notConnected: 'Please conncect your wallet to check your eligibility',
    }
    return cardTitles
  }, [])

  const claimingLabel = useMemo(() => {
    const claimingLabel: { [key in ClaimingState]: string } = {
      error: '',
      claimQualified: 'Totals Rewards',
      network: 'Please switch to Arbitrum to check your claim',
      success: '',
      notQualified: 'You don´t have any rewards yet',
      claimPending: 'Totals Rewards',
      notConnected: 'Totals Rewards',
    }
    return claimingLabel
  }, [])

  const cardSuffixClass = useMemo(() => {
    if (claimingState === 'success' || claimingState === 'error') {
      return 'card--transparent'
    }
    if (claimingState === 'notQualified') {
      return 'card--hidden'
    }
    return ''
  }, [claimingState])

  return (
    <div className="site-layout site-layout--claiming">
      <Content className="claiming">
        <>
          <p className="claiming__label">{claimingLabel[claimingState]}</p>
          {(userClaimData && claimingState === 'claimQualified') ||
          claimingState === 'claimPending' ? (
            <h2 className="claiming__amount">
              {formatTokenAmount(LZRD_TOKEN, userClaimData?.amount)}
            </h2>
          ) : null}

          <div className={`card ${cardSuffixClass}`}>
            <CardIcon claimingState={claimingState}></CardIcon>
            <p className="card__title">{cardTitles[claimingState]}</p>
          </div>

          <CardButton
            claimingState={claimingState}
            handler={() => {
              if (claimingState === 'claimQualified') {
                handleClaimTX()
              }
              if (claimingState === 'network') {
                switchChain(ChainId.ARB)
              }
            }}
          />
        </>
      </Content>
    </div>

    // <div className="site-layout site-layout--claiming">
    //   <Content className="claiming">
    //     {claimingState !== 'network' &&
    //       claimingState !== 'success' &&
    //       claimingState !== 'notQualified' &&
    //       claimingState !== 'notConnected' &&
    //       claimingState !== 'error' && (
    //         <>
    //           <p className="claiming__label">Total Rewards</p>
    //           <h2 className="claiming__amount">
    //             {formatTokenAmount(LZRD_TOKEN, userClaimData?.amount)}
    //           </h2>
    //           <div className="card">
    //             <>
    //               <p className="card__title">{cardTitles[claimingState]}</p>
    //               {claimingState === 'claimQualified' ? (
    //                 <Button
    //                   onClick={() => {
    //                     handleClaimTX()
    //                   }}
    //                   className="card__button card__button--claim"
    //                   type="primary"
    //                   size="large">
    //                   Claim
    //                 </Button>
    //               ) : (
    //                 <LoadingOutlined style={{ color: 'green', fontSize: 100 }} />
    //               )}
    //             </>
    //           </div>
    //         </>
    //       )}
    //     {!account && (
    //       <>
    //         <p>Connect your Wallet to see if you are eligible</p>
    //         <ConnectButton size="large"></ConnectButton>
    //       </>
    //     )}
    //     {claimingState === 'notConnected' && (
    //       // <Button
    //       //   onClick={() => {
    //       //     switchChain(ChainId.ARB)
    //       //   }}
    //       //   className="card__button card__button--claim"
    //       //   type="primary"
    //       //   size="large">
    //       //   Switch Network to Arbitrum
    //       // </Button>
    //       <ConnectButton />
    //     )}
    //     {claimingState === 'network' && (
    //       <Button
    //         onClick={() => {
    //           switchChain(ChainId.ARB)
    //         }}
    //         className="card__button card__button--claim"
    //         type="primary"
    //         size="large">
    //         Switch Network to Arbitrum
    //       </Button>
    //     )}
    //     {claimingState === 'notQualified' && (
    //       <>
    //         <p className="claiming__label claiming__label--notqualified">
    //           You don´t have any rewards yet.
    //         </p>
    //         {/* <h2 className="claiming__social">
    //           Join our Discord Community <DiscordIcon />
    //         </h2> */}
    //         <a
    //           className="claiming__share claiming__share--discord"
    //           href="https://discord.gg/lifi"
    //           target="_blank"
    //           rel="noreferrer">
    //           Join our Discord Community
    //           <DiscordIcon />
    //         </a>
    //       </>
    //     )}
    //     {claimingState === 'success' && (
    //       <>
    //         <div className="card card--success">
    //           <>
    //             <SuccessIcon />
    //             <p className="card__title">Succesfully Claimed</p>
    //           </>
    //         </div>
    //         <p className="claiming__label claiming__label--success">
    //           Make some noise about your achievement!
    //         </p>
    //         <a
    //           className="claiming__share"
    //           href="https://twitter.com/intent/tweet?text=I+have+just+claimed+my+LZRD+tokens!+Check+your+wallet+on+https://transferto.xyz/claiming+to+see+if+your+eligible,+too.%23lifiprotocol+%23transfertoxyz+%23multichainbridge"
    //           target="_blank"
    //           rel="noreferrer">
    //           Share this on Twitter
    //           <TwitterIcon />
    //         </a>
    //       </>
    //     )}
    //     {claimingState === 'error' && ( // TODO: this is only WIP
    //       <>
    //         <div className="card card--success">
    //           <>
    //             <WarningOutlined style={{ color: 'red', fontSize: 163 }} />
    //             <p className="card__title">Error During Transaction </p>
    //           </>
    //         </div>
    //         <p className="claiming__label claiming__label--success">Please try again later</p>
    //       </>
    //     )}
    //   </Content>
    // </div>
  )
}

const CardIcon = ({ claimingState }: { claimingState: ClaimingState }) => {
  if (claimingState === 'success') {
    return <SuccessIcon />
  }
  if (claimingState === 'error') {
    return <WarningOutlined style={{ color: 'red', fontSize: 163 }} />
  }

  if (claimingState === 'claimPending') {
    return <LoadingOutlined style={{ color: 'green', fontSize: 100 }} />
  }
  return null
}

const CardButton = ({
  claimingState,
  handler,
}: {
  claimingState: ClaimingState
  handler: Function
}) => {
  if (claimingState === 'claimQualified') {
    return (
      <Button
        onClick={() => {
          handler()
        }}
        className="card__button card__button--claim"
        type="primary"
        size="large">
        Claim
      </Button>
    )
  }
  if (claimingState === 'notConnected') {
    return <ConnectButton className="card__button card__button--claim" size="large"></ConnectButton>
  }

  if (claimingState === 'network') {
    return (
      <Button
        onClick={() => {
          handler()
        }}
        className="card__button card__button--claim"
        type="primary"
        size="large">
        Switch Network to Arbitrum
      </Button>
    )
  }
  return null
}

export default Claiming
