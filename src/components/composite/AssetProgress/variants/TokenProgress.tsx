import type { FC } from 'react';
import { useMemo } from 'react';
import {
  Avatar,
  AvatarPlaceholder,
  AvatarSkeleton,
} from 'src/components/core/AvatarStack/AvatarStack.styles';
import type { Address } from 'viem';
import { useTokens } from '@/hooks/useTokens';
import type { TokenAssetProgressProps } from '../AssetProgress.types';
import { BaseProgress } from './BaseProgress';

export const TokenProgress: FC<Omit<TokenAssetProgressProps, 'variant'>> = ({
  token,
  progress,
  amount,
}) => {
  const { getToken } = useTokens();
  const enhancedToken = useMemo(() => {
    const tokenInner = getToken(token.chain.chainId, token.address as Address);
    return {
      id: (tokenInner?.address ?? token.address) + token.chain.chainId,
      src: tokenInner?.logoURI || '',
      alt: tokenInner?.name || '',
    };
  }, [token, getToken]);

  return (
    <BaseProgress progress={progress} amount={amount}>
      <Avatar
        key={enhancedToken.id}
        src={enhancedToken.src}
        alt={enhancedToken.alt}
        disableBorder
        variant="circular"
      >
        {enhancedToken.alt ? (
          <AvatarPlaceholder color="textSecondary">
            {enhancedToken.alt[0].toUpperCase()}
          </AvatarPlaceholder>
        ) : null}
        <AvatarSkeleton
          key={enhancedToken.id}
          variant="circular"
          sx={{ height: '100%', width: '100%' }}
        />
      </Avatar>
    </BaseProgress>
  );
};
