'use client';

import { ExtendedChain } from '@lifi/sdk';
import InformationCard from 'src/components/InformationCard/InformationCard';
import { getChainInfoData } from '../../../app/ui/bridge/utils';

interface ChainInformationCardProps {
  chain: ExtendedChain;
  fullWidth?: boolean;
}

export const ChainInformationCard = ({
  chain,
  fullWidth,
}: ChainInformationCardProps) => {
  return (
    <InformationCard
      type="Blockchain"
      fullWidth={fullWidth}
      info={{
        logoURI: chain?.logoURI,
        name: chain.name,
      }}
      data={getChainInfoData(chain)}
    />
  );
};
