import type { ChainType } from '@lifi/sdk';
import type { Account } from '@lifi/wallet-management';
import { Typography } from '@mui/material';
import AvatarBadge from 'src/components/AvatarBadge/AvatarBadge';
import { walletDigest } from 'src/utils/walletDigest';
import { WalletCardsContainer } from './WalletCardBox.style';

interface WalletCardBoxProps {
  account: Account;
  chainType: ChainType;
}

export const WalletCardBox = ({ account, chainType }: WalletCardBoxProps) => {
  const addressShort = walletDigest(account.address);

  const avatarSrc =
    chainType === 'EVM'
      ? '/wallet-icon-metamask.svg'
      : '/wallet-icon-phantom.svg';
  const avatarAlt = chainType === 'EVM' ? 'Metamask logo' : 'Phantom logo';
  const badgeSrc =
    chainType === 'EVM' ? '/chain-icon-eth.svg' : '/chain-icon-sol.svg';
  const badgeAlt = chainType === 'EVM' ? 'Ethereum logo' : 'Solana logo';

  return (
    <WalletCardsContainer>
      <AvatarBadge
        avatarAlt={avatarAlt}
        avatarSrc={avatarSrc}
        badgeAlt={badgeAlt}
        badgeSrc={badgeSrc}
        avatarSize={64}
        badgeSize={24}
        badgeOffset={{ x: 8, y: -2 }}
        badgeGap={6}
      />
      <Typography variant="bodyMediumStrong">{addressShort}</Typography>
    </WalletCardsContainer>
  );
};
