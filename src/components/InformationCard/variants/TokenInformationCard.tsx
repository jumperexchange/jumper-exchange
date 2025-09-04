'use client';
import InformationCard from 'src/components/InformationCard/InformationCard';
import { ExtendedChain, Token } from '@lifi/sdk';
import { getTokenInfoData } from '../../../app/ui/bridge/utils';

export const TokenInformationCard = ({
  token,
  chains,
}: {
  token: Token;
  chains: ExtendedChain[];
}) => {
  return (
    <InformationCard
      type="Token"
      info={{
        logoURI: token?.logoURI,
        name: `${token.name}`,
      }}
      data={getTokenInfoData(chains, token)}
    />
  );
};
