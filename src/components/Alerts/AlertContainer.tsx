import {
  MultisigSideAlert,
  SolanaAlert,
  TestnetSideAlert,
} from 'src/components';
import { ChainId } from '@lifi/types';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useChainTokenSelectionStore } from 'src/stores';

export interface AlertContainerProps {
  isMultisig: boolean;
}

export const AlertContainer = ({ isMultisig }: AlertContainerProps) => {
  const { sourceChainToken, destinationChainToken } =
    useChainTokenSelectionStore();

  const solanaSelected = useMemo(() => {
    const isSelected =
      sourceChainToken?.chainId === ChainId.SOL ||
      destinationChainToken?.chainId === ChainId.SOL;
    return isSelected;
  }, [destinationChainToken, sourceChainToken]);

  if (solanaSelected) {
    return <SolanaAlert />;
  } else if (isMultisig) {
    return <MultisigSideAlert />;
  } else if (import.meta.env.MODE === 'testnet') {
    return <TestnetSideAlert />;
  } else {
    return null;
  }
};
