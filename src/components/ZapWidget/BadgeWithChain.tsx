import { useChains } from '@/hooks/useChains';
import { useMemo } from 'react';
import AvatarBadge from '../AvatarBadge/AvatarBadge';

interface BadgeWithChainProps {
  logoURI: string;
  alt: string;
  chainId?: number;
  logoSize?: number;
  badgeSize?: number;
}

// TODO: Refactorize code to use this function everytime we need to display chain as badge
function BadgeWithChain({
  alt,
  logoURI,
  chainId,
  logoSize,
  badgeSize,
}: BadgeWithChainProps) {
  const { chains, getChainById } = useChains();
  const chainMetadata = useMemo(
    () => chainId && getChainById(chainId),
    [chainId, chains],
  );

  if (!chainMetadata) {
    return <AvatarBadge avatarSize={40} avatarSrc={logoURI} alt="Protocol" />;
  }

  return (
    <AvatarBadge
      avatarSize={logoSize ?? 40}
      badgeSize={badgeSize}
      badgeSrc={chainMetadata?.logoURI}
      avatarSrc={logoURI}
      alt={alt}
    />
  );
}

export default BadgeWithChain;
