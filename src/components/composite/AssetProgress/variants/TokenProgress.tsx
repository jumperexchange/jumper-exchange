import { FC, useMemo } from 'react';
import { TokenAssetProgressProps } from '../AssetProgress.types';
import { BaseProgress } from './BaseProgress';
import { useTokens } from 'src/hooks/useTokens';
import {
  Avatar,
  AvatarSkeleton,
} from 'src/components/core/AvatarStack/AvatarStack.styles';

export const TokenProgress: FC<Omit<TokenAssetProgressProps, 'variant'>> = ({
  token,
  progress,
  amount,
}) => {
  const { getTokenByAddressAndChain } = useTokens();
  const enhancedToken = useMemo(() => {
    const _token = getTokenByAddressAndChain(
      token.address,
      token.chain.chainId,
    );
    return {
      id: (_token?.address ?? token.address) + token.chain.chainId,
      src: _token?.logoURI || '',
      alt: _token?.name || '',
    };
  }, [token, getTokenByAddressAndChain]);

  return (
    <BaseProgress progress={progress} amount={amount}>
      <Avatar
        key={enhancedToken.id}
        src={enhancedToken.src}
        alt={enhancedToken.alt}
        disableBorder
        variant="circular"
      >
        <AvatarSkeleton
          key={enhancedToken.id}
          variant="circular"
          sx={{ height: '100%', width: '100%' }}
        />
      </Avatar>
    </BaseProgress>
  );
};
