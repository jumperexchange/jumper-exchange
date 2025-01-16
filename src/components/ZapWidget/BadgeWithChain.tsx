import { Avatar, Badge } from '@mui/material';
import TokenImage from '@/components/Portfolio/TokenImage';
import { useChains } from '@/hooks/useChains';
import { useMemo } from 'react';

interface BadgeWithChainProps {
  logoURI: string;
  alt: string;
  chainId?: number;
}

// TODO: Refactorize code to use this function everytime we need to display chain as badge
function BadgeWithChain({ alt, logoURI, chainId }: BadgeWithChainProps) {
  const { chains, getChainById } = useChains();
  const chainMetadata = useMemo(
    () => chainId && getChainById(chainId),
    [chainId, chains],
  );

  if (!chainMetadata) {
    return <Avatar alt="Protocol" src={logoURI} />;
  }

  return (
    <Badge
      overlap="circular"
      className="badge"
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      badgeContent={
        <Avatar
          sx={{
            width: 16,
            height: 16,
          }}
        >
          <TokenImage
            token={{
              logoURI: chainMetadata?.logoURI,
              name: chainMetadata?.name ?? '',
            }}
          />
        </Avatar>
      }
    >
      <Avatar alt={alt} src={logoURI} />
    </Badge>
  );
}

export default BadgeWithChain;
