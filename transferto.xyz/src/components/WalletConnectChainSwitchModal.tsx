import { findDefaultToken, getChainById } from '@lifi/sdk'
import { Button, Typography } from 'antd'

import { useWallet } from '../providers/WalletProvider'
import { readWalletConnectInfo } from '../services/localStorage'

interface Props {
  chainId: number
  okHandler: Function
}

export function WalletConnectChainSwitchModal({ chainId, okHandler }: Props) {
  const { account } = useWallet()
  const chain = getChainById(chainId)
  const walletConnectInfo = readWalletConnectInfo()
  return (
    <>
      <Typography.Title level={4} style={{ marginBottom: 32 }}>
        Please Switch To {chain.name}
      </Typography.Title>
      <Typography.Paragraph>
        Please switch the chain in your connected wallet. You can use the following information to
        manually add it to your wallet, if it's not configured already.
      </Typography.Paragraph>
      <Typography.Paragraph style={{ padding: 16, overflowX: 'scroll' }}>
        Network Name: {chain.name}
        <br />
        RPC Url: {chain.metamask.rpcUrls[0]} <br />
        ChainId: {chain.id}
        <br />
        Symbol: {findDefaultToken(chain.coin, chain.id)?.symbol}
        <br />
        Block Explorer URL: {chain.metamask.blockExplorerUrls[0]}
        <br />
      </Typography.Paragraph>
      <Typography.Paragraph>
        For more information, please visit{' '}
        <a href={walletConnectInfo?.peerMeta.url} target="_blank" rel="noreferrer">
          your wallet provider's website
        </a>
      </Typography.Paragraph>
      <Button
        style={{ display: 'block', margin: ' auto 0 auto auto' }}
        type="link"
        onClick={() => {
          okHandler(account)
        }}>
        <u>OK, done!</u>
      </Button>
    </>
  )
}
