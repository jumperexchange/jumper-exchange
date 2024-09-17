import { Avatar, Button, Tooltip } from '@mui/material';
import Link from 'next/link';
import qs from 'querystring';
import { useTranslation } from 'react-i18next';
import { TypographySecondary } from '@/components/Portfolio/Portfolio.styles';
import { useMenuStore } from '@/stores/menu';
import generateKey from '@/app/lib/generateKey';
import type { ExtendedChain } from '@lifi/sdk';
import type { ExtendedTokenAmount } from '@/utils/getTokens';
import React from 'react';

export function buildUrl(chain: ExtendedChain, token: ExtendedTokenAmount) {
  return {
    fromChain: chain.id,
    fromToken: token.address,
  };
}

interface CoinLinkProps {
  children: React.ReactNode;
  chain: ExtendedChain;
  token: ExtendedTokenAmount;
  style?: any;
}

function CoinLink({ chain, token, children, style = {} }: CoinLinkProps) {
  // const { setWalletMenuState } = useMenuStore((state) => state);

  return (
    <Link
      href={`/?${qs.stringify(buildUrl(chain, token))}`}
      passHref
      style={style}
      key={generateKey(`${chain}-${token}`)}
      onClick={(event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        // setWalletMenuState(false);
      }}
    >
      {children}
    </Link>
  );
}

export default CoinLink;
