import './Claiming.css'

import { LoadingOutlined, WarningOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import { ethers } from 'ethers'
import { useEffect, useMemo, useState } from 'react'

import DiscordIcon from '../../src/assets/icons/discordIcon'
import { SuccessIcon } from '../../src/assets/icons/sucessIcon'
import TwitterIcon from '../../src/assets/icons/twitterIcon'
import claimingContract from '../constants/abis/claimContract.json'
import claims from '../constants/claims.json'
import { useMetatags } from '../hooks/useMetatags'
import { useWallet } from '../providers/WalletProvider'
import { addChain } from '../services/metamask'
import { formatTokenAmount } from '../services/utils'
import { ChainId, Token } from '../types'
import ConnectButton from './web3/ConnectButton'

type ClaimingState =
  | 'connect'
  | 'claimQualified'
  | 'network'
  | 'connected'
  | 'success'
  | 'notQualified'
  | 'error'
  | 'claimPending'

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

  const [alreadyClaimed, setAlreadyClaimed] = useState<Boolean>(false)
  const [claimingState, setClaimingState] = useState<ClaimingState>('connect')
  const [currentAccount, setCurrentAccount] = useState(null)

  function handleAccountsChanged(accounts) {
    if (accounts[0] !== currentAccount) {
      setCurrentAccount(accounts[0])
    }
  }

  const userClaimData = useMemo(
    () => claims.claims.find((claim) => claim.address === account.address),
    [account.address],
  )

  const setup = async () => {
    // check if account is connected
    if (currentAccount === null) {
      const checkWalletConnection = window?.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(handleAccountsChanged)
        .catch((err) => {
          if (err.code === 4001) {
          } else {
            // console.error(err)
          }
        })
    }
    account.chainId !== ChainId.ARB ? setClaimingState('network') : setClaimingState('connected')

    // check if network is set to ARB
    if (claimingState === 'network') {
      try {
        // await switchChain(ChainId.ARB)
        await switchChain(ChainId.ARB)
        await addChain(ChainId.ARB)
        setClaimingState('connected')
      } catch (error: any) {
        // console.log('Error:', error.code)
      }
      return 0
    }

    if (!!account.signer && claimingState === 'connected') {
      if (userClaimData && account.signer && account.chainId === ChainId.ARB) {
        const canClaim = await claimContract.functions.canClaim(
          account.address,
          userClaimData.amount,
          userClaimData.series,
          userClaimData.proof,
        )

        const hash = ethers.utils.solidityKeccak256(
          ['address', 'uint256', 'string'],
          [account.address, userClaimData.amount, userClaimData.series],
        )

        const _alreadyClaimed = await claimContract.functions.claims(hash)
        setAlreadyClaimed(_alreadyClaimed)
        if (canClaim[0]) {
          if (!_alreadyClaimed[0]) {
            setClaimingState('claimQualified')
          }
          if (!!_alreadyClaimed[0]) {
            setClaimingState('success')
          }
        } else {
          setClaimingState('notQualified')
        }
      }
    } else {
      // console.log('wallet is not connected?')
    }

    if (claimingState === 'claimQualified') {
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
    }
  }

  useEffect(() => {
    setup()
  }, [
    userClaimData,
    claimContract.signer,
    account.signer,
    account.chainId,
    currentAccount,
    account.isActive,
  ]) //account.isActive, account.chainId

  // logic
  const handleClick = async () => {
    setup()
  }

  return (
    <div className="site-layout site-layout--claiming">
      <Content className="claiming">
        {claimingState !== 'network' &&
          claimingState !== 'connect' &&
          claimingState !== 'success' &&
          claimingState !== 'notQualified' &&
          claimingState !== 'error' && (
            <>
              <p className="claiming__label">Total Rewards</p>
              <h2 className="claiming__amount">
                {formatTokenAmount(LZRD_TOKEN, userClaimData?.amount)}
              </h2>
              <div className="card">
                <>
                  <p className="card__title">
                    {claimingState === 'claimQualified' ? 'Claim your rewards' : 'Pending'}
                  </p>
                  {claimingState === 'claimQualified' ? (
                    <Button
                      onClick={handleClick}
                      className="card__button card__button--claim"
                      type="primary"
                      size="large">
                      {claimingState === 'claimQualified'
                        ? 'Claim'
                        : claimingState === 'connect'
                        ? 'Connect Wallet'
                        : 'undefined'}
                    </Button>
                  ) : (
                    <LoadingOutlined style={{ color: 'green', fontSize: 100 }} />
                  )}
                </>
              </div>
            </>
          )}
        {claimingState === 'connect' && (
          <>
            <p>Connect your Wallet to see if you are eligible</p>
            <ConnectButton></ConnectButton>
          </>
        )}
        {claimingState === 'network' && (
          <Button
            onClick={handleClick}
            className="card__button card__button--claim"
            type="primary"
            size="large">
            Switch Network to Arbitrum
          </Button>
        )}
        {claimingState === 'notQualified' && (
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
        {claimingState === 'error' && ( // TODO: this is only WIP
          <>
            <div className="card card--success">
              <>
                <WarningOutlined style={{ color: 'red', fontSize: 163 }} />
                <p className="card__title">Error During Transaction </p>
              </>
            </div>
            <p className="claiming__label claiming__label--success">Please try again later</p>
          </>
        )}
      </Content>
    </div>
  )
}

export default Claiming
